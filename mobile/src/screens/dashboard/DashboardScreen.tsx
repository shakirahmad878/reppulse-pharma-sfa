import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AuthService } from '../../services/authService';
import { DoctorService } from '../../services/doctorService';
import { OrderService } from '../../services/orderService';
import { SyncService } from '../../services/sync/syncService';
import { UserProfile, Doctor } from '../../types';

interface DashboardScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pobTotal, setPobTotal] = useState(5839.79);
  const [orderCount, setOrderCount] = useState(1);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const docs = await DoctorService.getDoctors();
    setDoctors(docs);
    const orders = await OrderService.getOrders();
    if (orders.length > 0) {
      setOrderCount(orders.length);
      const sum = orders.reduce((acc, o) => acc + o.grandTotal, 0);
      setPobTotal(sum);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const completedVisits = doctors.filter(d => d.todayVisitStatus === 'COMPLETED').length;
  const pendingVisits = doctors.filter(d => d.todayVisitStatus === 'PENDING').length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
    >
      {/* Representative Header Brief */}
      <View style={styles.repHeader}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.repName}>{user?.name || 'Vikram Mehta'}</Text>
          <Text style={styles.repTerritory}>📍 {user?.territory || 'Bandra West & Khar Zone'}</Text>
        </View>
        <Badge label={isPunchedIn ? 'On Duty' : 'Standby'} variant={isPunchedIn ? 'success' : 'warning'} />
      </View>

      {/* Attendance & Shift Card */}
      <Card style={styles.shiftCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Daily Attendance & Telemetry</Text>
          <Text style={styles.telemetryTag}>⏱️ 15-Min GPS Active</Text>
        </View>
        <Text style={styles.cardDesc}>
          Punch in with a geotagged selfie to start automated 15-minute background location telemetry.
        </Text>
        <Button
          title={isPunchedIn ? "✓ Shift Active (View Attendance)" : "🤳 Geotagged Selfie Punch In"}
          onPress={() => onNavigate('ATTENDANCE')}
          variant={isPunchedIn ? "secondary" : "primary"}
        />
      </Card>

      {/* Primary KPI Metrics Grid */}
      <View style={styles.metricsGrid}>
        <TouchableOpacity style={styles.metricCard} onPress={() => onNavigate('DOCTORS')}>
          <Text style={styles.metricNumber}>{doctors.length}</Text>
          <Text style={styles.metricLabel}>Assigned Doctors</Text>
          <Text style={styles.metricSub}>{completedVisits} Completed • {pendingVisits} Pending</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.metricCard} onPress={() => onNavigate('ORDERS')}>
          <Text style={styles.metricNumber}>₹{Math.round(pobTotal).toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Today's POB Value</Text>
          <Text style={styles.metricSub}>{orderCount} Chemist Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Action Shortcuts */}
      <Text style={styles.sectionTitle}>Field Operations</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionTile} onPress={() => onNavigate('DOCTORS')}>
          <Text style={styles.actionIcon}>👨‍⚕️</Text>
          <Text style={styles.actionTitle}>Doctor Directory</Text>
          <Text style={styles.actionSub}>Check-in & geofence</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionTile} onPress={() => onNavigate('ORDERS')}>
          <Text style={styles.actionIcon}>💊</Text>
          <Text style={styles.actionTitle}>Book POB Order</Text>
          <Text style={styles.actionSub}>Secondary sales</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionTile} onPress={() => onNavigate('SYNC')}>
          <Text style={styles.actionIcon}>🔄</Text>
          <Text style={styles.actionTitle}>Sync Center</Text>
          <Text style={styles.actionSub}>Offline records</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionTile} onPress={() => onNavigate('PROFILE')}>
          <Text style={styles.actionIcon}>👤</Text>
          <Text style={styles.actionTitle}>Rep Profile</Text>
          <Text style={styles.actionSub}>Battery & privacy</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Doctor Call List Quick View */}
      <View style={styles.todayVisitsHeader}>
        <Text style={styles.sectionTitle}>Today's Clinic Targets</Text>
        <TouchableOpacity onPress={() => onNavigate('DOCTORS')}>
          <Text style={styles.viewAllText}>View All ›</Text>
        </TouchableOpacity>
      </View>

      {doctors.slice(0, 3).map((doc) => (
        <Card key={doc.id} style={styles.doctorItemCard}>
          <View style={styles.docRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>{doc.name}</Text>
              <Text style={styles.docSpecialty}>{doc.specialty} • {doc.clinicName}</Text>
              <Text style={styles.docArea}>📍 {doc.area} (100m Geofence)</Text>
            </View>
            <Badge
              label={doc.todayVisitStatus}
              variant={doc.todayVisitStatus === 'COMPLETED' ? 'success' : 'warning'}
            />
          </View>
          <TouchableOpacity
            style={styles.docVisitBtn}
            onPress={() => onNavigate('DOCTOR_DETAILS', { doctorId: doc.id })}
          >
            <Text style={styles.docVisitBtnText}>Start Clinic Visit ›</Text>
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  repHeader: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  greeting: { color: colors.textSecondary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold },
  repName: { color: colors.textPrimary, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.black },
  repTerritory: { color: colors.primaryDark, fontSize: typography.fontSize.xs, marginTop: 2, fontWeight: typography.fontWeight.medium },
  shiftCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  cardTitle: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold },
  telemetryTag: { color: colors.primary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  cardDesc: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginBottom: spacing.md, lineHeight: 18 },
  metricsGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricNumber: { color: colors.textPrimary, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.black },
  metricLabel: { color: colors.textSecondary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, marginTop: 2 },
  metricSub: { color: colors.primaryDark, fontSize: typography.fontSize.xs, marginTop: 4 },
  sectionTitle: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, marginBottom: spacing.sm },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  actionTile: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: { fontSize: 24, marginBottom: spacing.xs },
  actionTitle: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  actionSub: { color: colors.textMuted, fontSize: typography.fontSize.xs, marginTop: 2 },
  todayVisitsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  viewAllText: { color: colors.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  doctorItemCard: { marginBottom: spacing.sm },
  docRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  docName: { color: colors.textPrimary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  docSpecialty: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  docArea: { color: colors.textMuted, fontSize: typography.fontSize.xs, marginTop: 2 },
  docVisitBtn: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.surfaceSecondary, alignItems: 'flex-end' },
  docVisitBtnText: { color: colors.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
});
