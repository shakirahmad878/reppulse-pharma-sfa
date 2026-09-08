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
import { BARAK_FIRMS } from '../../constants/mockData';
import { StockistFirm } from '../../types';

interface FirmDirectoryScreenProps {
  onBack: () => void;
}

export const FirmDirectoryScreen: React.FC<FirmDirectoryScreenProps> = ({ onBack }) => {
  const [firms] = useState<StockistFirm[]>(BARAK_FIRMS);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<'ALL' | 'Cachar' | 'Karimganj' | 'Hailakandi'>('ALL');

  const filtered = firms.filter(f => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      f.area.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase()) ||
      f.gstNumber.toLowerCase().includes(search.toLowerCase()) ||
      f.dlNumber.toLowerCase().includes(search.toLowerCase());
    const matchDistrict = selectedDistrict === 'ALL' || f.district === selectedDistrict;
    return matchSearch && matchDistrict;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Barak Stockists & Wholesale Firms"
        subtitle={firms.length + ' Authorized Pharma Distributors'}
        showBack
        onBack={onBack}
      />

      {/* Search Input */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={18} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search Barak Pharma, Cachar Drug, Surma Valley..."
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
              {dist === 'ALL' ? 'All Districts (' + firms.length + ')' : dist}
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
              <View style={styles.firmIconBox}>
                <Ionicons name="storefront" size={24} color="#059669" />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={styles.firmName}>{item.name}</Text>
                <Text style={styles.contactText}>👤 Contact Person: {item.contactPerson}</Text>
                <View style={styles.areaRow}>
                  <Ionicons name="location-sharp" size={13} color="#059669" />
                  <Text style={styles.areaText}>{item.area}, {item.district}</Text>
                </View>
              </View>
              <Badge
                label={item.type.replace(/_/g, ' ')}
                variant={item.type === 'SUPER_STOCKIST' ? 'primary' : 'success'}
              />
            </View>

            <Text style={styles.addressText}>{item.address}</Text>

            <View style={styles.licenseRow}>
              <Text style={styles.licenseText}>GST: <Text style={styles.boldVal}>{item.gstNumber}</Text></Text>
              <Text style={styles.licenseText}>DL: <Text style={styles.boldVal}>{item.dlNumber}</Text></Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => Linking.openURL('tel:' + item.phone)}
                style={styles.callBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="call" size={14} color="#FFFFFF" />
                <Text style={styles.callText}>Call Firm ({item.phone})</Text>
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
  filterChipActive: { backgroundColor: '#059669' },
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
  firmIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  firmName: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: '#0F172A' },
  contactText: { fontSize: typography.fontSize.xs, color: '#334155', marginTop: 2, fontWeight: typography.fontWeight.medium },
  areaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  areaText: { fontSize: typography.fontSize.xs, color: '#059669', fontWeight: typography.fontWeight.semibold, marginLeft: 2 },
  addressText: { fontSize: typography.fontSize.xs, color: '#64748B', marginVertical: spacing.sm, lineHeight: 17 },
  licenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  licenseText: { fontSize: 11, color: '#64748B' },
  boldVal: { color: '#0F172A', fontWeight: typography.fontWeight.bold },
  actionRow: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: spacing.sm },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 9,
    borderRadius: radius.md,
  },
  callText: { fontSize: 12, fontWeight: typography.fontWeight.bold, color: '#FFFFFF', marginLeft: 6 },
});
