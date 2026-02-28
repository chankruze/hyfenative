import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSendOtp } from '@/api/endpoints/auth/use-auth-api';
import {
  Button,
  Card,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Form,
  HStack,
  Input,
  Radio,
  Screen,
  Stack,
} from '@/components';
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
      <Stack spacing="lg" style={styles.page}>
        <Stack spacing="xs" style={styles.hero}>
          <Text style={styles.kicker}>{t('auth.loginKicker')}</Text>
          <Text style={styles.title}>{t('auth.loginTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
        </Stack>

        <Card style={styles.card}>
          <Form
            onSubmit={onContinue}
            submitting={sendOtpMutation.isPending}
            disabled={!canSubmit}
            spacing="xs"
          >
            {({ submit, submitting }) => (
              <>
                <Field invalid={Boolean(inputError)}>
                  <FieldLabel htmlFor="auth-phone">
                    {t('auth.identifierLabel')}
                  </FieldLabel>
                  <Input
                    id="auth-phone"
                    value={identifier}
                    onChangeText={setIdentifier}
                    onSubmitEditing={submit}
                    placeholder={t('auth.identifierPlaceholder')}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    invalid={Boolean(inputError)}
                  />
                  <FieldError>{inputError}</FieldError>
                </Field>

                <Field>
                  <FieldLabel>{t('auth.sendOtpVia')}</FieldLabel>
                  <HStack spacing="xs" style={styles.viaRow}>
                    {OTP_VIA_OPTIONS.map(option => {
                      const isActive = option === via;
                      return (
                        <Pressable
                          key={option}
                          onPress={() => setVia(option)}
                          style={[
                            styles.viaButton,
                            isActive && styles.viaButtonActive,
                          ]}
                        >
                          <Radio
                            selected={isActive}
                            onSelect={() => setVia(option)}
                            variant={isActive ? 'primary' : 'secondary'}
                            size="sm"
                            label={option.toUpperCase()}
                            labelStyle={[
                              styles.viaText,
                              isActive && styles.viaTextActive,
                            ]}
                            style={styles.viaButtonContent}
                          />
                        </Pressable>
                      );
                    })}
                  </HStack>
                </Field>

                <Button
                  onPress={submit}
                  disabled={!canSubmit}
                  loading={submitting}
                  title={t('common.continue')}
                  fullWidth
                  style={styles.primaryButton}
                />

                <Button
                  onPress={() => navigation.navigate(AppRoute.Welcome)}
                  variant="ghost"
                  title={t('auth.backToWelcome')}
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
      ...theme.typography.h1,
    },
    subtitle: {
      color: theme.colors.textMuted,
      ...theme.typography.bodySm,
    },
    card: {
      gap: theme.spacing.xs,
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
      paddingHorizontal: theme.spacing.xs,
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceAlt,
    },
    viaButtonContent: {
      width: '100%',
      justifyContent: 'center',
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
      marginTop: theme.spacing.xs / 2,
    },
    secondaryAction: {
      color: theme.colors.primary,
      fontSize: theme.typography.label.fontSize,
      fontWeight: theme.typography.label.fontWeight,
    },
  });
