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

  const filtered = firms.filter(
    f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      f.area.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Barak Stockists and Firms"
        subtitle={firms.length + ' Authorized Distributors'}
        showBack
        onBack={onBack}
      />

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search Barak Pharma, Cachar Drug, Surma Valley..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.firmName}>{item.name}</Text>
                <Text style={styles.contactText}>👤 Contact: {item.contactPerson}</Text>
              </View>
              <Badge
                label={item.type.replace(/_/g, ' ')}
                variant={item.type === 'SUPER_STOCKIST' ? 'primary' : 'muted'}
              />
            </View>

            <Text style={styles.addressText}>📍 {item.address}</Text>

            <View style={styles.gstRow}>
              <Text style={styles.gstText}>GST: {item.gstNumber}</Text>
              <Text style={styles.gstText}>DL: {item.dlNumber}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => Linking.openURL('tel:' + item.phone)}
                style={styles.callBtn}
              >
                <Text style={styles.callText}>📞 {item.phone}</Text>
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
  searchBar: { padding: spacing.lg, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  input: { backgroundColor: '#F1F5F9', borderRadius: radius.md, padding: spacing.md, fontSize: typography.fontSize.sm },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: { backgroundColor: '#FFFFFF', borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: '#E2E8F0', ...shadows.subtle },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  firmName: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: '#0F172A' },
  contactText: { fontSize: typography.fontSize.xs, color: '#2563EB', marginTop: 2, fontWeight: typography.fontWeight.semibold },
  addressText: { fontSize: typography.fontSize.xs, color: '#64748B', marginVertical: spacing.xs },
  gstRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: spacing.xs, borderRadius: radius.sm, marginVertical: spacing.xs },
  gstText: { fontSize: typography.fontSize.xxs, color: '#64748B' },
  actionRow: { marginTop: spacing.xs, alignItems: 'flex-end' },
  callBtn: { backgroundColor: '#EFF6FF', paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radius.sm },
  callText: { fontSize: typography.fontSize.xs, color: '#1D4ED8', fontWeight: typography.fontWeight.bold },
});
