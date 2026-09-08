import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { BARAK_HOSPITALS } from '../../constants/mockData';
import { Hospital } from '../../types';

interface HospitalDirectoryScreenProps {
  onBack: () => void;
}

export const HospitalDirectoryScreen: React.FC<HospitalDirectoryScreenProps> = ({ onBack }) => {
  const [hospitals] = useState<Hospital[]>(BARAK_HOSPITALS);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<'ALL' | 'Cachar' | 'Karimganj' | 'Hailakandi'>('ALL');

  const filtered = hospitals.filter(h => {
    const matchSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.area.toLowerCase().includes(search.toLowerCase()) ||
      h.district.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase());
    const matchDistrict = selectedDistrict === 'ALL' || h.district === selectedDistrict;
    return matchSearch && matchDistrict;
  });

  const getBadgeVariant = (type: string) => {
    if (type.includes('MEDICAL_COLLEGE')) return 'primary';
    if (type.includes('CIVIL_HOSPITAL')) return 'success';
    if (type.includes('PRIVATE')) return 'warning';
    return 'muted';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Barak Hospitals & Nursing Homes"
        subtitle={hospitals.length + ' Tertiary & Secondary Care Institutions'}
        showBack
        onBack={onBack}
      />

      {/* Search Input */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={18} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search SMCH, Valley, Green Heals, Civil Hospital..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* District Filter Chips */}
      <View style={styles.filterRow}>
        {(['ALL', 'Cachar', 'Karimganj', 'Hailakandi'] as const).map(dist => (
          <TouchableOpacity
            key={dist}
            style={[styles.filterChip, selectedDistrict === dist && styles.filterChipActive]}
            onPress={() => setSelectedDistrict(dist)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, selectedDistrict === dist && styles.filterChipTextActive]}>
              {dist === 'ALL' ? 'All Districts (' + hospitals.length + ')' : dist}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.hospIconBox}>
                <Ionicons name="medical" size={24} color="#7C3AED" />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={styles.hospName}>{item.name}</Text>
                <View style={styles.areaRow}>
                  <Ionicons name="location-sharp" size={13} color="#2563EB" />
                  <Text style={styles.hospArea}>{item.area}, {item.district}</Text>
                </View>
              </View>
              <Badge
                label={item.type.replace(/_/g, ' ')}
                variant={getBadgeVariant(item.type)}
              />
            </View>

            <Text style={styles.addressText}>{item.address}</Text>

            <View style={styles.infoRow}>
              <View style={styles.statPill}>
                <Ionicons name="bed-outline" size={14} color="#0369A1" />
                <Text style={styles.statPillText}>{item.bedCount} Beds</Text>
              </View>
              <View style={styles.statPill}>
                <Ionicons name="people-outline" size={14} color="#15803D" />
                <Text style={styles.statPillText}>{item.keyDoctorsCount} Visiting Doctors</Text>
              </View>
              <TouchableOpacity
                onPress={() => Linking.openURL('tel:' + item.phone)}
                style={styles.callBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="call" size={13} color="#1D4ED8" />
                <Text style={styles.callText}>Call Desk</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  searchBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xs, backgroundColor: '#FFFFFF' },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  searchIcon: { marginRight: spacing.xs },
  input: { flex: 1, paddingVertical: spacing.md, fontSize: typography.fontSize.sm, color: '#0F172A' },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginRight: spacing.xs,
  },
  filterChipActive: { backgroundColor: '#7C3AED' },
  filterChipText: { fontSize: 11, fontWeight: typography.fontWeight.semibold, color: '#475569' },
  filterChipTextActive: { color: '#FFFFFF', fontWeight: typography.fontWeight.bold },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  hospIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospName: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: '#0F172A' },
  areaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  hospArea: { fontSize: typography.fontSize.xs, color: '#2563EB', fontWeight: typography.fontWeight.semibold, marginLeft: 2 },
  addressText: { fontSize: typography.fontSize.xs, color: '#64748B', marginVertical: spacing.sm, lineHeight: 17 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: spacing.sm,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statPillText: { fontSize: 11, color: '#334155', fontWeight: typography.fontWeight.medium, marginLeft: 4 },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  callText: { fontSize: 11, fontWeight: typography.fontWeight.bold, color: '#1D4ED8', marginLeft: 4 },
});
