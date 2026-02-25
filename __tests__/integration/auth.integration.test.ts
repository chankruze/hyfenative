import { describeLive, optionalEnv, requiredEnv } from '@/test/live-test-utils';

jest.mock('@/lib/storage', () => ({
  storage: {
    getString: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@/lib/query-client', () => ({
  queryClient: {
    clear: jest.fn(),
  },
}));

jest.mock('react-native-config', () => {
  const nodeEnv =
    (
      globalThis as unknown as {
        process?: { env?: Record<string, string | undefined> };
      }
    ).process?.env ?? {};

  return {
    API_PROTOCOL: nodeEnv.API_PROTOCOL ?? 'http',
    API_HOST: nodeEnv.API_HOST ?? 'localhost:3000',
    API_VERSION: nodeEnv.API_VERSION ?? 'v1',
    API_URL: nodeEnv.API_URL ?? '',
    APP_ENV: nodeEnv.APP_ENV ?? 'test',
  };
});

import authApi from '@/api/endpoints/auth';
import { OtpPortal, OtpVia } from '@/schemas/domain/otp.schema';

describeLive('live auth API integration', () => {
  const identifier = optionalEnv('TEST_AUTH_IDENTIFIER');
  const via = (optionalEnv('TEST_AUTH_VIA') ?? 'whatsapp') as OtpVia;
  const portal = (optionalEnv('TEST_AUTH_PORTAL') ?? 'partner') as OtpPortal;

  const itIfIdentifier = identifier ? it : it.skip;
  const otpCode = optionalEnv('TEST_AUTH_OTP');
  const itIfVerifyReady = identifier && otpCode ? it : it.skip;

  itIfIdentifier(
    'sendOtp hits /auth/send_otp and returns ApiBaseSchema shape',
    async () => {
      const response = await authApi.sendOtp({
        auth: {
          identifier: requiredEnv('TEST_AUTH_IDENTIFIER'),
          via,
          portal,
        },
      });

      expect(response).toEqual(
        expect.objectContaining({ success: expect.any(Boolean) }),
      );
    },
  );

  itIfVerifyReady(
    'verifyOtp hits /auth/verify_otp and returns auth token',
    async () => {
      const response = await authApi.verifyOtp({
        auth: {
          identifier: requiredEnv('TEST_AUTH_IDENTIFIER'),
          via,
          portal,
          code: requiredEnv('TEST_AUTH_OTP'),
        },
      });

      expect(response.auth).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          expiresIn: expect.any(Number),
        }),
      );
    },
  );
});
