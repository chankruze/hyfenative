import { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSendOtp, useVerifyOtp } from '@/api/endpoints/auth/use-auth-api';
import {
  Button,
  Card,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Form,
  Input,
  Screen,
  Stack,
} from '@/components';
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
      <Stack spacing="lg" style={styles.page}>
        <Stack spacing="xs" style={styles.hero}>
          <Text style={styles.kicker}>{t('auth.verifyKicker')}</Text>
          <Text style={styles.title}>{t('auth.verifyTitle')}</Text>
          <Text style={styles.subtitle}>
            {t('auth.verifyIdentifier', { identifier })}
          </Text>
          <Text style={styles.subtitle}>
            {t('auth.verifyDelivery', { via: via.toUpperCase() })}
          </Text>
        </Stack>

        <Card style={styles.card}>
          <Form
            onSubmit={onVerify}
            submitting={verifyOtpMutation.isPending}
            disabled={!canVerify}
            spacing="xs"
          >
            {({ submit, submitting }) => (
              <>
                <Field invalid={Boolean(errorMessage)}>
                  <FieldLabel htmlFor="auth-otp-code">
                    {t('auth.otpLabel')}
                  </FieldLabel>
                  <Input
                    id="auth-otp-code"
                    value={code}
                    onChangeText={setCode}
                    onSubmitEditing={submit}
                    placeholder={t('auth.otpPlaceholder')}
                    keyboardType="number-pad"
                    maxLength={6}
                    invalid={Boolean(errorMessage)}
                    inputStyle={styles.codeInputText}
                  />
                  <FieldDescription>{t('auth.otpPlaceholder')}</FieldDescription>
                  <FieldError>{errorMessage}</FieldError>
                </Field>

                {successMessage ? (
                  <Text style={styles.success}>{successMessage}</Text>
                ) : null}

                <Button
                  onPress={submit}
                  disabled={!canVerify}
                  loading={submitting}
                  title={t('auth.verifyOtp')}
                  fullWidth
                  style={styles.primaryButton}
                />

                <Button
                  onPress={onResend}
                  disabled={resendOtpMutation.isPending}
                  loading={resendOtpMutation.isPending}
                  variant="ghost"
                  title={t('auth.resendOtp')}
                  fullWidth
                  textStyle={styles.ghostButtonText}
                />

                <Button
                  onPress={() => navigation.navigate(AppRoute.Login)}
                  variant="ghost"
                  title={t('auth.changeIdentifier')}
                  fullWidth
                  textStyle={styles.secondaryAction}
                />
              </>
            )}
          </Form>
        </Card>
      </Stack>
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
    },
    hero: {},
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
      marginTop: theme.spacing.xs / 2,
    },
    ghostButtonText: {
      color: theme.colors.primary,
      fontSize: theme.typography.bodySm.fontSize,
      fontWeight: theme.typography.kicker.fontWeight,
    },
    secondaryAction: {
      color: theme.colors.primary,
      fontSize: theme.typography.label.fontSize,
      fontWeight: theme.typography.label.fontWeight,
    },
  });
