import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
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
        }
      }
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
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'V'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.userName}>{user?.name || 'Vikram Mehta'}</Text>
              <Text style={styles.userCode}>ID: {user?.employeeCode || 'EMP-MUM-104'}</Text>
              <Text style={styles.userTerritory}>📍 {user?.territory || 'Bandra West'}</Text>
            </View>
          </View>
        </Card>

        {/* Location & Battery Privacy Transparency */}
        <Card>
          <Text style={styles.sectionTitle}>Location Transparency & Privacy</Text>
          <Text style={styles.privacyDesc}>
            • SefMed captures 15-minute background location pings exclusively while clocked in on field duty.
          </Text>
          <Text style={styles.privacyDesc}>
            • Real-time locations and route trails are viewable strictly by Super Admin.
          </Text>
          <Text style={styles.privacyDesc}>
            • Ensure App Battery is set to "Unrestricted" in Phone Settings so Doze mode does not kill background sync.
          </Text>
        </Card>

        {/* App Info */}
        <Card>
          <Text style={styles.sectionTitle}>Application Information</Text>
          <Text style={styles.infoText}>Version: 1.0.0 (Production Release)</Text>
          <Text style={styles.infoText}>Target: Google Play Store (AAB)</Text>
          <Text style={styles.infoText}>Platform: SefMed Enterprise SFA</Text>
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
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textInverse, fontSize: 24, fontWeight: 'bold' },
  userName: { color: colors.textPrimary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.black },
  userCode: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  userTerritory: { color: colors.primaryDark, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, marginTop: 2 },
  sectionTitle: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, marginBottom: spacing.xs },
  privacyDesc: { color: colors.textSecondary, fontSize: typography.fontSize.xs, lineHeight: 18, marginVertical: 2 },
  infoText: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginVertical: 2 },
  logoutBtn: { marginTop: spacing.md },
});
