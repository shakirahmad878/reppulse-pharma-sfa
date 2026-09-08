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
import { RoutePlan, RouteChangeRequest } from '../../types';

interface RoutePlanScreenProps {
  onBack: () => void;
}

export const RoutePlanScreen: React.FC<RoutePlanScreenProps> = ({ onBack }) => {
  const [routes, setRoutes] = useState<RoutePlan[]>([]);
  const [activeRoute, setActiveRoute] = useState<RoutePlan | null>(null);
  const [requests, setRequests] = useState<RouteChangeRequest[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNewRouteId, setSelectedNewRouteId] = useState<string>('');
  const [deviationReason, setDeviationReason] = useState<string>('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const list = await RouteService.getRoutes();
    setRoutes(list);
    const active = await RouteService.getActiveRoute();
    setActiveRoute(active);
    const reqs = await RouteService.getRouteChangeRequests();
    setRequests(reqs);
  };

  const handleSelectRoute = async (route: RoutePlan) => {
    if (route.id === activeRoute?.id) return;
    setSelectedNewRouteId(route.id);
    setDeviationReason('');
    setModalVisible(true);
  };

  const handleSubmitDeviation = async () => {
    if (!deviationReason.trim()) {
      Alert.alert('Reason Required', 'Please enter a reason for deviating from your scheduled route.');
      return;
    }

    const req = await RouteService.requestRouteChange(selectedNewRouteId, deviationReason);
    setModalVisible(false);
    await loadData();
    Alert.alert(
      'Request Submitted',
      'Your route change request for "' + req.requestedRouteName + '" has been submitted to Admin. Status: PENDING APPROVAL.'
    );
  };

  const handleAdminApproval = async (requestId: string, approve: boolean) => {
    await RouteService.adminReviewRequest(requestId, approve);
    await loadData();
    Alert.alert(
      approve ? 'Route Approved' : 'Route Rejected',
      approve ? 'Active route updated for representative.' : 'Deviation request rejected.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Route Plan and Beat"
        subtitle="Barak Valley Division (Assam)"
        showBack
        onBack={onBack}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Active Route Hero Card */}
        <View style={styles.activeCard}>
          <View style={styles.activeHeaderRow}>
            <Text style={styles.activeTag}>TODAYS ACTIVE ROUTE</Text>
            <Badge label="APPROVED AND ACTIVE" variant="success" />
          </View>
          <Text style={styles.activeRouteTitle}>{activeRoute?.name || 'Loading...'}</Text>
          <Text style={styles.activeRouteDesc}>{activeRoute?.description}</Text>
          
          <View style={styles.activeStatsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{activeRoute?.totalDoctors || 0}</Text>
              <Text style={styles.statLbl}>Doctors</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{activeRoute?.totalHospitals || 0}</Text>
              <Text style={styles.statLbl}>Hospitals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{activeRoute?.totalChemists || 0}</Text>
              <Text style={styles.statLbl}>Chemists</Text>
            </View>
          </View>
        </View>

        {/* Route Change Requests Status */}
        {requests.length > 0 && (
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Route Deviation Requests</Text>
              <TouchableOpacity
                onPress={() => setIsAdminMode(!isAdminMode)}
                style={styles.adminToggleBtn}
              >
                <Text style={styles.adminToggleText}>
                  {isAdminMode ? '🛡️ Admin Mode (ON)' : '👤 Rep View'}
                </Text>
              </TouchableOpacity>
            </View>

            {requests.map(req => (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.reqTopRow}>
                  <Text style={styles.reqTarget}>{req.requestedRouteName}</Text>
                  <Badge
                    label={req.status.replace('_', ' ')}
                    variant={
                      req.status === 'APPROVED'
                        ? 'success'
                        : req.status === 'REJECTED'
                        ? 'danger'
                        : 'warning'
                    }
                  />
                </View>
                <Text style={styles.reqReason}>📝 "{req.reason}"</Text>
                <Text style={styles.reqTime}>
                  Submitted: {new Date(req.requestTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>

                {isAdminMode && req.status === 'PENDING_APPROVAL' && (
                  <View style={styles.adminActionRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleAdminApproval(req.id, true)}
                    >
                      <Text style={styles.actionBtnText}>✓ Approve Route</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleAdminApproval(req.id, false)}
                    >
                      <Text style={styles.actionBtnText}>✕ Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Available Routes in Barak Division */}
        <Text style={styles.sectionTitle}>All Barak Division Routes</Text>
        <Text style={styles.sectionSubtitle}>
          Tap any route to switch. Route deviations require Admin approval.
        </Text>

        {routes.map(route => {
          const isActive = route.id === activeRoute?.id;
          return (
            <TouchableOpacity
              key={route.id}
              style={[styles.routeItemCard, isActive && styles.routeItemCardActive]}
              activeOpacity={0.8}
              onPress={() => handleSelectRoute(route)}
            >
              <View style={styles.routeHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.routeCode, isActive && styles.routeCodeActive]}>
                    {route.code} • {route.district} District
                  </Text>
                  <Text style={styles.routeName}>{route.name}</Text>
                </View>
                <Badge
                  label={isActive ? 'ACTIVE' : route.isAssigned ? 'ASSIGNED' : 'TRANSFERABLE'}
                  variant={isActive ? 'primary' : 'muted'}
                />
              </View>

              <View style={styles.areasTagRow}>
                {route.areas.map((area, idx) => (
                  <View key={idx} style={styles.areaTag}>
                    <Text style={styles.areaTagText}>📍 {area}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.routeFooterRow}>
                <Text style={styles.routeCoverage}>
                  {route.totalDoctors} Doctors • {route.totalHospitals} Hospitals • {route.totalChemists} Chemists
                </Text>
                {!isActive && (
                  <Text style={styles.switchText}>Request Switch ›</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Deviation Request Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Request Route Change</Text>
            <Text style={styles.modalSubtitle}>
              Target: {routes.find(r => r.id === selectedNewRouteId)?.name}
            </Text>

            <Text style={styles.inputLabel}>Reason for Route Deviation (Required for Admin):</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="e.g. Urgent doctor call requested at SMCH Ghungoor or emergency sample delivery."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
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
                <Text style={styles.modalSubmitText}>Submit to Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  activeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  activeTag: {
    fontSize: typography.fontSize.xxs + 1,
    fontWeight: typography.fontWeight.black,
    color: '#2563EB',
    letterSpacing: 0.8,
  },
  activeRouteTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
    color: '#0F172A',
    marginTop: 2,
  },
  activeRouteDesc: {
    fontSize: typography.fontSize.xs,
    color: '#64748B',
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  activeStatsRow: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#1D4ED8',
  },
  statLbl: {
    fontSize: typography.fontSize.xxs,
    color: '#64748B',
    fontWeight: typography.fontWeight.semibold,
  },
  sectionWrapper: {
    marginBottom: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.xs,
    color: '#64748B',
    marginBottom: spacing.md,
  },
  adminToggleBtn: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  adminToggleText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#1E40AF',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reqTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reqTarget: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
    flex: 1,
  },
  reqReason: {
    fontSize: typography.fontSize.xs,
    color: '#475569',
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  reqTime: {
    fontSize: typography.fontSize.xxs,
    color: '#94A3B8',
    marginTop: 4,
  },
  adminActionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#10B981',
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  routeItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.subtle,
  },
  routeItemCardActive: {
    borderColor: '#3B82F6',
    borderWidth: 1.5,
    backgroundColor: '#F8FAFC',
  },
  routeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routeCode: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: '#64748B',
  },
  routeCodeActive: {
    color: '#2563EB',
  },
  routeName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
    marginTop: 2,
  },
  areasTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  areaTag: {
    backgroundColor: '#F1F5F9',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  areaTagText: {
    fontSize: typography.fontSize.xxs,
    color: '#475569',
  },
  routeFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: spacing.xs,
  },
  routeCoverage: {
    fontSize: typography.fontSize.xs,
    color: '#64748B',
  },
  switchText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#2563EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.floating,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: typography.fontSize.xs,
    color: '#2563EB',
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: '#475569',
    marginBottom: spacing.xs,
  },
  reasonInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.sm,
    color: '#0F172A',
    height: 90,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  modalCancelBtn: {
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    color: '#475569',
    fontWeight: typography.fontWeight.semibold,
  },
  modalSubmitBtn: {
    backgroundColor: '#3B82F6',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.bold,
  },
});
