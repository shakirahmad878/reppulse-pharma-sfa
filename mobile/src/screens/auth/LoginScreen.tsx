import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { AuthService } from '../../services/authService';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const [email, setEmail] = useState('vikram.mr@sefmed.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage('');

    const res = await AuthService.login(email, password);
    setLoading(false);

    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMessage(res.error || 'Login failed. Please check credentials.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>💊</Text>
          </View>
          <Text style={styles.appTitle}>SefMed Pro</Text>
          <Text style={styles.appTagline}>Enterprise Pharma Sales Force Automation</Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Representative Sign In</Text>
          <Text style={styles.formSub}>Enter your credentials to access field operations</Text>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{errorMessage}</Text>
            </View>
          ) : null}

          <Input
            label="Official Email ID"
            value={email}
            onChangeText={setEmail}
            placeholder="e.g. vikram.mr@sefmed.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <TouchableOpacity onPress={onForgotPassword} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In to Field Duty"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
          />

          <View style={styles.demoHelper}>
            <Text style={styles.demoHelperTitle}>Demo Credentials Loaded:</Text>
            <Text style={styles.demoHelperText}>Email: vikram.mr@sefmed.com</Text>
            <Text style={styles.demoHelperText}>Password: password123</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.xl, justifyContent: 'center', minHeight: '100%' },
  brandContainer: { alignItems: 'center', marginBottom: spacing.xxl },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: { fontSize: 30 },
  appTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.hero,
    fontWeight: typography.fontWeight.black,
  },
  appTagline: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  formSub: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.lg,
    marginTop: 2,
  },
  errorBox: {
    backgroundColor: colors.dangerLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  errorBoxText: {
    color: colors.danger,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotText: { color: colors.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  demoHelper: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  demoHelperTitle: { color: colors.primaryDark, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  demoHelperText: { color: colors.primaryDark, fontSize: typography.fontSize.xs, marginTop: 2 },
});
