/**
 * SefMed Pro - Enterprise Medical UI Design Tokens
 * High-contrast, clean, outdoor-readable medical design language.
 */

export const colors = {
  // Primary Medical Brand
  primary: '#0D9488',       // Medical Teal
  primaryDark: '#0F766E',   // Dark Teal
  primaryLight: '#CCFBF1',  // Soft Teal Background
  primaryGlow: 'rgba(13, 148, 136, 0.15)',

  // Secondary Accents
  accentBlue: '#0284C7',    // Clinical Sky Blue
  accentBlueLight: '#E0F2FE',
  accentNavy: '#0F172A',    // Deep Enterprise Navy

  // Surface & Neutrals
  background: '#F8FAFC',    // Slate 50 (Clean White/Gray)
  surface: '#FFFFFF',       // Pure White Card
  surfaceSecondary: '#F1F5F9', // Slate 100
  surfaceMuted: '#E2E8F0',  // Slate 200

  // Text Hierarchy
  textPrimary: '#0F172A',   // Slate 900
  textSecondary: '#475569', // Slate 600
  textMuted: '#94A3B8',     // Slate 400
  textInverse: '#FFFFFF',

  // Status & Feedback Colors
  success: '#10B981',       // Emerald Green
  successLight: '#D1FAE5',
  warning: '#F59E0B',       // Amber
  warningLight: '#FEF3C7',
  danger: '#EF4444',        // Coral Red
  dangerLight: '#FEE2E2',
  info: '#3B82F6',          // Blue
  infoLight: '#DBEAFE',

  // Borders
  border: '#E2E8F0',
  borderDark: '#CBD5E1',
  borderFocused: '#0D9488',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    hero: 28,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '800' as const,
  }
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};
