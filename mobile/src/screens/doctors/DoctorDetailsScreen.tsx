import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { DoctorService } from '../../services/doctorService';
import { LocationService } from '../../services/location/locationService';
import { GeofenceService } from '../../services/location/geofenceService';
import { Doctor, GeofenceStatus } from '../../types';

interface DoctorDetailsScreenProps {
  doctorId: string;
  onBack: () => void;
  onStartVisit: (doctor: Doctor, isGeofenceOk: boolean, distanceMeters: number) => void;
}

export const DoctorDetailsScreen: React.FC<DoctorDetailsScreenProps> = ({
  doctorId,
  onBack,
  onStartVisit,
}) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [geofenceEval, setGeofenceEval] = useState<{
    status: GeofenceStatus;
    distanceMeters: number;
    isWithinRadius: boolean;
    statusText: string;
  }>({
    status: 'NOT_STARTED',
    distanceMeters: 0,
    isWithinRadius: false,
    statusText: 'Checking satellite distance...'
  });
  const [checkingLocation, setCheckingLocation] = useState(false);

  useEffect(() => {
    DoctorService.getDoctorById(doctorId).then(doc => {
      setDoctor(doc);
      if (doc) checkGeofence(doc);
    });
  }, [doctorId]);

  const checkGeofence = async (doc: Doctor) => {
    setCheckingLocation(true);
    const loc = await LocationService.getCurrentLocation();
    setCheckingLocation(false);

    if (loc) {
      const evaluation = GeofenceService.evaluateGeofence(
        doc.latitude,
        doc.longitude,
        loc.latitude,
        loc.longitude,
        loc.accuracyMeters,
        doc.geofenceRadiusMeters
      );
      setGeofenceEval(evaluation);
    } else {
      setGeofenceEval({
        status: 'LOCATION_ACCURACY_LOW',
        distanceMeters: 0,
        isWithinRadius: false,
        statusText: 'GPS fix unavailable. Please check location permissions.'
      });
    }
  };

  if (!doctor) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Header title={doctor.name} subtitle={doctor.specialty} showBack onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Card */}
        <Card>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>{doctor.name}</Text>
              <Text style={styles.docQual}>{doctor.qualification}</Text>
              <Text style={styles.docSpecialty}>Specialty: {doctor.specialty}</Text>
            </View>
            <Badge label={`Tier ${doctor.tier}`} variant="primary" />
          </View>
        </Card>

        {/* 100m Clinic Geofence Status Card */}
        <Card style={geofenceEval.isWithinRadius ? styles.geofenceCardOk : styles.geofenceCardWarn}>
          <View style={styles.geofenceHeader}>
            <Text style={styles.geofenceTitle}>📍 Clinic Geofence Verification</Text>
            <TouchableOpacity onPress={() => checkGeofence(doctor)}>
              <Text style={styles.recheckText}>{checkingLocation ? 'Checking...' : '↻ Recheck'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.geofenceStatusText}>{geofenceEval.statusText}</Text>
          <Text style={styles.geofenceDetails}>
            Clinic Coordinates: {doctor.latitude.toFixed(4)}, {doctor.longitude.toFixed(4)} • Radius: {doctor.geofenceRadiusMeters}m
          </Text>
        </Card>

        {/* Clinic Details */}
        <Card>
          <Text style={styles.sectionTitle}>Clinic Information</Text>
          <Text style={styles.clinicName}>🏥 {doctor.clinicName}</Text>
          <Text style={styles.clinicAddr}>{doctor.clinicAddress}</Text>
          <Text style={styles.clinicPhone}>📞 {doctor.phone}</Text>
        </Card>

        {/* Target & History */}
        <Card>
          <Text style={styles.sectionTitle}>Visit Target & Compliance</Text>
          <Text style={styles.historyText}>Monthly Target: {doctor.monthlyVisitTarget} calls</Text>
          <Text style={styles.historyText}>Completed This Month: {doctor.completedVisitsThisMonth} calls</Text>
          <Text style={styles.historyText}>Last Visit Logged: {doctor.lastVisitDate || 'No visits this month'}</Text>
        </Card>

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <Button
            title={geofenceEval.isWithinRadius ? "✓ Start Geofence Verified Visit" : "Start Visit (Flagged Location)"}
            onPress={() => onStartVisit(doctor, geofenceEval.isWithinRadius, geofenceEval.distanceMeters)}
            variant={geofenceEval.isWithinRadius ? "primary" : "outline"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  docName: { color: colors.textPrimary, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.black },
  docQual: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginTop: 2 },
  docSpecialty: { color: colors.primaryDark, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, marginTop: 4 },
  geofenceCardOk: { backgroundColor: colors.successLight, borderColor: colors.success },
  geofenceCardWarn: { backgroundColor: colors.warningLight, borderColor: colors.warning },
  geofenceHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  geofenceTitle: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  recheckText: { color: colors.primaryDark, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  geofenceStatusText: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  geofenceDetails: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 4 },
  sectionTitle: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, marginBottom: spacing.xs },
  clinicName: { color: colors.textPrimary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  clinicAddr: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginTop: 2 },
  clinicPhone: { color: colors.primary, fontSize: typography.fontSize.sm, marginTop: 4, fontWeight: typography.fontWeight.semibold },
  historyText: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginTop: 3 },
  ctaContainer: { marginTop: spacing.md },
});
