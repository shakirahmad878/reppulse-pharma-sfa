import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius, spacing } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'muted';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary' }) => {
  const getStyle = () => {
    switch (variant) {
      case 'success':
        return { bg: colors.successLight, text: colors.success };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warning };
      case 'danger':
        return { bg: colors.dangerLight, text: colors.danger };
      case 'info':
        return { bg: colors.infoLight, text: colors.info };
      case 'muted':
        return { bg: colors.surfaceSecondary, text: colors.textSecondary };
      default:
        return { bg: colors.primaryLight, text: colors.primaryDark };
    }
  };

  const currentStyle = getStyle();

  return (
    <View style={[styles.container, { backgroundColor: currentStyle.bg }]}>
      <Text style={[styles.text, { color: currentStyle.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
});
