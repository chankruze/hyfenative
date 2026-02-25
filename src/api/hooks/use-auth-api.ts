import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import authApi from '@/api/endpoints/auth';
import type { ApiRequestError } from '@/api/types';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type {
  SendOtpPayload,
  SendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from '@/schemas/api/auth.schema';

export const useSendOtp = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: SendOtpResponse) => void;
  onError?: (error: ApiRequestError) => void;
} = {}) =>
  useMutation<SendOtpResponse, ApiRequestError, SendOtpPayload>({
    mutationFn: authApi.sendOtp,
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

  return useMutation<VerifyOtpResponse, ApiRequestError, VerifyOtpPayload>({
    mutationFn: authApi.verifyOtp,
    onSuccess: data => {
      const authPayload = data.auth;
      if (
        authPayload &&
        typeof authPayload === 'object' &&
        'token' in authPayload &&
        typeof authPayload.token === 'string'
      ) {
        storage.set(STORAGE_KEYS.AUTH_TOKEN, authPayload.token);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_ME] });
      onSuccess?.(data);
    },
    onError: error => {
      onError?.(error);
    },
  });
};
