import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

interface AuxScreenProps {
  title?: string;
  subtitle?: string;
  onBack: () => void;
  type?: 'NOTIFICATIONS' | 'EXPENSES' | 'LEAVES' | 'FILES';
}

export const AuxScreen: React.FC<AuxScreenProps> = ({ title, subtitle, onBack, type = 'EXPENSES' }) => {
  if (type === 'NOTIFICATIONS') return <NotificationsScreen onBack={onBack} />;
  if (type === 'LEAVES') return <LeavesScreen onBack={onBack} />;
  if (type === 'FILES') return <FilesScreen onBack={onBack} />;
  return <ExpensesScreen onBack={onBack} />;
};

export const NotificationsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <SafeAreaView style={styles.container}>
    <Header title="Notifications" subtitle="HQ Broadcasts & Circulars" showBack onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.itemRow}>
          <Ionicons name="megaphone-outline" size={20} color="#2563EB" />
          <Text style={styles.itemText}>New Incentive Scheme Active for Barak Valley</Text>
        </View>
        <Text style={styles.itemSub}>Special Q3 rewards on CardioPulse & CefoPulse-CV prescriptions in Silchar, Hailakandi & Karimganj.</Text>
      </Card>
      <Card>
        <View style={styles.itemRow}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#16A34A" />
          <Text style={styles.itemText}>Telemetry sync verified by Assam Regional HQ</Text>
        </View>
        <Text style={styles.itemSub}>All 15-minute background location points logged successfully.</Text>
      </Card>
    </ScrollView>
  </SafeAreaView>
);

export const ExpensesScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <SafeAreaView style={styles.container}>
    <Header title="Daily Allowances & TA/DA" subtitle="Barak Division Field Expenses" showBack onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.sectionTitle}>Daily Allowance (DA) Structure</Text>
        <Text style={styles.infoRow}>• HQ (Silchar Central Beat): ₹250 / day</Text>
        <Text style={styles.infoRow}>• Ex-HQ (Karimganj / Hailakandi Beats): ₹450 / day</Text>
        <Text style={styles.infoRow}>• Outstation (Badarpur / Lala / Patharkandi): ₹750 / day</Text>
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>Travel Allowance (TA) Policy</Text>
        <Text style={styles.infoRow}>• Two-Wheeler Reimbursement: ₹4.50 / km</Text>
        <Text style={styles.infoRow}>• Public Transit (Auto/Bus/Train): As per actual ticket bills</Text>
      </Card>
    </ScrollView>
  </SafeAreaView>
);

export const LeavesScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <SafeAreaView style={styles.container}>
    <Header title="Leave Management" subtitle="Apply & Track Field Leave" showBack onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.sectionTitle}>Leave Balance (Calendar Year 2026)</Text>
        <Text style={styles.infoRow}>• Casual Leaves (CL): 8 Days Available</Text>
        <Text style={styles.infoRow}>• Sick Leaves (SL): 6 Days Available</Text>
        <Text style={styles.infoRow}>• Earned Leaves (EL): 14 Days Available</Text>
      </Card>
    </ScrollView>
  </SafeAreaView>
);

export const FilesScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <SafeAreaView style={styles.container}>
    <Header title="e-Detailing & Visual Aids" subtitle="Product Literature & Flipcharts" showBack onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.itemRow}>
          <Ionicons name="document-attach-outline" size={20} color="#DC2626" />
          <Text style={styles.itemText}>CardioPulse-AM Visual Aid (Barak Ed.).pdf</Text>
        </View>
        <Text style={styles.itemSub}>Interactive iPad/Mobile detailing aid with clinical trial data.</Text>
      </Card>
      <Card>
        <View style={styles.itemRow}>
          <Ionicons name="document-attach-outline" size={20} color="#DC2626" />
          <Text style={styles.itemText}>CefoPulse-CV Clinical Efficacy Study.pdf</Text>
        </View>
        <Text style={styles.itemSub}>Peer-reviewed multi-center antibiotic trial results.</Text>
      </Card>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  itemText: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginLeft: spacing.xs },
  itemSub: { fontSize: typography.fontSize.xs, color: colors.textSecondary, marginLeft: 28 },
  sectionTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  infoRow: { fontSize: typography.fontSize.sm, color: colors.textSecondary, marginVertical: 3 },
});
