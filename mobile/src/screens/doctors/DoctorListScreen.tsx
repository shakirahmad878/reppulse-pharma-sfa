import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { DoctorService } from '../../services/doctorService';
import { Doctor } from '../../types';

interface DoctorListScreenProps {
  onBack: () => void;
  onSelectDoctor: (doctorId: string) => void;
}

export const DoctorListScreen: React.FC<DoctorListScreenProps> = ({ onBack, onSelectDoctor }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'A_PLUS'>('ALL');

  useEffect(() => {
    DoctorService.getDoctors().then(setDoctors);
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.area.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'PENDING') return doc.todayVisitStatus === 'PENDING';
    if (activeFilter === 'COMPLETED') return doc.todayVisitStatus === 'COMPLETED';
    if (activeFilter === 'A_PLUS') return doc.tier === 'A_PLUS';

    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Doctor Directory" subtitle={`${doctors.length} Assigned Doctors`} showBack onBack={onBack} />
      
      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Input
          placeholder="Search by doctor name, specialty, clinic or area..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {(['ALL', 'PENDING', 'COMPLETED', 'A_PLUS'] as const).map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterChipText, activeFilter === filter && styles.filterChipTextActive]}>
              {filter === 'A_PLUS' ? '⭐ Tier A+' : filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Doctors List */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8} onPress={() => onSelectDoctor(item.id)}>
            <Card style={styles.docCard}>
              <View style={styles.docTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName}>{item.name}</Text>
                  <Text style={styles.docQualification}>{item.qualification} • {item.specialty}</Text>
                </View>
                <Badge label={item.tier.replace('_', ' ')} variant={item.tier === 'A_PLUS' ? 'primary' : 'muted'} />
              </View>

              <View style={styles.clinicInfo}>
                <Text style={styles.clinicName}>🏥 {item.clinicName}</Text>
                <Text style={styles.clinicAddress}>{item.clinicAddress}</Text>
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.targetInfo}>
                  Monthly: {item.completedVisitsThisMonth}/{item.monthlyVisitTarget} visits
                </Text>
                <Badge
                  label={item.todayVisitStatus}
                  variant={item.todayVisitStatus === 'COMPLETED' ? 'success' : 'warning'}
                />
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { color: colors.textSecondary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  filterChipTextActive: { color: colors.textInverse },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  docCard: { marginBottom: spacing.md },
  docTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  docName: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold },
  docQualification: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  clinicInfo: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.surfaceSecondary },
  clinicName: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  clinicAddress: { color: colors.textMuted, fontSize: typography.fontSize.xs, marginTop: 2 },
  footerRow: {
    marginTop: spacing.md,
    paddingTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  targetInfo: { color: colors.primaryDark, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold },
});
