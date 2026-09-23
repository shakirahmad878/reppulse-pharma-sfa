import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { AuthService } from '../../services/authService';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const [email, setEmail] = useState('shakir.mr@reppulse.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Late Login Modal States
  const [lateModalVisible, setLateModalVisible] = useState(false);
  const [lateCurrentTime, setLateCurrentTime] = useState('');
  const [lateReason, setLateReason] = useState('Traffic & road maintenance on Hospital Road');
  const [managerPin, setManagerPin] = useState('');
  const [requestingApproval, setRequestingApproval] = useState(false);

  const handleLogin = async (bypassCutoff = false) => {
    setLoading(true);
    setErrorMessage('');

    const res = await AuthService.login(email, password, bypassCutoff);
    setLoading(false);

    if (res.success) {
      setLateModalVisible(false);
      onLoginSuccess();
    } else if (res.isLateBlock) {
      setLateCurrentTime(res.currentTimeStr || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setLateModalVisible(true);
    } else {
      setErrorMessage(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleRequestApproval = async () => {
    if (!lateReason.trim()) {
      Alert.alert('Reason Required', 'Please enter a brief explanation for late login.');
      return;
    }
    setRequestingApproval(true);
    const approval = await AuthService.requestLateApproval(lateReason);
    setRequestingApproval(false);

    Alert.alert(
      'Approval Granted ✅',
      `Late login authorized by ${approval.approvedBy} for reason: "${approval.reason}". You may now begin field duty.`,
      [
        {
          text: 'Proceed to Field Duty',
          onPress: () => handleLogin(true),
        },
      ]
    );
  };

  const handleVerifyPin = async () => {
    if (!managerPin.trim()) {
      Alert.alert('PIN Required', 'Please enter 4-digit Manager Override PIN (e.g. 1030 or 1234).');
      return;
    }
    setRequestingApproval(true);
    const res = await AuthService.verifyManagerPin(managerPin, 'Manager PIN Override');
    setRequestingApproval(false);

    if (res.success) {
      Alert.alert(
        'Manager Override Verified ✅',
        'Authorized by Regional Business Manager. Starting shift now.',
        [
          {
            text: 'Proceed to Field Duty',
            onPress: () => handleLogin(true),
          },
        ]
      );
    } else {
      Alert.alert('Invalid PIN', res.error || 'Incorrect authorization code.');
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
          <Text style={styles.appTitle}>RepPulse</Text>
          <Text style={styles.appTagline}>Intelligent Pharma Sales Force Automation</Text>
          <Text style={styles.territoryTag}>Barak Valley Division (Assam)</Text>
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
            placeholder="e.g. shakir.mr@reppulse.com"
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
            onPress={() => handleLogin(false)}
            loading={loading}
            variant="primary"
          />

          <View style={styles.demoHelper}>
            <Text style={styles.demoHelperTitle}>Default Field Representative Loaded:</Text>
            <Text style={styles.demoHelperText}>Email: shakir.mr@reppulse.com</Text>
            <Text style={styles.demoHelperText}>Password: password123</Text>
            <Text style={styles.demoRuleText}>⚠️ Shift Rule: Login after 10:30 AM requires ABM/Admin approval</Text>
          </View>
        </View>
      </ScrollView>

      {/* Late Login Authorization Modal */}
      <Modal visible={lateModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.lateHeader}>
              <Text style={styles.lateAlertEmoji}>⚠️</Text>
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={styles.lateTitle}>10:30 AM Shift Cutoff Exceeded</Text>
                <Text style={styles.lateTimeSub}>Attempted Login at {lateCurrentTime}</Text>
              </View>
            </View>

            <Text style={styles.lateNoticeBody}>
              Standard morning attendance cut-off is <Text style={{ fontWeight: 'bold' }}>10:30 AM</Text>. Company policy requires explicit permission from your Area Business Manager (ABM G Solanki) or Regional Business Manager (Rajesh Sharma) to commence field operations.
            </Text>

            {/* Quick Reason Pills */}
            <Text style={styles.inputSectionLabel}>Select or Enter Reason for Late Duty:</Text>
            <View style={styles.reasonPillRow}>
              {['Traffic / Route Block', 'Doctor Morning OPD', 'Stockist Urgent Order'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.reasonPill, lateReason === r && styles.reasonPillActive]}
                  onPress={() => setLateReason(r)}
                >
                  <Text style={[styles.reasonPillText, lateReason === r && styles.reasonPillTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.reasonInput}
              placeholder="Explain delay reason for manager record..."
              placeholderTextColor="#94A3B8"
              value={lateReason}
              onChangeText={setLateReason}
              multiline
            />

            <TouchableOpacity
              style={styles.requestApprovalBtn}
              onPress={handleRequestApproval}
              disabled={requestingApproval}
            >
              <Text style={styles.requestApprovalBtnText}>
                {requestingApproval ? 'Sending Request...' : '📨 Request Manager Approval (ABM Solanki)'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR ENTER MANAGER PIN</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.pinRow}>
              <TextInput
                style={styles.pinInput}
                placeholder="Manager PIN (1030)"
                placeholderTextColor="#94A3B8"
                value={managerPin}
                onChangeText={setManagerPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={8}
              />
              <TouchableOpacity
                style={styles.pinSubmitBtn}
                onPress={handleVerifyPin}
                disabled={requestingApproval}
              >
                <Text style={styles.pinSubmitBtnText}>Authorize</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setLateModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.xl, justifyContent: 'center', minHeight: '100%' },
  brandContainer: { alignItems: 'center', marginBottom: spacing.xl },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: { fontSize: 32 },
  appTitle: {
    color: '#0F172A',
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.black,
    letterSpacing: -0.5,
  },
  appTagline: {
    color: '#64748B',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: 4,
  },
  territoryTag: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  formTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  formSub: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorBoxText: { color: '#DC2626', fontSize: typography.fontSize.sm },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotText: { color: colors.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  demoHelper: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  demoHelperTitle: { color: colors.primaryDark, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  demoHelperText: { color: colors.primary, fontSize: typography.fontSize.xs, marginTop: 2 },
  demoRuleText: { color: '#B45309', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, marginTop: 6 },
  
  // Late Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.card,
  },
  lateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  lateAlertEmoji: {
    fontSize: 32,
  },
  lateTitle: {
    color: '#991B1B',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
  },
  lateTimeSub: {
    color: '#DC2626',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  lateNoticeBody: {
    color: '#475569',
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  inputSectionLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  reasonPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  reasonPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  reasonPillActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  reasonPillText: {
    color: '#475569',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  reasonPillTextActive: {
    color: '#B45309',
    fontWeight: typography.fontWeight.bold,
  },
  reasonInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    padding: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    minHeight: 56,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  requestApprovalBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  requestApprovalBtnText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#94A3B8',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginHorizontal: spacing.sm,
  },
  pinRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  pinSubmitBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
  },
  pinSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  modalCloseBtn: {
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#64748B',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
