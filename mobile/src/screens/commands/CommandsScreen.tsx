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
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { RouteService } from '../../services/routeService';
import { RouteChangeRequest } from '../../types';

interface CommandsScreenProps {
  onBack: () => void;
}

export const CommandsScreen: React.FC<CommandsScreenProps> = ({ onBack }) => {
  const [requests, setRequests] = useState<RouteChangeRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    const reqs = await RouteService.getRouteRequests();
    setRequests(reqs);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (reqId: string) => {
    await RouteService.approveRouteRequest(reqId, 'Admin approval granted for Barak Valley route adjustment.');
    Alert.alert('Route Request Approved', 'The representative has been notified and route target updated.');
    await loadRequests();
  };

  const handleReject = async (reqId: string) => {
    await RouteService.rejectRouteRequest(reqId, 'Rejected: Maintain pre-scheduled route plan.');
    Alert.alert('Route Request Rejected', 'The request has been declined.');
    await loadRequests();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Commands & Approvals"
        subtitle="Area Business Manager Admin Console"
        showBack
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.bannerBox}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" />
          <View style={{ marginLeft: spacing.sm }}>
            <Text style={styles.bannerTitle}>Regional Manager Admin Console</Text>
            <Text style={styles.bannerSub}>Review field route deviation requests for Barak Valley</Text>
          </View>
        </View>

        {requests.length === 0 ? (
          <Card>
            <View style={styles.emptyBox}>
              <Ionicons name="checkmark-done-circle-outline" size={44} color="#16A34A" />
              <Text style={styles.emptyTitle}>No Pending Route Requests</Text>
              <Text style={styles.emptySub}>All MR route plans for September 2026 are aligned with pre-approved MTP.</Text>
            </View>
          </Card>
        ) : (
          requests.map(req => (
            <Card key={req.id}>
              <View style={styles.reqHeader}>
                <View>
                  <Text style={styles.repName}>👤 {req.employeeName}</Text>
                  <Text style={styles.reqDate}>{new Date(req.requestTimestamp).toLocaleString()}</Text>
                </View>
                <Badge
                  label={req.status}
                  variant={req.status === 'APPROVED' ? 'success' : req.status === 'REJECTED' ? 'danger' : 'warning'}
                />
              </View>

              <View style={styles.routeDiffBox}>
                <Text style={styles.routeFrom}>Original: {req.currentRouteName}</Text>
                <Ionicons name="arrow-forward" size={14} color="#3B82F6" style={{ marginVertical: 2 }} />
                <Text style={styles.routeTo}>Requested: {req.requestedRouteName}</Text>
              </View>

              <Text style={styles.reasonLabel}>Reason:</Text>
              <Text style={styles.reasonText}>"{req.reason}"</Text>

              {req.status === 'PENDING_APPROVAL' && (
                <View style={styles.actionRow}>
                  <View style={{ flex: 1, marginRight: spacing.xs }}>
                    <Button
                      title="Approve Deviation"
                      onPress={() => handleApprove(req.id)}
                      variant="primary"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.xs }}>
                    <Button
                      title="Reject"
                      onPress={() => handleReject(req.id)}
                      variant="danger"
                    />
                  </View>
                </View>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  bannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  bannerTitle: { color: '#FFFFFF', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  bannerSub: { color: '#BFDBFE', fontSize: typography.fontSize.xs, marginTop: 1 },
  emptyBox: { alignItems: 'center', padding: spacing.lg },
  emptyTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginTop: spacing.xs },
  emptySub: { fontSize: typography.fontSize.xs, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  reqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  repName: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  reqDate: { fontSize: typography.fontSize.xs, color: colors.textSecondary },
  routeDiffBox: { backgroundColor: '#F8FAFC', padding: spacing.sm, borderRadius: radius.md, marginVertical: spacing.xs },
  routeFrom: { fontSize: typography.fontSize.xs, color: '#DC2626', fontWeight: typography.fontWeight.semibold },
  routeTo: { fontSize: typography.fontSize.xs, color: '#16A34A', fontWeight: typography.fontWeight.bold },
  reasonLabel: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginTop: 4 },
  reasonText: { fontSize: typography.fontSize.xs, fontStyle: 'italic', color: colors.textSecondary, marginBottom: spacing.sm },
  actionRow: { flexDirection: 'row', marginTop: spacing.xs },
});
