import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { RouteService } from '../../services/routeService';
import { RouteChangeRequest } from '../../types';

interface CommandsScreenProps {
  onBack: () => void;
}

export const CommandsScreen: React.FC<CommandsScreenProps> = ({ onBack }) => {
  const [requests, setRequests] = useState<RouteChangeRequest[]>([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const list = await RouteService.getRouteChangeRequests();
    setRequests(list);
  };

  const handleAction = async (requestId: string, approve: boolean) => {
    await RouteService.adminReviewRequest(requestId, approve);
    await loadRequests();
    Alert.alert(
      approve ? 'Request Approved' : 'Request Rejected',
      approve ? 'New route activated for field representative.' : 'Request has been rejected.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Commands & Approvals"
        subtitle="Admin Operations & Route Governance"
        showBack
        onBack={onBack}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>??? Regional Manager Admin Console</Text>
          <Text style={styles.bannerDesc}>
            Review and govern live route deviations submitted by medical representatives across Cachar, Karimganj, and Hailakandi.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Pending & Recent Route Requests</Text>

        {requests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No route deviation requests pending at this time.</Text>
          </View>
        ) : (
          requests.map(req => (
            <View key={req.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.repName}>?? {req.employeeName}</Text>
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

              <Text style={styles.routeFromTo}>
                Current: <Text style={styles.boldText}>{req.currentRouteName}</Text>
              </Text>
              <Text style={styles.routeFromTo}>
                Requested: <Text style={styles.targetText}>{req.requestedRouteName}</Text>
              </Text>

              <View style={styles.reasonBox}>
                <Text style={styles.reasonLabel}>Justification:</Text>
                <Text style={styles.reasonText}>"{req.reason}"</Text>
              </View>

              {req.status === 'PENDING_APPROVAL' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.btn, styles.approveBtn]}
                    onPress={() => handleAction(req.id, true)}
                  >
                    <Text style={styles.btnText}>? Approve Route</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, styles.rejectBtn]}
                    onPress={() => handleAction(req.id, false)}
                  >
                    <Text style={styles.btnText}>? Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  banner: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg },
  bannerTitle: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: '#1E40AF' },
  bannerDesc: { fontSize: typography.fontSize.xs, color: '#1E3A8A', marginTop: 2, lineHeight: 18 },
  sectionTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: '#0F172A', marginBottom: spacing.md },
  emptyCard: { backgroundColor: '#FFFFFF', padding: spacing.xl, borderRadius: radius.lg, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  emptyText: { color: '#64748B', fontSize: typography.fontSize.sm },
  card: { backgroundColor: '#FFFFFF', borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: '#E2E8F0' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  repName: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: '#0F172A' },
  routeFromTo: { fontSize: typography.fontSize.xs, color: '#475569', marginTop: 2 },
  boldText: { fontWeight: typography.fontWeight.bold, color: '#1E3A8A' },
  targetText: { fontWeight: typography.fontWeight.bold, color: '#2563EB' },
  reasonBox: { backgroundColor: '#F8FAFC', padding: spacing.sm, borderRadius: radius.md, marginTop: spacing.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  reasonLabel: { fontSize: typography.fontSize.xxs, color: '#94A3B8', fontWeight: typography.fontWeight.bold },
  reasonText: { fontSize: typography.fontSize.xs, color: '#334155', fontStyle: 'italic', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  btn: { flex: 1, paddingVertical: spacing.sm + 2, borderRadius: radius.md, alignItems: 'center' },
  approveBtn: { backgroundColor: '#10B981' },
  rejectBtn: { backgroundColor: '#EF4444' },
  btnText: { color: '#FFFFFF', fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.xs },
});
