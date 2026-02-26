import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSendOtp } from '@/api/hooks/use-auth-api';
import { AppRoute } from '@/navigation/routes';
import type { RootStackScreenProps } from '@/navigation/navigation-types';
import type { OtpVia } from '@/schemas/domain/otp.schema';

const OTP_VIA_OPTIONS: OtpVia[] = ['whatsapp', 'sms', 'email'];
const OTP_PORTAL = 'customer' as const;

type Props = RootStackScreenProps<AppRoute.Login>;

const normalizeIdentifier = (value: string) => value.trim();

export function LoginScreen({ navigation }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [via, setVia] = useState<OtpVia>('whatsapp');
  const [localError, setLocalError] = useState<string | null>(null);

  const sendOtpMutation = useSendOtp();

  const canSubmit = useMemo(
    () => normalizeIdentifier(identifier).length > 0 && !sendOtpMutation.isPending,
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
    <SafeAreaView style={styles.safe}>
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
            placeholderTextColor="#7E8AA8"
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
                  <Text style={[styles.viaText, isActive && styles.viaTextActive]}>
                    {option.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {localError ? <Text style={styles.error}>{localError}</Text> : null}
          {mutationError ? <Text style={styles.error}>{mutationError}</Text> : null}

          <Pressable
            onPress={onContinue}
            disabled={!canSubmit}
            style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
          >
            {sendOtpMutation.isPending ? (
              <ActivityIndicator color="#0B1220" />
            ) : (
              <Text style={styles.primaryButtonText}>Continue</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate(AppRoute.Welcome)}>
            <Text style={styles.secondaryAction}>Back to welcome</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  page: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'space-between',
    backgroundColor: '#0B1220',
  },
  hero: {
    marginTop: 20,
    gap: 10,
  },
  kicker: {
    color: '#67E8F9',
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#111A2D',
    borderColor: '#1E293B',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  label: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27344E',
    backgroundColor: '#0E1728',
    color: '#F8FAFC',
    paddingHorizontal: 14,
    fontSize: 16,
  },
  viaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  viaButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27344E',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#0E1728',
  },
  viaButtonActive: {
    borderColor: '#67E8F9',
    backgroundColor: '#123247',
  },
  viaText: {
    color: '#AAB5CD',
    fontSize: 12,
    fontWeight: '700',
  },
  viaTextActive: {
    color: '#9EEAFA',
  },
  error: {
    color: '#FCA5A5',
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#67E8F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#0B1220',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryAction: {
    textAlign: 'center',
    color: '#67E8F9',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});
