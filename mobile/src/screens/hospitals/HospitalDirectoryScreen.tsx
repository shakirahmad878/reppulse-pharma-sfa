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
import { BARAK_HOSPITALS } from '../../constants/mockData';
import { Hospital } from '../../types';

interface HospitalDirectoryScreenProps {
  onBack: () => void;
}

export const HospitalDirectoryScreen: React.FC<HospitalDirectoryScreenProps> = ({ onBack }) => {
  const [hospitals] = useState<Hospital[]>(BARAK_HOSPITALS);
  const [search, setSearch] = useState('');

  const filtered = hospitals.filter(
    h =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.area.toLowerCase().includes(search.toLowerCase()) ||
      h.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Barak Hospitals"
        subtitle={hospitals.length + ' Tertiary and Civil Care Centers'}
        showBack
        onBack={onBack}
      />

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search SMCH, Valley, Green Heals, Civil Hosp..."
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
                <Text style={styles.hospName}>{item.name}</Text>
                <Text style={styles.hospArea}>📍 {item.area}, {item.district}</Text>
              </View>
              <Badge
                label={item.type.replace(/_/g, ' ')}
                variant={item.type.includes('MEDICAL_COLLEGE') ? 'primary' : 'muted'}
              />
            </View>

            <Text style={styles.addressText}>{item.address}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>🛏️ {item.bedCount} Beds</Text>
              <Text style={styles.infoText}>👨‍⚕️ {item.keyDoctorsCount} Visiting Doctors</Text>
              <TouchableOpacity
                onPress={() => Linking.openURL('tel:' + item.phone)}
                style={styles.callBtn}
              >
                <Text style={styles.callText}>📞 Call Desk</Text>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
  hospName: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: '#0F172A' },
  hospArea: { fontSize: typography.fontSize.xs, color: '#2563EB', marginTop: 2, fontWeight: typography.fontWeight.semibold },
  addressText: { fontSize: typography.fontSize.xs, color: '#64748B', marginVertical: spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: spacing.sm },
  infoText: { fontSize: typography.fontSize.xs, color: '#475569', fontWeight: typography.fontWeight.medium },
  callBtn: { backgroundColor: '#EFF6FF', paddingHorizontal: spacing.sm + 2, paddingVertical: 4, borderRadius: radius.sm },
  callText: { fontSize: typography.fontSize.xs, color: '#1D4ED8', fontWeight: typography.fontWeight.bold },
});
