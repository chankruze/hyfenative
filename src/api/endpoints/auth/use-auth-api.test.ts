import { QUERY_KEYS } from '@/constants';
import { useSendOtp, useVerifyOtp } from '@/api/endpoints/auth/use-auth-api';
import { sendOtp, verifyOtp } from '@/api/endpoints/auth';
import { useAuthStore } from '@/stores/use-auth-store';
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

jest.mock('@/stores/use-auth-store', () => ({
  useAuthStore: jest.fn(),
}));

describe('use-auth-api hooks', () => {
  const invalidateQueries = jest.fn();
  const hydrateFromVerifyResponse = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useQueryClient as jest.Mock).mockReturnValue({ invalidateQueries });
    (useAuthStore as unknown as jest.Mock).mockImplementation(
      (
        selector: (state: {
          hydrateFromVerifyResponse: typeof hydrateFromVerifyResponse;
        }) => unknown,
      ) => selector({ hydrateFromVerifyResponse }),
    );
  });

  it('useSendOtp wires mutationFn to sendOtp and forwards callbacks', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    useSendOtp({ onSuccess, onError });

    expect(useMutation).toHaveBeenCalledTimes(1);
    const config = (useMutation as jest.Mock).mock.calls[0][0];
    expect(config.mutationFn).toBe(sendOtp);

    const data = { success: true };
    const error = new Error('failed');
    config.onSuccess(data);
    config.onError(error);

    expect(onSuccess).toHaveBeenCalledWith(data);
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('useVerifyOtp wires mutationFn to verifyOtp and hydrates auth token on success', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    useVerifyOtp({ onSuccess, onError });

    expect(useMutation).toHaveBeenCalledTimes(1);
    const config = (useMutation as jest.Mock).mock.calls[0][0];
    expect(config.mutationFn).toBe(verifyOtp);

    const data = {
      success: true,
      auth: { token: 'token_123', expiresIn: 3600 },
    };
    const error = new Error('verify failed');

    config.onSuccess(data);
    config.onError(error);

    expect(hydrateFromVerifyResponse).toHaveBeenCalledWith({
      token: 'token_123',
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: [QUERY_KEYS.AUTH_ME],
    });
    expect(onSuccess).toHaveBeenCalledWith(data);
    expect(onError).toHaveBeenCalledWith(error);
  });
});
