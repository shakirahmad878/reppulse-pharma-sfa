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
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { AuthService } from '../../services/authService';
import { RouteService } from '../../services/routeService';
import { DoctorService } from '../../services/doctorService';
import { OrderService } from '../../services/orderService';
import { SyncService } from '../../services/sync/syncService';
import { BackgroundTelemetryManager } from '../../services/location/backgroundTelemetry';
import { UserProfile, Doctor, RoutePlan } from '../../types';

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
  const [isWorking, setIsWorking] = useState(true);
  const [startTimeText, setStartTimeText] = useState('07:57 AM');
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const loadDashboardData = async () => {
    const usr = AuthService.getCurrentUser();
    setUser(usr);
    const route = await RouteService.getActiveRoute();
    setActiveRoute(route);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const toggleDuty = async () => {
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
              await BackgroundTelemetryManager.stopTracking();
              setIsWorking(false);
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
      {/* Sky-Blue Header with Map Texture & Hamburger */}
      <View style={styles.headerBanner}>
        {/* Top Header Row */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.hamburgerButton}
            onPress={onOpenDrawer}
            activeOpacity={0.7}
          >
            <Text style={styles.hamburgerIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.appTitle}>RepPulse</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Central Circular Duty Status Card */}
        <View style={styles.circularDutyWrapper}>
          <View style={styles.outerRing}>
            <View style={styles.innerCircle}>
              <Text style={styles.dutyTimeText}>
                {isWorking ? 'Since ' + startTimeText : 'Shift Offline'}
              </Text>
              <Text style={styles.dutyHqText} numberOfLines={1}>
                {'📍 ' + (activeRoute ? activeRoute.name.split('-')[0].trim() : 'HQ - Silchar')}
              </Text>
              <TouchableOpacity
                style={[styles.dutyToggleButton, !isWorking && styles.dutyToggleButtonStart]}
                onPress={toggleDuty}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.dutyToggleText,
                    !isWorking && styles.dutyToggleTextStart,
                  ]}
                >
                  {isWorking ? 'Stop Working' : 'Start Working'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Main Feature Tiles Grid (2 Columns, 6 Pastel Tiles) */}
      <ScrollView
        style={styles.tilesScrollView}
        contentContainerStyle={styles.tilesContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tilesGrid}>
          {/* Tile 1: VISITS */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: colors.tileVisits }]}
            onPress={() => onNavigate('DOCTORS')}
            activeOpacity={0.85}
          >
            <View style={styles.tileIconContainer}>
              <Text style={styles.tileEmoji}>📄</Text>
            </View>
            <Text style={styles.tileTitle}>VISITS</Text>
          </TouchableOpacity>

          {/* Tile 2: CLIENTS */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: colors.tileClients }]}
            onPress={() => onNavigate('DOCTORS')}
            activeOpacity={0.85}
          >
            <View style={styles.tileIconContainer}>
              <Text style={styles.tileEmoji}>👥</Text>
            </View>
            <Text style={styles.tileTitle}>CLIENTS</Text>
          </TouchableOpacity>

          {/* Tile 3: FIRMS */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: colors.tileFirms }]}
            onPress={() => onNavigate('FIRMS')}
            activeOpacity={0.85}
          >
            <View style={styles.tileIconContainer}>
              <Text style={styles.tileEmoji}>🏢</Text>
            </View>
            <Text style={styles.tileTitle}>FIRMS</Text>
          </TouchableOpacity>

          {/* Tile 4: HOSPITALS */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: colors.tileHospitals }]}
            onPress={() => onNavigate('HOSPITALS')}
            activeOpacity={0.85}
          >
            <View style={styles.tileIconContainer}>
              <Text style={styles.tileEmoji}>🏥</Text>
            </View>
            <Text style={styles.tileTitle}>HOSPITALS</Text>
          </TouchableOpacity>

          {/* Tile 5: ROUTES & CALENDAR */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: colors.tileRoutes }]}
            onPress={() => onNavigate('ROUTES')}
            activeOpacity={0.85}
          >
            <View style={styles.tileIconContainer}>
              <Text style={styles.tileEmoji}>📅</Text>
            </View>
            <Text style={styles.tileTitle}>ROUTES</Text>
          </TouchableOpacity>

          {/* Tile 6: DCR / ORDERS */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: colors.tileDCR }]}
            onPress={() => onNavigate('ORDERS')}
            activeOpacity={0.85}
          >
            <View style={styles.tileIconContainer}>
              <Text style={styles.tileEmoji}>📑</Text>
            </View>
            <Text style={styles.tileTitle}>ORDERS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Bar: Synchronize & Support 8448440654 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomAction} onPress={handleQuickSync} activeOpacity={0.7}>
          <Text style={styles.bottomActionIcon}>{syncing ? '⏳' : '🔄'}</Text>
          <Text style={styles.bottomActionText}>Synchronize</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomAction}
          onPress={() => Alert.alert('Assam Regional Support', 'Calling Helpline: 8448440654')}
          activeOpacity={0.7}
        >
          <Text style={styles.bottomActionIcon}>📞</Text>
          <View>
            <Text style={styles.bottomActionText}>Support</Text>
            <Text style={styles.bottomPhoneText}>8448440654</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBanner: {
    backgroundColor: '#93C5FD',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hamburgerButton: {
    padding: spacing.xs,
  },
  hamburgerIcon: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  circularDutyWrapper: {
    position: 'absolute',
    bottom: -50,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  outerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#60A5FA',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  innerCircle: {
    width: 146,
    height: 146,
    borderRadius: 73,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  dutyTimeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  dutyHqText: {
    fontSize: typography.fontSize.xs + 1,
    color: '#2563EB',
    fontWeight: typography.fontWeight.bold,
    marginVertical: 3,
    textAlign: 'center',
  },
  dutyToggleButton: {
    marginTop: 2,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
  },
  dutyToggleButtonStart: {
    backgroundColor: colors.success,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  dutyToggleText: {
    fontSize: typography.fontSize.xs,
    color: '#475569',
    fontWeight: typography.fontWeight.semibold,
  },
  dutyToggleTextStart: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.bold,
  },
  tilesScrollView: {
    flex: 1,
    marginTop: 60,
  },
  tilesContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  tileCard: {
    width: '47.5%',
    height: 120,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  tileIconContainer: {
    marginBottom: spacing.xs,
  },
  tileEmoji: {
    fontSize: 32,
  },
  tileTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: '#475569',
    letterSpacing: 0.8,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bottomActionIcon: {
    fontSize: 20,
    color: '#2563EB',
  },
  bottomActionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#1E3A8A',
  },
  bottomPhoneText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: '#1D4ED8',
  },
});
