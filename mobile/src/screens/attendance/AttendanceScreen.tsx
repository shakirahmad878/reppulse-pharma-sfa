import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LocationService, LocationResult } from '../../services/location/locationService';
import { BackgroundTelemetryManager } from '../../services/location/backgroundTelemetry';
import { SyncService } from '../../services/sync/syncService';
import { AttendanceRecord } from '../../types';

interface AttendanceScreenProps {
  onBack: () => void;
}

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ onBack }) => {
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<string | null>(null);
  const [selfieCaptured, setSelfieCaptured] = useState(false);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoadingLoc(true);
    const loc = await LocationService.getCurrentLocation();
    setLocation(loc);
    setLoadingLoc(false);
  };

  const handleCaptureSelfie = () => {
    // Simulates front-camera selfie capture & compression (< 150KB)
    setSelfieCaptured(true);
    Alert.alert('Selfie Captured', 'Front-camera photo compressed and geotagged with GPS coordinates.');
  };

  const handlePunchIn = async () => {
    if (!selfieCaptured) {
      Alert.alert('Selfie Required', 'Please take an attendance selfie before punching in.');
      return;
    }

    const currentLoc = location || (await LocationService.getCurrentLocation());
    if (!currentLoc) {
      Alert.alert('GPS Required', 'Unable to acquire satellite lock. Please enable location services.');
      return;
    }

    const record: AttendanceRecord = {
      id: `att_${Date.now()}`,
      employeeId: 'usr-mr-01',
      employeeName: 'Vikram Mehta',
      date: new Date().toISOString().split('T')[0],
      punchInTimestamp: new Date().toISOString(),
      latitude: currentLoc.latitude,
      longitude: currentLoc.longitude,
      accuracyMeters: currentLoc.accuracyMeters,
      selfieBase64OrUri: 'data:image/jpeg;base64,mock_compressed_selfie_hash',
      isMockLocation: currentLoc.isMockLocation,
      batteryPercentage: 92,
      status: 'PUNCHED_IN',
      syncStatus: 'PENDING'
    };

    // Enqueue in offline sync queue
    await SyncService.enqueue('ATTENDANCE', record);

    // Start 15-minute background location telemetry
    await BackgroundTelemetryManager.startTracking();

    setIsPunchedIn(true);
    setPunchInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    Alert.alert(
      'Punch In Successful',
      'Attendance verified with GPS & Selfie. 15-minute background location worker is now active.'
    );
  };

  const handlePunchOut = async () => {
    await BackgroundTelemetryManager.stopTracking();
    setIsPunchedIn(false);
    setSelfieCaptured(false);
    Alert.alert('Shift Ended', 'Punched out successfully. Background telemetry stopped.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Daily Attendance" subtitle="Geotagged Selfie & GPS Lock" showBack onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Card */}
        <Card>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusTitle}>Today's Duty Status</Text>
              <Text style={styles.statusTime}>
                {isPunchedIn ? `Punched In at ${punchInTime}` : 'Not Checked In'}
              </Text>
            </View>
            <Badge label={isPunchedIn ? 'PRESENT' : 'NOT STARTED'} variant={isPunchedIn ? 'success' : 'warning'} />
          </View>
        </Card>

        {/* GPS Verification Card */}
        <Card>
          <View style={styles.statusRow}>
            <Text style={styles.sectionHeader}>Location Satellite Lock</Text>
            <TouchableOpacity onPress={fetchLocation}>
              <Text style={styles.refreshLink}>{loadingLoc ? 'Locking...' : '↻ Refresh GPS'}</Text>
            </TouchableOpacity>
          </View>

          {location ? (
            <View style={styles.locBox}>
              <Text style={styles.locCoords}>Latitude: {location.latitude.toFixed(6)}</Text>
              <Text style={styles.locCoords}>Longitude: {location.longitude.toFixed(6)}</Text>
              <Text style={styles.locAcc}>Accuracy: ±{location.accuracyMeters.toFixed(1)}m (High Accuracy Lock)</Text>
              {location.isMockLocation && (
                <Text style={styles.mockWarn}>⚠️ Warning: Mock GPS detected</Text>
              )}
            </View>
          ) : (
            <Text style={styles.locWait}>Waiting for satellite fix...</Text>
          )}
        </Card>

        {/* Selfie Camera Verification Box */}
        <Card>
          <Text style={styles.sectionHeader}>Front-Camera Selfie</Text>
          <Text style={styles.cameraDesc}>
            Take a clear photo in daylight. Photo is compressed (under 150KB) and timestamped.
          </Text>

          <View style={styles.selfiePlaceholder}>
            {selfieCaptured ? (
              <View style={styles.selfieDone}>
                <Text style={styles.selfieEmoji}>✓ 🤳</Text>
                <Text style={styles.selfieDoneText}>Selfie Ready for Submission</Text>
              </View>
            ) : (
              <Text style={styles.selfiePlaceholderText}>No selfie captured yet</Text>
            )}
          </View>

          <Button
            title={selfieCaptured ? "Retake Selfie" : "📷 Open Camera & Take Selfie"}
            onPress={handleCaptureSelfie}
            variant="outline"
          />
        </Card>

        {/* Actions */}
        <View style={styles.actionContainer}>
          {isPunchedIn ? (
            <Button title="📸 Punch Out (End Duty)" onPress={handlePunchOut} variant="danger" />
          ) : (
            <Button title="Confirm Punch In & Start Shift" onPress={handlePunchIn} variant="primary" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusTitle: { color: colors.textPrimary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  statusTime: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  sectionHeader: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, marginBottom: spacing.xs },
  refreshLink: { color: colors.primary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  locBox: { backgroundColor: colors.surfaceSecondary, padding: spacing.md, borderRadius: radius.md, marginTop: spacing.xs },
  locCoords: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontFamily: 'monospace' },
  locAcc: { color: colors.success, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, marginTop: 4 },
  mockWarn: { color: colors.danger, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, marginTop: 4 },
  locWait: { color: colors.textMuted, fontSize: typography.fontSize.sm, fontStyle: 'italic', marginTop: spacing.xs },
  cameraDesc: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginBottom: spacing.md },
  selfiePlaceholder: {
    height: 140,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderDark,
  },
  selfiePlaceholderText: { color: colors.textMuted, fontSize: typography.fontSize.sm },
  selfieDone: { alignItems: 'center' },
  selfieEmoji: { fontSize: 32 },
  selfieDoneText: { color: colors.primaryDark, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, marginTop: 4 },
  actionContainer: { marginTop: spacing.md },
});
