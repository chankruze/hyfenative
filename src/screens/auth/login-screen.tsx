import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSendOtp } from '@/api/endpoints/auth/use-auth-api';
import { Screen } from '@/components/screen';
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

  const onContinue = async () => {
    const normalized = normalizeIdentifier(identifier);
    if (!normalized) {
      setLocalError('Please enter phone or email.');
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
          <Text style={styles.kicker}>Secure Sign In</Text>
          <Text style={styles.title}>Continue with your identifier</Text>
          <Text style={styles.subtitle}>
            Enter mobile number or email and we will send a one-time code.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Identifier</Text>
          <TextInput
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="Phone or email"
            placeholderTextColor={theme.colors.inputPlaceholder}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Send OTP via</Text>
          <View style={styles.viaRow}>
            {OTP_VIA_OPTIONS.map(option => {
              const isActive = option === via;
              return (
                <Pressable
                  key={option}
                  onPress={() => setVia(option)}
                  style={[styles.viaButton, isActive && styles.viaButtonActive]}
                >
                  <Text
                    style={[styles.viaText, isActive && styles.viaTextActive]}
                  >
                    {option.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {localError ? <Text style={styles.error}>{localError}</Text> : null}
          {mutationError ? (
            <Text style={styles.error}>{mutationError}</Text>
          ) : null}

          <Pressable
            onPress={onContinue}
            disabled={!canSubmit}
            style={[
              styles.primaryButton,
              !canSubmit && styles.primaryButtonDisabled,
            ]}
          >
            {sendOtpMutation.isPending ? (
              <ActivityIndicator color={theme.colors.textInverse} />
            ) : (
              <Text style={styles.primaryButtonText}>Continue</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate(AppRoute.Welcome)}>
            <Text style={styles.secondaryAction}>Back to welcome</Text>
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
    label: {
      color: theme.colors.textMuted,
      ...theme.typography.label,
      marginTop: theme.spacing.xs / 4,
    },
    input: {
      height: 48,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      backgroundColor: theme.colors.inputBackground,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.sm,
      fontSize: theme.typography.body.fontSize,
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
    error: {
      color: theme.colors.error,
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
