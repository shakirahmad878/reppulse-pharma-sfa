import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { DoctorService } from '../../services/doctorService';
import { RouteService } from '../../services/routeService';
import { Doctor, RoutePlan } from '../../types';

interface DoctorListScreenProps {
  onBack: () => void;
  onSelectDoctor: (doctorId: string) => void;
  onOpenDrawer?: () => void;
}

export const DoctorListScreen: React.FC<DoctorListScreenProps> = ({
  onBack,
  onSelectDoctor,
  onOpenDrawer,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [activePill, setActivePill] = useState<'FOR_ME' | 'TEAM' | 'ALL'>('FOR_ME');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoute, setActiveRoute] = useState<RoutePlan | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocClinic, setNewDocClinic] = useState('');
  const [newDocArea, setNewDocArea] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const docs = await DoctorService.getDoctors();
    setDoctors(docs);
    const route = await RouteService.getActiveRoute();
    setActiveRoute(route);
  };

  const forMeDocs = doctors.filter(d => d.isAssignedToMe || d.routeId === activeRoute?.id);
  const teamDocs = doctors;
  const allDocs = doctors;

  const currentList =
    activePill === 'FOR_ME' ? forMeDocs : activePill === 'TEAM' ? teamDocs : allDocs;

  const filteredDoctors = currentList.filter(doc => {
    const query = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(query) ||
      doc.specialty.toLowerCase().includes(query) ||
      doc.clinicName.toLowerCase().includes(query) ||
      doc.area.toLowerCase().includes(query) ||
      doc.district.toLowerCase().includes(query)
    );
  });

  const handleAddDoctor = async () => {
    if (!newDocName.trim() || !newDocSpecialty.trim()) {
      Alert.alert('Missing Details', 'Please provide doctor name and specialty.');
      return;
    }
    await DoctorService.addDoctor({
      name: newDocName.startsWith('Dr.') ? newDocName : 'Dr. ' + newDocName,
      specialty: newDocSpecialty,
      clinicName: newDocClinic || 'Hospital Road Clinic',
      area: newDocArea || 'Hospital Road, Silchar',
      district: 'Cachar',
      routeId: activeRoute?.id || 'route-cachar-01',
    });
    setAddModalVisible(false);
    setNewDocName('');
    setNewDocSpecialty('');
    setNewDocClinic('');
    setNewDocArea('');
    await loadData();
    Alert.alert('Doctor Added', 'New doctor successfully added to your Barak Division list.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sky-Blue Header with Map & Hamburger */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onOpenDrawer || onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIconText}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CLIENTS</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* 3-Pill Switcher */}
        <View style={styles.pillContainer}>
          <TouchableOpacity
            style={[styles.pillButton, activePill === 'FOR_ME' && styles.pillButtonActive]}
            onPress={() => setActivePill('FOR_ME')}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.pillText, activePill === 'FOR_ME' && styles.pillTextActive]}
            >
              {'FOR ME(' + forMeDocs.length + ')'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pillButton, activePill === 'TEAM' && styles.pillButtonActive]}
            onPress={() => setActivePill('TEAM')}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.pillText, activePill === 'TEAM' && styles.pillTextActive]}
            >
              {'TEAM(' + teamDocs.length + ')'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pillButton, activePill === 'ALL' && styles.pillButtonActive]}
            onPress={() => setActivePill('ALL')}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, activePill === 'ALL' && styles.pillTextActive]}>
              {'ALL(' + allDocs.length + ')'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Name, City, Hospital Name"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Doctor Cards List */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const cleanName = item.name.replace(/^Dr\.\s*/i, '');
          const initial = cleanName.length > 0 ? cleanName.charAt(0).toUpperCase() : 'D';
          return (
            <TouchableOpacity
              style={styles.clientCard}
              activeOpacity={0.8}
              onPress={() => onSelectDoctor(item.id)}
            >
              <View style={styles.cardContentRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>

                <View style={styles.detailsCol}>
                  <Text style={styles.clientName}>
                    {item.name.toLowerCase()} ({item.completedVisitsThisMonth}/{item.monthlyVisitTarget})
                  </Text>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaLocation} numberOfLines={1}>
                      📍 {item.area}, {item.district}
                    </Text>
                    <Text style={styles.metaType}>
                      🤝 {item.specialty}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>👨‍⚕️</Text>
            <Text style={styles.emptyText}>No clients found in this filter.</Text>
          </View>
        }
      />

      {/* Floating Orange Add Button */}
      <TouchableOpacity
        style={styles.fabButton}
        activeOpacity={0.85}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Add Client Modal */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Client / Doctor</Text>
            <Text style={styles.modalSubtitle}>Barak Valley Regional Directory</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Doctor Full Name (e.g. Dr. Sanjoy Paul)"
              value={newDocName}
              onChangeText={setNewDocName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Specialty (e.g. Cardiologist / Pediatrician)"
              value={newDocSpecialty}
              onChangeText={setNewDocSpecialty}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Clinic / Hospital (e.g. SMCH Hospital Road)"
              value={newDocClinic}
              onChangeText={setNewDocClinic}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Area (e.g. Ambicapatty / Tarapur)"
              value={newDocArea}
              onChangeText={setNewDocArea}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSubmitBtn]}
                onPress={handleAddDoctor}
              >
                <Text style={styles.modalSubmitText}>Save Client</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBanner: {
    backgroundColor: '#93C5FD',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  menuIconText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: radius.full,
    padding: 3,
  },
  pillButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  pillButtonActive: {
    backgroundColor: '#FFFFFF',
    ...shadows.subtle,
  },
  pillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#DBEAFE',
  },
  pillTextActive: {
    color: '#1D4ED8',
  },
  searchBarContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: '#0F172A',
    padding: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: '#94A3B8',
    paddingHorizontal: spacing.xs,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 90,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.subtle,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  avatarText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#1D4ED8',
  },
  detailsCol: {
    flex: 1,
  },
  clientName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: '#1E3A8A',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  metaLocation: {
    fontSize: typography.fontSize.xs,
    color: '#64748B',
    flex: 1,
  },
  metaType: {
    fontSize: typography.fontSize.xs,
    color: '#475569',
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: '#64748B',
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.floating,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.floating,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: typography.fontSize.xs,
    color: '#64748B',
    marginBottom: spacing.lg,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  modalCancelBtn: {
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    color: '#475569',
    fontWeight: typography.fontWeight.semibold,
  },
  modalSubmitBtn: {
    backgroundColor: '#3B82F6',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.bold,
  },
});
