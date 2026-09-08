import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { AuthService } from '../../services/authService';
import { RouteService } from '../../services/routeService';
import { DoctorService } from '../../services/doctorService';
import { SyncService } from '../../services/sync/syncService';
import { AttendanceService } from '../../services/attendanceService';
import { BackgroundTelemetryManager } from '../../services/location/backgroundTelemetry';
import { UserProfile, RoutePlan, MTPDayPlan } from '../../types';

interface DashboardScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  onOpenDrawer: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenDrawer,
}) => {
  const [user, setUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [activeRoute, setActiveRoute] = useState<RoutePlan | null>(null);
  const [todayMTP, setTodayMTP] = useState<MTPDayPlan | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [punchInTime, setPunchInTime] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const loadDashboardData = async () => {
    const usr = AuthService.getCurrentUser();
    setUser(usr);
    const route = await RouteService.getActiveRoute();
    setActiveRoute(route);
    const mtpDay = await RouteService.getTodayMTPDay();
    setTodayMTP(mtpDay);

    const att = await AttendanceService.getTodayAttendance();
    setIsWorking(att.isPunchedIn);
    setPunchInTime(att.punchInTime);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleDutyPress = async () => {
    if (isWorking) {
      Alert.alert(
        'Stop Field Duty?',
        'This will mark your attendance punch-out and pause 15-minute background location telemetry.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Stop Working',
            style: 'destructive',
            onPress: async () => {
              await AttendanceService.punchOut();
              setIsWorking(false);
              setPunchInTime(null);
            },
          },
        ]
      );
    } else {
      onNavigate('ATTENDANCE');
    }
  };

  const handleQuickSync = async () => {
    setSyncing(true);
    const result = await SyncService.syncAll();
    setSyncing(false);
    Alert.alert(
      result.success ? 'Sync Complete' : 'Sync Notice',
      result.message || 'All offline records synchronized with Assam regional cloud servers.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sky-Blue Header Banner */}
      <View style={styles.headerBanner}>
        {/* Top Header Row with Bulletproof Hamburger Button */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.hamburgerButton}
            onPress={onOpenDrawer}
            activeOpacity={0.6}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <View style={styles.hamburgerIconBox}>
              <Ionicons name="menu" size={28} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerAppName}>RepPulse</Text>
            <Text style={styles.headerAppSub}>Barak Valley Division (Assam)</Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => onNavigate('NOTIFICATIONS')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Status Bar Pills */}
        <View style={styles.statusBarRow}>
          <View style={styles.statusPill}>
            <View style={[styles.statusDot, isWorking ? styles.dotGreen : styles.dotAmber]} />
            <Text style={styles.statusPillText}>
              {isWorking ? 'Field Duty Active' : 'Duty Not Started'}
            </Text>
          </View>

          <View style={styles.statusPill}>
            <Ionicons name="checkmark-done" size={14} color="#FFFFFF" />
            <Text style={styles.statusPillText}>All Data Synced</Text>
          </View>
        </View>

        {/* Central Circular Duty Status Dial */}
        <View style={styles.dutyCircleContainer} pointerEvents="box-none">
          <TouchableOpacity
            style={[styles.dutyCircle, isWorking ? styles.dutyCircleActive : styles.dutyCircleInactive]}
            onPress={handleDutyPress}
            activeOpacity={0.85}
          >
            {isWorking ? (
              <>
                <Text style={styles.dutyTimeText}>Since {punchInTime || '08:00 AM'}</Text>
                <View style={styles.dutyLocationRow}>
                  <Ionicons name="location-sharp" size={13} color="#DC2626" />
                  <Text style={styles.dutyLocationText} numberOfLines={1}>
                    {activeRoute ? activeRoute.name : 'Silchar Central'}
                  </Text>
                </View>
                <Text style={styles.dutyActionTextStop}>Stop Working</Text>
              </>
            ) : (
              <>
                <Ionicons name="play-circle-outline" size={26} color="#2563EB" />
                <Text style={styles.dutyActionTextStart}>Start Working</Text>
                <Text style={styles.dutySubText}>Tap to Punch In</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
        }
      >
        {/* 6 Pastel Action Tiles Grid */}
        <View style={styles.gridContainer}>
          {/* Tile 1: VISITS (Soft Lilac) */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: '#F3E8FF' }]}
            onPress={() => onNavigate('VISIT_EXECUTION_LIST')}
            activeOpacity={0.8}
          >
            <View style={styles.tileIconCircle}>
              <Ionicons name="document-text-outline" size={32} color="#7E22CE" />
            </View>
            <Text style={styles.tileLabel}>VISITS</Text>
          </TouchableOpacity>

          {/* Tile 2: CLIENTS / DOCTORS (Soft Pink) */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: '#FCE7F3' }]}
            onPress={() => onNavigate('DOCTORS')}
            activeOpacity={0.8}
          >
            <View style={styles.tileIconCircle}>
              <Ionicons name="people-outline" size={32} color="#BE185D" />
            </View>
            <Text style={styles.tileLabel}>CLIENTS</Text>
          </TouchableOpacity>

          {/* Tile 3: FIRMS / STOCKISTS (Soft Mint Green) */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: '#DCFCE7' }]}
            onPress={() => onNavigate('FIRMS')}
            activeOpacity={0.8}
          >
            <View style={styles.tileIconCircle}>
              <Ionicons name="business-outline" size={32} color="#15803D" />
            </View>
            <Text style={styles.tileLabel}>FIRMS</Text>
          </TouchableOpacity>

          {/* Tile 4: HOSPITALS (Soft Lavender) */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: '#EDE9FE' }]}
            onPress={() => onNavigate('HOSPITALS')}
            activeOpacity={0.8}
          >
            <View style={styles.tileIconCircle}>
              <Ionicons name="medical-outline" size={32} color="#6D28D9" />
            </View>
            <Text style={styles.tileLabel}>HOSPITALS</Text>
          </TouchableOpacity>

          {/* Tile 5: ROUTES / 30-DAY MTP (Soft Sky Blue) */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: '#E0F2FE' }]}
            onPress={() => onNavigate('ROUTES')}
            activeOpacity={0.8}
          >
            <View style={styles.tileIconCircle}>
              <Ionicons name="calendar-outline" size={32} color="#0369A1" />
            </View>
            <Text style={styles.tileLabel}>ROUTES</Text>
          </TouchableOpacity>

          {/* Tile 6: ORDERS / POB (Soft Peach/Orange) */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: '#FFEDD5' }]}
            onPress={() => onNavigate('ORDERS')}
            activeOpacity={0.8}
          >
            <View style={styles.tileIconCircle}>
              <Ionicons name="cart-outline" size={32} color="#C2410C" />
            </View>
            <Text style={styles.tileLabel}>ORDERS</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Quick Action Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomActionItem}
            onPress={handleQuickSync}
            disabled={syncing}
            activeOpacity={0.7}
          >
            <Ionicons name="sync-outline" size={24} color="#1E3A8A" />
            <Text style={styles.bottomActionText}>
              {syncing ? 'Syncing...' : 'Synchronize'}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomDivider} />

          <TouchableOpacity
            style={styles.bottomActionItem}
            onPress={() => {
              Alert.alert('Support Helpline', 'Regional Barak Valley HQ Desk:\n+91 8448440654\nshakirahmad878@gmail.com');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="call-outline" size={24} color="#1E3A8A" />
            <View style={styles.supportTextBox}>
              <Text style={styles.supportLabel}>Support</Text>
              <Text style={styles.supportPhone}>8448440654</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingTop: 10,
    paddingBottom: 48,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    position: 'relative',
    zIndex: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    zIndex: 99999,
  },
  hamburgerButton: {
    padding: 8,
    zIndex: 99999,
  },
  hamburgerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerAppName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerAppSub: {
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: '#1E3A8A',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  statusBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotGreen: {
    backgroundColor: '#22C55E',
  },
  dotAmber: {
    backgroundColor: '#F59E0B',
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  dutyCircleContainer: {
    position: 'absolute',
    bottom: -46,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  dutyCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  dutyCircleActive: {
    borderColor: '#60A5FA',
  },
  dutyCircleInactive: {
    borderColor: '#93C5FD',
  },
  dutyTimeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: typography.fontWeight.medium,
  },
  dutyLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    maxWidth: 110,
  },
  dutyLocationText: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: '#1D4ED8',
    marginLeft: 2,
  },
  dutyActionTextStop: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: '#DC2626',
    marginTop: 4,
  },
  dutyActionTextStart: {
    fontSize: 13,
    fontWeight: typography.fontWeight.bold,
    color: '#2563EB',
    marginTop: 2,
  },
  dutySubText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: typography.fontWeight.medium,
  },
  scrollContent: {
    paddingTop: 62,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  tileCard: {
    width: '48%',
    aspectRatio: 1.15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  tileIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  tileLabel: {
    fontSize: 13,
    fontWeight: typography.fontWeight.black,
    color: '#1E293B',
    letterSpacing: 0.8,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomActionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#1E3A8A',
    marginLeft: spacing.sm,
  },
  bottomDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.sm,
  },
  supportTextBox: {
    marginLeft: spacing.sm,
  },
  supportLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#1E3A8A',
  },
  supportPhone: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: '#3B82F6',
  },
});
