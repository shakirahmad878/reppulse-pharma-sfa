import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';

interface AuxScreenProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  type: 'EXPENSES' | 'LEAVES' | 'FILES' | 'NOTIFICATIONS';
}

export const AuxScreen: React.FC<AuxScreenProps> = ({ title, subtitle, onBack, type }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title={title} subtitle={subtitle} showBack onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {type === 'EXPENSES' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily Travel & Daily Allowance (TA/DA)</Text>
            <Text style={styles.cardDesc}>
              Barak Division HQ Silchar: ?450/day. Outstation (Karimganj / Hailakandi): ?750/day.
            </Text>
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>Silchar Central Route Travel</Text>
              <Text style={styles.itemVal}>?450.00 (Approved)</Text>
            </View>
          </View>
        )}

        {type === 'LEAVES' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Leave Balance & Approvals</Text>
            <Text style={styles.cardDesc}>Casual Leaves: 8 remaining | Sick Leaves: 6 remaining.</Text>
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>Last Leave: 12 Aug 2026</Text>
              <Text style={styles.itemVal}>Approved</Text>
            </View>
          </View>
        )}

        {type === 'FILES' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Product Literature & Visual Aids</Text>
            <Text style={styles.cardDesc}>Downloadable e-detailing flipcharts and clinical study brochures.</Text>
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>?? CardioPulse-AM Visual Aid.pdf</Text>
              <Text style={styles.itemVal}>4.2 MB</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>?? CefoPulse Clinical Efficacy Study.pdf</Text>
              <Text style={styles.itemVal}>6.8 MB</Text>
            </View>
          </View>
        )}

        {type === 'NOTIFICATIONS' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Field Broadcasts</Text>
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>?? New Incentive Scheme Active for Barak Valley</Text>
              <Text style={styles.itemVal}>Today</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>?? Telemetry sync verified by Indore HQ</Text>
              <Text style={styles.itemVal}>Yesterday</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  card: { backgroundColor: '#FFFFFF', borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: '#0F172A', marginBottom: 4 },
  cardDesc: { fontSize: typography.fontSize.xs, color: '#64748B', marginBottom: spacing.md },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  itemText: { fontSize: typography.fontSize.xs, color: '#334155', fontWeight: typography.fontWeight.medium },
  itemVal: { fontSize: typography.fontSize.xs, color: '#2563EB', fontWeight: typography.fontWeight.bold },
});
