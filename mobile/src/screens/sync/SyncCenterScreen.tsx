import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SyncService } from '../../services/sync/syncService';
import { SyncQueueItem } from '../../types';

interface SyncCenterScreenProps {
  onBack: () => void;
}

export const SyncCenterScreen: React.FC<SyncCenterScreenProps> = ({ onBack }) => {
  const [stats, setStats] = useState({ pending: 0, syncing: 0, synced: 0, failed: 0 });
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [syncing, setSyncing] = useState(false);

  const loadQueue = async () => {
    const q = await SyncService.getQueue();
    setQueue(q);
  };

  useEffect(() => {
    const unsub = SyncService.subscribe(s => {
      setStats(s);
      loadQueue();
    });
    loadQueue();
    return () => unsub();
  }, []);

  const handleSyncNow = async () => {
    setSyncing(true);
    await SyncService.processQueue();
    setSyncing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Sync Center" subtitle="Offline Queue & Cloud Dispatch" showBack onBack={onBack} />
      
      <View style={styles.content}>
        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { borderColor: colors.warning }]}>
            <Text style={[styles.statVal, { color: colors.warning }]}>{stats.pending}</Text>
            <Text style={styles.statLbl}>Pending</Text>
          </View>
          <View style={[styles.statBox, { borderColor: colors.info }]}>
            <Text style={[styles.statVal, { color: colors.info }]}>{stats.syncing}</Text>
            <Text style={styles.statLbl}>Syncing</Text>
          </View>
          <View style={[styles.statBox, { borderColor: colors.success }]}>
            <Text style={[styles.statVal, { color: colors.success }]}>{stats.synced}</Text>
            <Text style={styles.statLbl}>Synced</Text>
          </View>
          <View style={[styles.statBox, { borderColor: colors.danger }]}>
            <Text style={[styles.statVal, { color: colors.danger }]}>{stats.failed}</Text>
            <Text style={styles.statLbl}>Failed</Text>
          </View>
        </View>

        <Button
          title={syncing ? "Synchronizing Records..." : "🔄 Sync All Offline Records Now"}
          onPress={handleSyncNow}
          loading={syncing}
          variant="primary"
        />

        {/* Queue Items List */}
        <Text style={styles.sectionTitle}>Queued Records</Text>
        <FlatList
          data={queue}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: spacing.xxxl }}
          renderItem={({ item }) => (
            <Card style={styles.queueCard}>
              <View style={styles.queueRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.entityName}>{item.entityType.replace('_', ' ')}</Text>
                  <Text style={styles.createdDate}>Created: {new Date(item.createdAt).toLocaleTimeString()}</Text>
                  {item.lastError ? <Text style={styles.errorText}>Error: {item.lastError}</Text> : null}
                </View>
                <Badge
                  label={item.status}
                  variant={
                    item.status === 'SYNCED'
                      ? 'success'
                      : item.status === 'FAILED'
                      ? 'danger'
                      : item.status === 'SYNCING'
                      ? 'info'
                      : 'warning'
                  }
                />
              </View>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, flex: 1 },
  statsGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  statVal: { fontSize: 20, fontWeight: 'bold' },
  statLbl: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  sectionTitle: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, marginVertical: spacing.md },
  queueCard: { marginBottom: spacing.sm },
  queueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  entityName: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  createdDate: { color: colors.textMuted, fontSize: typography.fontSize.xs, marginTop: 2 },
  errorText: { color: colors.danger, fontSize: typography.fontSize.xs, marginTop: 2 },
});
