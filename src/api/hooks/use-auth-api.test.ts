import { QUERY_KEYS } from '@/constants';
import { useSendOtp, useVerifyOtp } from '@/api/hooks/use-auth-api';
import authApi from '@/api/endpoints/auth';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(() => ({ mockedMutation: true })),
  useQueryClient: jest.fn(),
}));

jest.mock('@/api/endpoints/auth', () => ({
  __esModule: true,
  default: {
    sendOtp: jest.fn(),
    verifyOtp: jest.fn(),
  },
}));

jest.mock('@/lib/storage', () => ({
  storage: {
    set: jest.fn(),
  },
}));

describe('use-auth-api hooks', () => {
  const invalidateQueries = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useQueryClient as jest.Mock).mockReturnValue({ invalidateQueries });
  });

  it('useSendOtp wires mutationFn to authApi.sendOtp and forwards callbacks', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    useSendOtp({ onSuccess, onError });

    expect(useMutation).toHaveBeenCalledTimes(1);
    const config = (useMutation as jest.Mock).mock.calls[0][0];
    expect(config.mutationFn).toBe(authApi.sendOtp);

    const data = { success: true };
    const error = new Error('failed');
    config.onSuccess(data);
    config.onError(error);

    expect(onSuccess).toHaveBeenCalledWith(data);
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('useVerifyOtp wires mutationFn to authApi.verifyOtp and persists token on success', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    useVerifyOtp({ onSuccess, onError });

    expect(useMutation).toHaveBeenCalledTimes(1);
    const config = (useMutation as jest.Mock).mock.calls[0][0];
    expect(config.mutationFn).toBe(authApi.verifyOtp);

    const data = {
      success: true,
      auth: { token: 'token_123', expiresIn: 3600 },
    };
    const error = new Error('verify failed');

    config.onSuccess(data);
    config.onError(error);

    expect(storage.set).toHaveBeenCalledWith(
      STORAGE_KEYS.AUTH_TOKEN,
      'token_123',
    );
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: [QUERY_KEYS.AUTH_ME],
    });
    expect(onSuccess).toHaveBeenCalledWith(data);
    expect(onError).toHaveBeenCalledWith(error);
  });
});
