import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, BackHandler, ActivityIndicator } from 'react-native';
import { colors, typography, spacing } from '../constants/theme';
import { AuthService } from '../services/authService';
import { NetworkBanner } from '../components/common/NetworkBanner';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { AttendanceScreen } from '../screens/attendance/AttendanceScreen';
import { DoctorListScreen } from '../screens/doctors/DoctorListScreen';
import { DoctorDetailsScreen } from '../screens/doctors/DoctorDetailsScreen';
import { VisitExecutionScreen } from '../screens/visits/VisitExecutionScreen';
import { POBBookingScreen } from '../screens/orders/POBBookingScreen';
import { SyncCenterScreen } from '../screens/sync/SyncCenterScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { Doctor } from '../types';

export type ScreenName =
  | 'LOGIN'
  | 'DASHBOARD'
  | 'ATTENDANCE'
  | 'DOCTORS'
  | 'DOCTOR_DETAILS'
  | 'VISIT_EXECUTION'
  | 'ORDERS'
  | 'SYNC'
  | 'PROFILE';

export const RootNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('DASHBOARD');
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'DOCTORS' | 'ORDERS' | 'SYNC' | 'PROFILE'>('DASHBOARD');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [visitContext, setVisitContext] = useState<{ doctor: Doctor; isGeofenceOk: boolean; distanceMeters: number } | null>(null);

  useEffect(() => {
    AuthService.restoreSession().then(user => {
      setIsAuthenticated(!!user);
    });

    const backAction = () => {
      if (currentScreen !== 'DASHBOARD' && isAuthenticated) {
        navigate(activeTab);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentScreen, activeTab, isAuthenticated]);

  const navigate = (screen: ScreenName, params?: any) => {
    if (['DASHBOARD', 'DOCTORS', 'ORDERS', 'SYNC', 'PROFILE'].includes(screen)) {
      setActiveTab(screen as any);
    }
    if (screen === 'DOCTOR_DETAILS' && params?.doctorId) {
      setSelectedDoctorId(params.doctorId);
    }
    if (screen === 'VISIT_EXECUTION' && params) {
      setVisitContext(params);
    }
    setCurrentScreen(screen);
  };

  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Initializing SefMed Enterprise SFA...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          navigate('DASHBOARD');
        }}
        onForgotPassword={() => alert('Password reset link sent to your registered manager.')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NetworkBanner />

      {/* Screen Router */}
      <View style={styles.screenContainer}>
        {currentScreen === 'DASHBOARD' && <DashboardScreen onNavigate={navigate} />}
        {currentScreen === 'ATTENDANCE' && <AttendanceScreen onBack={() => navigate('DASHBOARD')} />}
        {currentScreen === 'DOCTORS' && (
          <DoctorListScreen
            onBack={() => navigate('DASHBOARD')}
            onSelectDoctor={docId => navigate('DOCTOR_DETAILS', { doctorId: docId })}
          />
        )}
        {currentScreen === 'DOCTOR_DETAILS' && selectedDoctorId && (
          <DoctorDetailsScreen
            doctorId={selectedDoctorId}
            onBack={() => navigate('DOCTORS')}
            onStartVisit={(doc, ok, dist) =>
              navigate('VISIT_EXECUTION', { doctor: doc, isGeofenceOk: ok, distanceMeters: dist })
            }
          />
        )}
        {currentScreen === 'VISIT_EXECUTION' && visitContext && (
          <VisitExecutionScreen
            doctor={visitContext.doctor}
            isGeofenceVerified={visitContext.isGeofenceOk}
            distanceMeters={visitContext.distanceMeters}
            onBack={() => navigate('DOCTORS')}
            onVisitComplete={() => navigate('DASHBOARD')}
          />
        )}
        {currentScreen === 'ORDERS' && (
          <POBBookingScreen onBack={() => navigate('DASHBOARD')} onOrderSuccess={() => navigate('DASHBOARD')} />
        )}
        {currentScreen === 'SYNC' && <SyncCenterScreen onBack={() => navigate('DASHBOARD')} />}
        {currentScreen === 'PROFILE' && (
          <ProfileScreen onBack={() => navigate('DASHBOARD')} onLogout={() => setIsAuthenticated(false)} />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'DASHBOARD' && styles.tabButtonActive]}
          onPress={() => navigate('DASHBOARD')}
        >
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={[styles.tabLabel, activeTab === 'DASHBOARD' && styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'DOCTORS' && styles.tabButtonActive]}
          onPress={() => navigate('DOCTORS')}
        >
          <Text style={styles.tabIcon}>👨‍⚕️</Text>
          <Text style={[styles.tabLabel, activeTab === 'DOCTORS' && styles.tabLabelActive]}>Doctors</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'ORDERS' && styles.tabButtonActive]}
          onPress={() => navigate('ORDERS')}
        >
          <Text style={styles.tabIcon}>💊</Text>
          <Text style={[styles.tabLabel, activeTab === 'ORDERS' && styles.tabLabelActive]}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'SYNC' && styles.tabButtonActive]}
          onPress={() => navigate('SYNC')}
        >
          <Text style={styles.tabIcon}>🔄</Text>
          <Text style={[styles.tabLabel, activeTab === 'SYNC' && styles.tabLabelActive]}>Sync</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'PROFILE' && styles.tabButtonActive]}
          onPress={() => navigate('PROFILE')}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabLabel, activeTab === 'PROFILE' && styles.tabLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  loadingText: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginTop: spacing.md },
  screenContainer: { flex: 1 },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.xs + 2,
  },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: spacing.xs },
  tabButtonActive: { borderTopWidth: 2, borderTopColor: colors.primary, marginTop: -2 },
  tabIcon: { fontSize: 20 },
  tabLabel: { color: colors.textSecondary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, marginTop: 2 },
  tabLabelActive: { color: colors.primary, fontWeight: typography.fontWeight.bold },
});
