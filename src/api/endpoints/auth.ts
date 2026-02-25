import { postWithSchema } from '@/api/request';
import {
  SendOtpPayloadSchema,
  SendOtpResponseSchema,
  VerifyOtpPayloadSchema,
  VerifyOtpResponseSchema,
  type SendOtpPayload,
  type SendOtpResponse,
  type VerifyOtpPayload,
  type VerifyOtpResponse,
} from '@/schemas/api/auth.schema';

const sendOtp = (payload: SendOtpPayload): Promise<SendOtpResponse> => {
  const valid = SendOtpPayloadSchema.parse(payload);
  return postWithSchema<SendOtpPayload, typeof SendOtpResponseSchema>(
    'auth/send_otp',
    valid,
    SendOtpResponseSchema,
  );
};

const verifyOtp = (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
  const valid = VerifyOtpPayloadSchema.parse(payload);
  return postWithSchema<VerifyOtpPayload, typeof VerifyOtpResponseSchema>(
    'auth/verify_otp',
    valid,
    VerifyOtpResponseSchema,
  );
};

const authApi = { sendOtp, verifyOtp };

export default authApi;
