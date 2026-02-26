import { sendOtp, verifyOtp } from '@/api/endpoints/auth';
import { postWithSchema } from '@/api/request';
import {
  SendOtpResponseSchema,
  VerifyOtpResponseSchema,
} from '@/api/endpoints/auth/schema';

jest.mock('@/api/request', () => ({
  postWithSchema: jest.fn(),
}));

describe('authApi contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sendOtp validates payload and calls auth/send_otp', async () => {
    const response = { success: true };
    (postWithSchema as jest.Mock).mockResolvedValue(response);

    const payload = {
      auth: {
        identifier: '9999999999',
        via: 'sms',
        portal: 'partner',
      },
    } as const;

    await expect(sendOtp(payload)).resolves.toEqual(response);

    expect(postWithSchema).toHaveBeenCalledWith(
      'auth/send_otp',
      payload,
      SendOtpResponseSchema,
    );
  });

  it('verifyOtp validates payload and calls auth/verify_otp', async () => {
    const response = { success: true, auth: { token: 'abc', expiresIn: 3600 } };
    (postWithSchema as jest.Mock).mockResolvedValue(response);

    const payload = {
      auth: {
        identifier: '9999999999',
        via: 'sms',
        code: '123456',
        portal: 'partner',
      },
    } as const;

    await expect(verifyOtp(payload)).resolves.toEqual(response);

    expect(postWithSchema).toHaveBeenCalledWith(
      'auth/verify_otp',
      payload,
      VerifyOtpResponseSchema,
    );
  });

  it('sendOtp rejects invalid payload before request helper is called', async () => {
    expect(() =>
      sendOtp({
        auth: {
          identifier: '',
          via: 'sms',
          portal: 'partner',
        },
      } as never),
    ).toThrow();

    expect(postWithSchema).not.toHaveBeenCalled();
  });
});
