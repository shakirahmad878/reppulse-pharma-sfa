import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';
import { SyncService } from '../../services/sync/syncService';

export const NetworkBanner: React.FC = () => {
  const [syncStats, setSyncStats] = useState({ pending: 0, syncing: 0, synced: 0, failed: 0 });

  useEffect(() => {
    const unsub = SyncService.subscribe(setSyncStats);
    return () => unsub();
  }, []);

  const totalPending = syncStats.pending + syncStats.syncing;

  return (
    <View style={styles.banner}>
      <View style={styles.leftRow}>
        <View style={styles.dot} />
        <Text style={styles.statusText}>Field Duty Active</Text>
      </View>
      {totalPending > 0 ? (
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingText}>⚡ {totalPending} Offline Pending</Text>
        </View>
      ) : (
        <Text style={styles.syncedText}>✓ All Data Synced</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.accentNavy,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  pendingText: {
    color: colors.warning,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  syncedText: {
    color: colors.primaryLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
});
