import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { VisitService } from '../../services/visitService';
import { LocationService } from '../../services/location/locationService';
import { Doctor, VisitRecord } from '../../types';

interface VisitExecutionScreenProps {
  doctor: Doctor;
  isGeofenceVerified: boolean;
  distanceMeters: number;
  onBack: () => void;
  onVisitComplete: () => void;
}

export const VisitExecutionScreen: React.FC<VisitExecutionScreenProps> = ({
  doctor,
  isGeofenceVerified,
  distanceMeters,
  onBack,
  onVisitComplete,
}) => {
  const [discussionNotes, setDiscussionNotes] = useState('Detailed presentation on CardioSafe-AM and GlycoControl-M.');
  const [doctorFeedback, setDoctorFeedback] = useState('Doctor agreed to prescribe for 5 new patients.');
  const [samplesDistributed, setSamplesDistributed] = useState(2);
  const [saving, setSaving] = useState(false);

  const handleCompleteVisit = async () => {
    setSaving(true);
    const loc = await LocationService.getCurrentLocation();

    await VisitService.createVisit({
      doctorId: doctor.id,
      doctorName: doctor.name,
      clinicName: doctor.clinicName,
      employeeId: 'usr-mr-01',
      employeeName: 'Vikram Mehta',
      date: new Date().toISOString().split('T')[0],
      checkInTimestamp: new Date().toISOString(),
      checkInLatitude: loc?.latitude || doctor.latitude,
      checkInLongitude: loc?.longitude || doctor.longitude,
      checkInAccuracyMeters: loc?.accuracyMeters || 10,
      checkInDistanceMeters: distanceMeters,
      isGeofenceVerified,
      visitDurationMinutes: 12,
      visitPurpose: 'ROUTINE_CALL',
      discussionNotes,
      productsDiscussed: ['CardioSafe-AM', 'GlycoControl-M'],
      samplesDistributed: [
        { productId: 'prd-01', productName: 'CardioSafe-AM', quantity: samplesDistributed }
      ],
      doctorFeedback,
      status: 'COMPLETED'
    });

    setSaving(false);
    Alert.alert('Visit Completed', 'DCR call report submitted and queued for cloud sync.', [
      { text: 'OK', onPress: onVisitComplete }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Conduct Clinic Call" subtitle={doctor.name} showBack onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Verification Status Banner */}
        <Card style={isGeofenceVerified ? styles.cardVerified : styles.cardWarning}>
          <View style={styles.rowBetween}>
            <Text style={styles.bannerTitle}>
              {isGeofenceVerified ? '✓ 100m Clinic Geofence Verified' : '⚠️ Outside Geofence (Flagged)'}
            </Text>
            <Badge label={isGeofenceVerified ? 'VERIFIED' : 'FLAGGED'} variant={isGeofenceVerified ? 'success' : 'warning'} />
          </View>
          <Text style={styles.bannerSub}>
            Recorded Distance: {distanceMeters}m from {doctor.clinicName}
          </Text>
        </Card>

        {/* Discussion Details Card */}
        <Card>
          <Text style={styles.sectionTitle}>Call Details & Product Detailing</Text>
          <Input
            label="Key Discussion Notes"
            value={discussionNotes}
            onChangeText={setDiscussionNotes}
            multiline
            numberOfLines={3}
          />

          <Input
            label="Doctor Feedback & Rx Commitment"
            value={doctorFeedback}
            onChangeText={setDoctorFeedback}
            multiline
            numberOfLines={2}
          />

          <View style={styles.sampleRow}>
            <Text style={styles.sampleLabel}>Samples Distributed (Boxes):</Text>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                onPress={() => setSamplesDistributed(Math.max(0, samplesDistributed - 1))}
                style={styles.qtyBtn}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyVal}>{samplesDistributed}</Text>
              <TouchableOpacity
                onPress={() => setSamplesDistributed(samplesDistributed + 1)}
                style={styles.qtyBtn}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Complete Visit CTA */}
        <Button
          title="Submit DCR Call Report"
          onPress={handleCompleteVisit}
          loading={saving}
          variant="primary"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  cardVerified: { backgroundColor: colors.successLight, borderColor: colors.success },
  cardWarning: { backgroundColor: colors.warningLight, borderColor: colors.warning },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerTitle: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  bannerSub: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 4 },
  sectionTitle: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, marginBottom: spacing.md },
  sampleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: spacing.md },
  sampleLabel: { color: colors.textSecondary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  qtyBtnText: { color: colors.textPrimary, fontSize: 18, fontWeight: 'bold' },
  qtyVal: { color: colors.textPrimary, fontSize: 16, fontWeight: 'bold' },
});
