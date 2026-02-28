import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSendOtp } from '@/api/endpoints/auth/use-auth-api';
import { FormField, IconByVariant, Input, Screen, Spinner } from '@/components';
import { AppRoute } from '@/navigation/routes';
import { useThemeValue } from '@/theme';
import type { Theme } from '@/theme';
import type { RootStackScreenProps } from '@/navigation/navigation-types';
import type { OtpVia } from '@/api/endpoints/auth/otp.schema';

const OTP_VIA_OPTIONS: OtpVia[] = ['whatsapp', 'sms', 'email'];
const OTP_PORTAL = 'customer' as const;

type Props = RootStackScreenProps<AppRoute.Login>;

const normalizeIdentifier = (value: string) => value.trim();

export function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [identifier, setIdentifier] = useState('');
  const [via, setVia] = useState<OtpVia>('whatsapp');
  const [localError, setLocalError] = useState<string | null>(null);

  const theme = useThemeValue();
  const styles = createStyles(theme);

  const sendOtpMutation = useSendOtp();

  const canSubmit = useMemo(
    () =>
      normalizeIdentifier(identifier).length > 0 && !sendOtpMutation.isPending,
    [identifier, sendOtpMutation.isPending],
  );

  const mutationError = sendOtpMutation.error?.message;
  const inputError = localError ?? mutationError ?? undefined;

  const onContinue = async () => {
    const normalized = normalizeIdentifier(identifier);
    if (!normalized) {
      setLocalError(t('auth.validateIdentifier'));
      return;
    }

    setLocalError(null);
    try {
      await sendOtpMutation.mutateAsync({
        auth: {
          identifier: normalized,
          via,
          portal: OTP_PORTAL,
        },
      });

      navigation.navigate(AppRoute.VerifyOtp, {
        identifier: normalized,
        via,
      });
    } catch {
      // Error is handled through mutation state.
    }
  };

  return (
    <Screen keyboardAware scroll>
      <View style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>{t('auth.loginKicker')}</Text>
          <Text style={styles.title}>{t('auth.loginTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
        </View>
        <View style={styles.card}>
          <FormField
            label={t('auth.identifierLabel')}
            error={inputError}
            variant="secondary"
          >
            <Input
              value={identifier}
              onChangeText={setIdentifier}
              placeholder={t('auth.identifierPlaceholder')}
              autoCapitalize="none"
              keyboardType="email-address"
              invalid={Boolean(inputError)}
            />
          </FormField>

          <Text style={styles.fieldLabel}>{t('auth.sendOtpVia')}</Text>
          <View style={styles.viaRow}>
            {OTP_VIA_OPTIONS.map(option => {
              const isActive = option === via;
              return (
                <Pressable
                  key={option}
                  onPress={() => setVia(option)}
                  style={[styles.viaButton, isActive && styles.viaButtonActive]}
                >
                  <View style={styles.viaButtonContent}>
                    <IconByVariant
                      name={isActive ? 'radiobox-marked' : 'radiobox-blank'}
                      variant={isActive ? 'primary' : 'secondary'}
                      size="sm"
                    />
                    <Text
                      style={[styles.viaText, isActive && styles.viaTextActive]}
                    >
                      {option.toUpperCase()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={onContinue}
            disabled={!canSubmit}
            style={[
              styles.primaryButton,
              !canSubmit && styles.primaryButtonDisabled,
            ]}
          >
            {sendOtpMutation.isPending ? (
              <Spinner variant="secondary" size="sm" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {t('common.continue')}
              </Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate(AppRoute.Welcome)}>
            <Text style={styles.secondaryAction}>
              {t('auth.backToWelcome')}
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
      ...theme.typography.h1,
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
    fieldLabel: {
      color: theme.colors.textMuted,
      ...theme.typography.label,
      marginTop: theme.spacing.xs / 4,
    },
    viaRow: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    viaButton: {
      flex: 1,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      paddingVertical: theme.spacing.xs,
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceAlt,
    },
    viaButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
    },
    viaButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    viaText: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.kicker.fontSize,
      fontWeight: theme.typography.kicker.fontWeight,
    },
    viaTextActive: {
      color: theme.colors.accent,
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
    secondaryAction: {
      textAlign: 'center',
      color: theme.colors.primary,
      fontSize: theme.typography.label.fontSize,
      fontWeight: theme.typography.label.fontWeight,
      marginTop: theme.spacing.xs,
    },
    blankSpace: {
      flex: 1,
    },
  });
