import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { sendOtp, verifyOtp } from '@/api/endpoints/auth';
import type { ApiRequestError } from '@/api/types';
import { useAuthStore } from '@/stores/use-auth-store';
import type {
  SendOtpPayload,
  SendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from '@/api/endpoints/auth/schema';

export const useSendOtp = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: SendOtpResponse) => void;
  onError?: (error: ApiRequestError) => void;
} = {}) =>
  useMutation<SendOtpResponse, ApiRequestError, SendOtpPayload>({
    mutationFn: sendOtp,
    onSuccess: data => {
      onSuccess?.(data);
    },
    onError: error => {
      onError?.(error);
    },
  });

export const useVerifyOtp = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: VerifyOtpResponse) => void;
  onError?: (error: ApiRequestError) => void;
} = {}) => {
  const queryClient = useQueryClient();
  const hydrateFromVerifyResponse = useAuthStore(
    state => state.hydrateFromVerifyResponse,
  );

  return useMutation<VerifyOtpResponse, ApiRequestError, VerifyOtpPayload>({
    mutationFn: verifyOtp,
    onSuccess: data => {
      const authPayload = data.auth;
      if (
        authPayload &&
        typeof authPayload === 'object' &&
        'token' in authPayload &&
        typeof authPayload.token === 'string'
      ) {
        hydrateFromVerifyResponse({ token: authPayload.token });
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_ME] });
      onSuccess?.(data);
    },
    onError: error => {
      onError?.(error);
    },
  });
};
