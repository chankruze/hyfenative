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
import { useSendOtp, useVerifyOtp } from '@/api/endpoints/auth/use-auth-api';
import { AppRoute } from '@/navigation/routes';
import type { RootStackScreenProps } from '@/navigation/navigation-types';

const OTP_PORTAL = 'customer' as const;

type Props = RootStackScreenProps<AppRoute.VerifyOtp>;

export function VerifyOtpScreen({ navigation, route }: Props) {
  const { identifier, via } = route.params;
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    <SafeAreaView style={styles.safe}>
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
            placeholderTextColor="#7E8AA8"
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
              <ActivityIndicator color="#0B1220" />
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
              <ActivityIndicator color="#67E8F9" />
            ) : (
              <Text style={styles.ghostButtonText}>Resend OTP</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate(AppRoute.Login)}>
            <Text style={styles.secondaryAction}>Change identifier</Text>
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
    gap: 8,
  },
  kicker: {
    color: '#67E8F9',
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
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
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27344E',
    backgroundColor: '#0E1728',
    color: '#F8FAFC',
    paddingHorizontal: 14,
    fontSize: 18,
    letterSpacing: 6,
  },
  error: {
    color: '#FCA5A5',
    fontSize: 13,
    lineHeight: 18,
  },
  success: {
    color: '#86EFAC',
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
  ghostButton: {
    height: 44,
    borderRadius: 12,
    borderColor: '#2A3A5A',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButtonText: {
    color: '#67E8F9',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryAction: {
    textAlign: 'center',
    color: '#67E8F9',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
});
