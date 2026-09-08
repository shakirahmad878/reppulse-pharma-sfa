import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { RouteService } from '../../services/routeService';
import { RoutePlan, MonthlyTourProgramme, MTPDayPlan, RouteChangeRequest } from '../../types';

interface RoutePlanScreenProps {
  onBack: () => void;
}

export const RoutePlanScreen: React.FC<RoutePlanScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'MTP_MONTH' | 'ALL_BEATS'>('MTP_MONTH');
  const [mtp, setMtp] = useState<MonthlyTourProgramme | null>(null);
  const [routes, setRoutes] = useState<RoutePlan[]>([]);
  const [activeRoute, setActiveRoute] = useState<RoutePlan | null>(null);
  const [requests, setRequests] = useState<RouteChangeRequest[]>([]);
  
  // Deviation Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDayPlan, setSelectedDayPlan] = useState<MTPDayPlan | null>(null);
  const [targetRouteId, setTargetRouteId] = useState<string>('');
  const [deviationReason, setDeviationReason] = useState<string>('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const mtpData = await RouteService.getMonthlyTourPlan();
    setMtp(mtpData);
    const routeList = await RouteService.getRoutes();
    setRoutes(routeList);
    const active = await RouteService.getActiveRoute();
    setActiveRoute(active);
    const reqList = await RouteService.getRouteChangeRequests();
    setRequests(reqList);
  };

  const handleOpenDeviation = (day: MTPDayPlan) => {
    if (day.isSunday) {
      Alert.alert('Sunday Off', 'Sunday is scheduled as weekly rest & offline sync day.');
      return;
    }
    setSelectedDayPlan(day);
    setTargetRouteId(routes[0]?.id || 'route-cachar-01');
    setDeviationReason('');
    setModalVisible(true);
  };

  const handleSubmitDeviation = async () => {
    if (!selectedDayPlan) return;
    if (!deviationReason.trim()) {
      Alert.alert('Reason Required', 'Please provide a clear justification for deviating from the approved MTP.');
      return;
    }

    const req = await RouteService.requestMTPDeviation(
      selectedDayPlan.dayNumber,
      targetRouteId,
      deviationReason
    );
    setModalVisible(false);
    await loadData();
    Alert.alert(
      'MTP Deviation Submitted',
      'Request for ' + req.dateString + ' -> ' + req.requestedRouteName + ' submitted to RBM. Status: PENDING APPROVAL.'
    );
  };

  const handleAdminApproval = async (requestId: string, approve: boolean) => {
    await RouteService.adminReviewRequest(requestId, approve);
    await loadData();
    Alert.alert(
      approve ? 'MTP Deviation Approved' : 'Deviation Rejected',
      approve ? 'Updated beat activated for the representative.' : 'Request has been rejected.'
    );
  };

  const todayDateNum = new Date().getDate();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Monthly Tour Plan (MTP)"
        subtitle="Barak Valley Division (Assam) • Sep 2026"
        showBack
        onBack={onBack}
      />

      {/* Mode Switcher: 30-Day MTP Calendar | All Barak Beats */}
      <View style={styles.tabSwitcherRow}>
        <TouchableOpacity
          style={[styles.tabSwitchBtn, activeTab === 'MTP_MONTH' && styles.tabSwitchBtnActive]}
          onPress={() => setActiveTab('MTP_MONTH')}
        >
          <Text style={[styles.tabSwitchText, activeTab === 'MTP_MONTH' && styles.tabSwitchTextActive]}>
            📅 30-Day MTP Schedule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabSwitchBtn, activeTab === 'ALL_BEATS' && styles.tabSwitchBtnActive]}
          onPress={() => setActiveTab('ALL_BEATS')}
        >
          <Text style={[styles.tabSwitchText, activeTab === 'ALL_BEATS' && styles.tabSwitchTextActive]}>
            🗺️ All Barak Beats ({routes.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'MTP_MONTH' ? (
          <>
            {/* MTP Month Approval Header Banner */}
            <View style={styles.mtpHeroBanner}>
              <View style={styles.bannerTopRow}>
                <Text style={styles.bannerMonthTitle}>September 2026 Advance Tour Plan</Text>
                <Badge label="APPROVED BY RBM" variant="success" />
              </View>
              <Text style={styles.bannerSub}>
                Authorized by: {mtp?.approvedBy || 'Rajesh Sharma (RBM)'}
              </Text>

              {/* Monthly KPI Overview */}
              <View style={styles.kpiRow}>
                <View style={styles.kpiCol}>
                  <Text style={styles.kpiVal}>{mtp?.totalWorkingDays || 26}</Text>
                  <Text style={styles.kpiLbl}>Working Days</Text>
                </View>
                <View style={styles.kpiCol}>
                  <Text style={styles.kpiVal}>{mtp?.totalPlannedDoctorCalls || 240}</Text>
                  <Text style={styles.kpiLbl}>Doctor Calls</Text>
                </View>
                <View style={styles.kpiCol}>
                  <Text style={styles.kpiVal}>{mtp?.totalPlannedChemistCalls || 96}</Text>
                  <Text style={styles.kpiLbl}>Chemist Calls</Text>
                </View>
                <View style={styles.kpiCol}>
                  <Text style={styles.kpiVal}>4 Days</Text>
                  <Text style={styles.kpiLbl}>Joint Working</Text>
                </View>
              </View>
            </View>

            {/* Admin Toggle Row */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>30-Day Daily Tour Schedule</Text>
              <TouchableOpacity
                onPress={() => setIsAdminMode(!isAdminMode)}
                style={styles.adminToggleBtn}
              >
                <Text style={styles.adminToggleText}>
                  {isAdminMode ? '🛡️ Admin Review Mode (ON)' : '👤 Rep Mode'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Requests Section if any */}
            {requests.length > 0 && (
              <View style={styles.requestsSection}>
                <Text style={styles.subSectionTitle}>Active Deviation Requests ({requests.length})</Text>
                {requests.map(req => (
                  <View key={req.id} style={styles.reqCard}>
                    <View style={styles.reqHeader}>
                      <Text style={styles.reqDate}>{req.dateString || 'Day Target'}</Text>
                      <Badge
                        label={req.status.replace('_', ' ')}
                        variant={req.status === 'APPROVED' ? 'success' : req.status === 'REJECTED' ? 'danger' : 'warning'}
                      />
                    </View>
                    <Text style={styles.reqText}>Target: <Text style={styles.boldText}>{req.requestedRouteName}</Text></Text>
                    <Text style={styles.reqReason}>Reason: "{req.reason}"</Text>

                    {isAdminMode && req.status === 'PENDING_APPROVAL' && (
                      <View style={styles.adminActionRow}>
                        <TouchableOpacity
                          style={[styles.adminBtn, styles.approveBtn]}
                          onPress={() => handleAdminApproval(req.id, true)}
                        >
                          <Text style={styles.adminBtnText}>✓ Approve Deviation</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.adminBtn, styles.rejectBtn]}
                          onPress={() => handleAdminApproval(req.id, false)}
                        >
                          <Text style={styles.adminBtnText}>✕ Reject</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Daily Timeline Cards */}
            {mtp?.days.map(day => {
              const isToday = day.dayNumber === todayDateNum;
              return (
                <View
                  key={day.dayNumber}
                  style={[
                    styles.dayCard,
                    isToday && styles.dayCardToday,
                    day.isSunday && styles.dayCardSunday,
                  ]}
                >
                  <View style={styles.dayTopRow}>
                    <View style={styles.dateCircle}>
                      <Text style={[styles.dayNum, isToday && styles.dayNumToday]}>{day.dayNumber}</Text>
                      <Text style={styles.dayWk}>{day.dayOfWeek}</Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <View style={styles.routeHeaderRow}>
                        <Text style={[styles.dayRouteName, isToday && styles.dayRouteNameToday]} numberOfLines={1}>
                          {day.routeName}
                        </Text>
                        {isToday && <Badge label="TODAY" variant="primary" />}
                        {day.isSunday && <Badge label="OFF" variant="muted" />}
                      </View>

                      {!day.isSunday && (
                        <View style={styles.dayMetaRow}>
                          <Text style={styles.dayMetaText}>🎯 {day.targetDoctorCalls} Dr Calls • {day.targetChemistCalls} Chemist</Text>
                          {day.isJointWorking && (
                            <View style={styles.jointTag}>
                              <Text style={styles.jointTagText}>👔 Joint: {day.accompaniedName}</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </View>

                  {!day.isSunday && (
                    <View style={styles.dayFooterRow}>
                      <Text style={styles.districtTag}>📍 {day.district} District</Text>
                      <TouchableOpacity
                        style={styles.deviateBtn}
                        onPress={() => handleOpenDeviation(day)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.deviateBtnText}>Change Beat ›</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        ) : (
          <>
            {/* All Barak Division Beats Directory */}
            <Text style={styles.sectionTitle}>Barak Division Standard Master Beats</Text>
            <Text style={styles.sectionSubtitle}>Pre-configured territory circuits for Cachar, Karimganj, and Hailakandi</Text>

            {routes.map(route => {
              const isActive = route.id === activeRoute?.id;
              return (
                <View
                  key={route.id}
                  style={[styles.masterBeatCard, isActive && styles.masterBeatCardActive]}
                >
                  <View style={styles.beatHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.beatCode}>{route.code} • {route.district} District</Text>
                      <Text style={styles.beatName}>{route.name}</Text>
                    </View>
                    <Badge label={isActive ? 'TODAYS BEAT' : 'STANDARD'} variant={isActive ? 'primary' : 'muted'} />
                  </View>
                  <Text style={styles.beatDesc}>{route.description}</Text>

                  <View style={styles.areasTagWrap}>
                    {route.areas.map((area, idx) => (
                      <View key={idx} style={styles.areaChip}>
                        <Text style={styles.areaChipText}>📍 {area}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.beatFooter}>
                    <Text style={styles.beatStats}>
                      👨‍⚕️ {route.totalDoctors} Doctors • 🏥 {route.totalHospitals} Hospitals • 💊 {route.totalChemists} Chemists
                    </Text>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* MTP Deviation Request Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Request MTP Route Deviation</Text>
            <Text style={styles.modalSubtitle}>
              For: {selectedDayPlan?.dateString} ({selectedDayPlan?.routeName})
            </Text>

            <Text style={styles.inputLabel}>Select Proposed Replacement Beat:</Text>
            <View style={styles.routePickerWrap}>
              {routes.map(r => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.routePickerItem, targetRouteId === r.id && styles.routePickerItemActive]}
                  onPress={() => setTargetRouteId(r.id)}
                >
                  <Text style={[styles.routePickerText, targetRouteId === r.id && styles.routePickerTextActive]}>
                    {r.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Reason for Month Plan Deviation (Mandatory):</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="e.g. Urgent key doctor call at SMCH or priority stockist order followup."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={deviationReason}
              onChangeText={setDeviationReason}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSubmitBtn]}
                onPress={handleSubmitDeviation}
              >
                <Text style={styles.modalSubmitText}>Submit to RBM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  tabSwitcherRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabSwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radius.md,
  },
  tabSwitchBtnActive: {
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  tabSwitchText: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: '#64748B' },
  tabSwitchTextActive: { color: '#1D4ED8', fontWeight: typography.fontWeight.bold },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  mtpHeroBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#3B82F6',
    ...shadows.card,
  },
  bannerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerMonthTitle: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.black, color: '#0F172A' },
  bannerSub: { fontSize: typography.fontSize.xs, color: '#2563EB', marginTop: 2, fontWeight: typography.fontWeight.semibold },
  kpiRow: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'space-around',
  },
  kpiCol: { alignItems: 'center' },
  kpiVal: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: '#1D4ED8' },
  kpiLbl: { fontSize: typography.fontSize.xxs, color: '#64748B', marginTop: 2 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: '#0F172A' },
  sectionSubtitle: { fontSize: typography.fontSize.xs, color: '#64748B', marginBottom: spacing.md },
  adminToggleBtn: { backgroundColor: '#DBEAFE', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full },
  adminToggleText: { fontSize: typography.fontSize.xs, color: '#1E40AF', fontWeight: typography.fontWeight.bold },
  requestsSection: { marginBottom: spacing.lg },
  subSectionTitle: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: '#1E3A8A', marginBottom: spacing.xs },
  reqCard: { backgroundColor: '#FFFFFF', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: '#E2E8F0' },
  reqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reqDate: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: '#0F172A' },
  reqText: { fontSize: typography.fontSize.xs, color: '#475569', marginTop: 4 },
  boldText: { fontWeight: typography.fontWeight.bold, color: '#1D4ED8' },
  reqReason: { fontSize: typography.fontSize.xs, color: '#64748B', fontStyle: 'italic', marginTop: 2 },
  adminActionRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, paddingTop: spacing.xs, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  adminBtn: { flex: 1, paddingVertical: 6, borderRadius: radius.sm, alignItems: 'center' },
  approveBtn: { backgroundColor: '#10B981' },
  rejectBtn: { backgroundColor: '#EF4444' },
  adminBtnText: { color: '#FFFFFF', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.subtle,
  },
  dayCardToday: {
    borderColor: '#3B82F6',
    borderWidth: 2,
    backgroundColor: '#F8FAFC',
  },
  dayCardSunday: {
    backgroundColor: '#F1F5F9',
    opacity: 0.8,
  },
  dayTopRow: { flexDirection: 'row', alignItems: 'center' },
  dateCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  dayNum: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.black, color: '#1D4ED8' },
  dayNumToday: { color: '#2563EB' },
  dayWk: { fontSize: typography.fontSize.xxs, color: '#64748B', fontWeight: typography.fontWeight.bold },
  routeHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayRouteName: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: '#0F172A', flex: 1 },
  dayRouteNameToday: { color: '#1D4ED8' },
  dayMetaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  dayMetaText: { fontSize: typography.fontSize.xxs, color: '#64748B' },
  jointTag: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.xs },
  jointTagText: { fontSize: typography.fontSize.xxs, color: '#B45309', fontWeight: typography.fontWeight.bold },
  dayFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm, paddingTop: spacing.xs, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  districtTag: { fontSize: typography.fontSize.xxs, color: '#64748B' },
  deviateBtn: { paddingVertical: 2 },
  deviateBtnText: { fontSize: typography.fontSize.xs, color: '#2563EB', fontWeight: typography.fontWeight.bold },
  masterBeatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.subtle,
  },
  masterBeatCardActive: {
    borderColor: '#3B82F6',
    borderWidth: 1.5,
  },
  beatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  beatCode: { fontSize: typography.fontSize.xxs, fontWeight: typography.fontWeight.bold, color: '#2563EB' },
  beatName: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: '#0F172A', marginTop: 2 },
  beatDesc: { fontSize: typography.fontSize.xs, color: '#64748B', marginTop: spacing.xs, lineHeight: 18 },
  areasTagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
  areaChip: { backgroundColor: '#F1F5F9', borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  areaChipText: { fontSize: typography.fontSize.xxs, color: '#475569' },
  beatFooter: { marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  beatStats: { fontSize: typography.fontSize.xs, color: '#1E3A8A', fontWeight: typography.fontWeight.semibold },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'center', padding: spacing.lg },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: radius.xl, padding: spacing.xl, ...shadows.floating },
  modalTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: '#0F172A' },
  modalSubtitle: { fontSize: typography.fontSize.xs, color: '#2563EB', fontWeight: typography.fontWeight.semibold, marginBottom: spacing.md },
  inputLabel: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: '#475569', marginBottom: spacing.xs },
  routePickerWrap: { marginBottom: spacing.md, maxHeight: 140 },
  routePickerItem: { backgroundColor: '#F8FAFC', padding: spacing.sm, borderRadius: radius.sm, marginBottom: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  routePickerItemActive: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
  routePickerText: { fontSize: typography.fontSize.xs, color: '#334155' },
  routePickerTextActive: { color: '#1D4ED8', fontWeight: typography.fontWeight.bold },
  reasonInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: radius.md, padding: spacing.md, fontSize: typography.fontSize.sm, color: '#0F172A', height: 75, textAlignVertical: 'top', marginBottom: spacing.lg },
  modalBtnRow: { flexDirection: 'row', gap: spacing.md },
  modalBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  modalCancelBtn: { backgroundColor: '#F1F5F9' },
  modalCancelText: { color: '#475569', fontWeight: typography.fontWeight.semibold },
  modalSubmitBtn: { backgroundColor: '#3B82F6' },
  modalSubmitText: { color: '#FFFFFF', fontWeight: typography.fontWeight.bold },
});
