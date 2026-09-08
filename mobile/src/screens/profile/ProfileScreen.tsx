import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AuthService } from '../../services/authService';
import { UserProfile } from '../../types';

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onLogout }) => {
  const [user] = useState<UserProfile | null>(AuthService.getCurrentUser());

  const handleLogoutConfirm = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of field operations?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await AuthService.logout();
          onLogout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Representative Profile" subtitle="Field Duty Credentials" showBack onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Card */}
        <Card>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'S'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.userName}>{user?.name || 'Shakir Ahmad'}</Text>
              <Text style={styles.userCode}>ID: {user?.employeeCode || 'REP-AS-904'}</Text>
              <View style={styles.territoryRow}>
                <Ionicons name="location-outline" size={14} color="#1D4ED8" />
                <Text style={styles.userTerritory}>{user?.territory || 'Barak Valley Division (Assam)'}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Location & Battery Privacy Transparency */}
        <Card>
          <Text style={styles.sectionTitle}>Location Transparency & Privacy</Text>
          <Text style={styles.privacyDesc}>
            • RepPulse captures 15-minute background location pings exclusively while clocked in on field duty.
          </Text>
          <Text style={styles.privacyDesc}>
            • Real-time locations and route trails are viewable strictly by authorized Regional Managers & Super Admins.
          </Text>
          <Text style={styles.privacyDesc}>
            • Ensure App Battery is set to "Unrestricted" in Phone Settings so Doze mode does not pause background sync.
          </Text>
        </Card>

        {/* App Info */}
        <Card>
          <Text style={styles.sectionTitle}>Application Information</Text>
          <Text style={styles.infoText}>Version: 1.2.0 (Barak Division Release)</Text>
          <Text style={styles.infoText}>Target: Google Play Store (AAB / APK)</Text>
          <Text style={styles.infoText}>Platform: RepPulse Enterprise SFA</Text>
          <Text style={styles.infoText}>Headquarter: Silchar HQ (Cachar, Karimganj, Hailakandi)</Text>
        </Card>

        {/* Logout Action */}
        <View style={styles.logoutBtn}>
          <Button title="🚪 Log Out of Account" onPress={handleLogoutConfirm} variant="danger" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  userName: { color: colors.textPrimary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.black },
  userCode: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  territoryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  userTerritory: { color: '#1D4ED8', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, marginLeft: 2 },
  sectionTitle: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, marginBottom: spacing.xs },
  privacyDesc: { color: colors.textSecondary, fontSize: typography.fontSize.xs, lineHeight: 18, marginVertical: 2 },
  infoText: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginVertical: 2 },
  logoutBtn: { marginTop: spacing.lg },
});
