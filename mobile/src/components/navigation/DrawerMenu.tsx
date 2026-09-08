import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { UserProfile } from '../../types';

interface DrawerMenuProps {
  visible: boolean;
  user: UserProfile | null;
  activeScreen: string;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  visible,
  user,
  activeScreen,
  onClose,
  onNavigate,
  onLogout,
}) => {
  const menuItems = [
    { key: 'DASHBOARD', label: 'Home', icon: '??' },
    { key: 'VISIT_EXECUTION_LIST', label: 'Visits', icon: '??' },
    { key: 'DOCTORS', label: 'Clients', icon: '??' },
    { key: 'ROUTES', label: 'Calendar & Route Plan', icon: '??' },
    { key: 'SYNC', label: 'Synchronize', icon: '??' },
    { key: 'NOTIFICATIONS', label: 'Notification', icon: '??' },
    { key: 'EXPENSES', label: 'Expenses', icon: '?' },
    { key: 'LEAVES', label: 'Leaves', icon: '??' },
    { key: 'FILES', label: 'Files', icon: '??' },
    { key: 'COMMANDS', label: 'Commands', icon: '{ }' },
    { key: 'PROFILE', label: 'My Info', icon: '??' },
  ];

  const handleSelect = (key: string) => {
    onClose();
    onNavigate(key);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.drawerContainer}>
          {/* User Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.name || 'Shakir Ahmad'}</Text>
            <Text style={styles.userRole}>
              {user?.role === 'MEDICAL_REP' ? 'Medical Representative (MR)' : user?.role || 'Representative'}
            </Text>
            <Text style={styles.userTerritory}>?? {user?.territory || 'Barak Division, Assam'}</Text>
            <View style={styles.divider} />
          </View>

          {/* Menu Items List */}
          <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
            {menuItems.map(item => {
              const isActive = activeScreen === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => handleSelect(item.key)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutIcon}>??</Text>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Drawer Footer */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>RepPulse v1.0.0 (Barak Division)</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  backdrop: {
    flex: 1,
  },
  drawerContainer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#93C5FD', // Light sky-blue matching Screenshot 2
    paddingTop: 44,
    paddingHorizontal: spacing.lg,
    display: 'flex',
  },
  profileHeader: {
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarInitial: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.black,
    color: '#1E3A8A',
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#1E3A8A',
  },
  userRole: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: '#1E40AF',
    marginTop: 2,
  },
  userTerritory: {
    fontSize: typography.fontSize.xxs + 1,
    color: '#1D4ED8',
    marginTop: 2,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#60A5FA',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  menuScroll: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: '#DBEAFE',
  },
  menuIcon: {
    fontSize: 18,
    width: 32,
    color: '#1E3A8A',
  },
  menuText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: '#1E3A8A',
  },
  menuTextActive: {
    fontWeight: typography.fontWeight.black,
    color: '#1D4ED8',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#BFDBFE',
  },
  logoutIcon: {
    fontSize: 18,
    width: 32,
  },
  logoutText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#B91C1C',
  },
  footer: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#BFDBFE',
    alignItems: 'center',
  },
  versionText: {
    fontSize: typography.fontSize.xxs,
    color: '#1E3A8A',
    fontWeight: typography.fontWeight.medium,
  },
});
