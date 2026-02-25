import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import authApi from '@/api/endpoints/auth';
import type { ApiRequestError } from '@/api/types';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type {
  LoginPayload,
  LoginResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from '@/schemas/api/auth.schema';

export const useSendOtp = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: ApiRequestError) => void;
} = {}) =>
  useMutation<LoginResponse, ApiRequestError, LoginPayload>({
    mutationFn: authApi.login,
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
    mutationFn: authApi.verify,
    onSuccess: data => {
      storage.set(STORAGE_KEYS.AUTH_TOKEN, data.auth.token);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_ME] });
      onSuccess?.(data);
    },
    onError: error => {
      onError?.(error);
    },
  });
};
