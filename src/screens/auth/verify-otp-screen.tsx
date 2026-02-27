import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSendOtp, useVerifyOtp } from '@/api/endpoints/auth/use-auth-api';
import { Screen } from '@/components/screen';
import { AppRoute } from '@/navigation/routes';
import { useThemeValue } from '@/theme';
import type { Theme } from '@/theme';
import type { RootStackScreenProps } from '@/navigation/navigation-types';

const OTP_PORTAL = 'customer' as const;

type Props = RootStackScreenProps<AppRoute.VerifyOtp>;

export function VerifyOtpScreen({ navigation, route }: Props) {
  const { identifier, via } = route.params;
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const theme = useThemeValue();
  const styles = createStyles(theme);

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useSendOtp();

  const canVerify = useMemo(
    () => code.trim().length > 0 && !verifyOtpMutation.isPending,
    [code, verifyOtpMutation.isPending],
  );

  const onVerify = async () => {
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      setLocalError('Please enter OTP code.');
      return;
    }

    setLocalError(null);
    setSuccessMessage(null);

    try {
      await verifyOtpMutation.mutateAsync({
        auth: {
          identifier,
          via,
          code: normalizedCode,
          portal: OTP_PORTAL,
        },
      });
      setSuccessMessage('Verified successfully. Token is now stored.');
    } catch {
      // Error is handled through mutation state.
    }
  };

  const onResend = async () => {
    setLocalError(null);
    setSuccessMessage(null);
    try {
      await resendOtpMutation.mutateAsync({
        auth: {
          identifier,
          via,
          portal: OTP_PORTAL,
        },
      });
      setSuccessMessage('A fresh OTP has been sent.');
    } catch {
      // Error is handled through mutation state.
    }
  };

  return (
    <Screen keyboardAware scroll>
      <View style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Verify OTP</Text>
          <Text style={styles.title}>Enter code to finish sign in</Text>
          <Text style={styles.subtitle}>Identifier: {identifier}</Text>
          <Text style={styles.subtitle}>Delivery: {via.toUpperCase()}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>One-time code</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter OTP"
            placeholderTextColor={theme.colors.inputPlaceholder}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={6}
          />

          {localError ? <Text style={styles.error}>{localError}</Text> : null}
          {verifyOtpMutation.error?.message ? (
            <Text style={styles.error}>{verifyOtpMutation.error.message}</Text>
          ) : null}
          {resendOtpMutation.error?.message ? (
            <Text style={styles.error}>{resendOtpMutation.error.message}</Text>
          ) : null}
          {successMessage ? (
            <Text style={styles.success}>{successMessage}</Text>
          ) : null}

          <Pressable
            onPress={onVerify}
            disabled={!canVerify}
            style={[
              styles.primaryButton,
              !canVerify && styles.primaryButtonDisabled,
            ]}
          >
            {verifyOtpMutation.isPending ? (
              <ActivityIndicator color={theme.colors.textInverse} />
            ) : (
              <Text style={styles.primaryButtonText}>Verify OTP</Text>
            )}
          </Pressable>

          <Pressable
            onPress={onResend}
            disabled={resendOtpMutation.isPending}
            style={styles.ghostButton}
          >
            {resendOtpMutation.isPending ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Text style={styles.ghostButtonText}>Resend OTP</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate(AppRoute.Login)}>
            <Text style={styles.secondaryAction}>Change identifier</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
      gap: theme.spacing.lg,
    },
    hero: {
      gap: theme.spacing.xs,
    },
    kicker: {
      color: theme.colors.primary,
      ...theme.typography.kicker,
    },
    title: {
      color: theme.colors.text,
      ...theme.typography.h2,
    },
    subtitle: {
      color: theme.colors.textMuted,
      ...theme.typography.bodySm,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    label: {
      color: theme.colors.textMuted,
      ...theme.typography.label,
    },
    input: {
      height: 48,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      backgroundColor: theme.colors.inputBackground,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.sm,
      fontSize: theme.typography.body.fontSize + theme.spacing.xs / 4,
      letterSpacing: theme.typography.kicker.letterSpacing * 5,
    },
    error: {
      color: theme.colors.error,
      fontSize: theme.typography.label.fontSize,
      lineHeight: theme.typography.label.lineHeight,
    },
    success: {
      color: theme.colors.success,
      fontSize: theme.typography.label.fontSize,
      lineHeight: theme.typography.label.lineHeight,
    },
    primaryButton: {
      height: 48,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.xs / 2,
    },
    primaryButtonDisabled: {
      opacity: 0.5,
    },
    primaryButtonText: {
      color: theme.colors.textInverse,
      ...theme.typography.button,
    },
    ghostButton: {
      height: 44,
      borderRadius: theme.radius.md,
      borderColor: theme.colors.borderStrong,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ghostButtonText: {
      color: theme.colors.primary,
      fontSize: theme.typography.bodySm.fontSize,
      fontWeight: theme.typography.kicker.fontWeight,
    },
    secondaryAction: {
      textAlign: 'center',
      color: theme.colors.primary,
      fontSize: theme.typography.label.fontSize,
      fontWeight: theme.typography.label.fontWeight,
      marginTop: theme.spacing.xs * 0.75,
    },
    blankSpace: {
      flex: 1,
    },
  });
