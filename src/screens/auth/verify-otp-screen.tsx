import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSendOtp, useVerifyOtp } from '@/api/endpoints/auth/use-auth-api';
import { FormField, Input, Screen, Spinner } from '@/components';
import { AppRoute } from '@/navigation/routes';
import { useThemeValue } from '@/theme';
import type { Theme } from '@/theme';
import type { RootStackScreenProps } from '@/navigation/navigation-types';

const OTP_PORTAL = 'customer' as const;

type Props = RootStackScreenProps<AppRoute.VerifyOtp>;

export function VerifyOtpScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { identifier, via } = route.params;
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const theme = useThemeValue();
  const styles = createStyles(theme);

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useSendOtp();
  const errorMessage =
    localError ??
    verifyOtpMutation.error?.message ??
    resendOtpMutation.error?.message ??
    undefined;

  const canVerify = useMemo(
    () => code.trim().length > 0 && !verifyOtpMutation.isPending,
    [code, verifyOtpMutation.isPending],
  );

  const onVerify = async () => {
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      setLocalError(t('auth.validateOtp'));
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
      setSuccessMessage(t('auth.verifySuccess'));
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
      setSuccessMessage(t('auth.resendSuccess'));
    } catch {
      // Error is handled through mutation state.
    }
  };

  return (
    <Screen keyboardAware scroll>
      <View style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>{t('auth.verifyKicker')}</Text>
          <Text style={styles.title}>{t('auth.verifyTitle')}</Text>
          <Text style={styles.subtitle}>
            {t('auth.verifyIdentifier', { identifier })}
          </Text>
          <Text style={styles.subtitle}>
            {t('auth.verifyDelivery', { via: via.toUpperCase() })}
          </Text>
        </View>

        <View style={styles.card}>
          <FormField
            label={t('auth.otpLabel')}
            error={errorMessage}
            variant="secondary"
          >
            <Input
              value={code}
              onChangeText={setCode}
              placeholder={t('auth.otpPlaceholder')}
              keyboardType="number-pad"
              maxLength={6}
              invalid={Boolean(errorMessage)}
              inputStyle={styles.codeInputText}
            />
          </FormField>

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
              <Spinner variant="secondary" size="sm" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {t('auth.verifyOtp')}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={onResend}
            disabled={resendOtpMutation.isPending}
            style={styles.ghostButton}
          >
            {resendOtpMutation.isPending ? (
              <Spinner variant="primary" size="sm" />
            ) : (
              <Text style={styles.ghostButtonText}>{t('auth.resendOtp')}</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate(AppRoute.Login)}>
            <Text style={styles.secondaryAction}>
              {t('auth.changeIdentifier')}
            </Text>
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
    codeInputText: {
      fontSize: theme.typography.body.fontSize + theme.spacing.xs / 4,
      letterSpacing: (theme.typography.kicker.letterSpacing ?? 0) * 5,
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
