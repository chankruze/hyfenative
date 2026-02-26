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
} from './schema';

export const sendOtp = (payload: SendOtpPayload): Promise<SendOtpResponse> => {
  const valid = SendOtpPayloadSchema.parse(payload);
  return postWithSchema<SendOtpPayload, typeof SendOtpResponseSchema>(
    'auth/send_otp',
    valid,
    SendOtpResponseSchema,
  );
};

export const verifyOtp = (
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> => {
  const valid = VerifyOtpPayloadSchema.parse(payload);
  return postWithSchema<VerifyOtpPayload, typeof VerifyOtpResponseSchema>(
    'auth/verify_otp',
    valid,
    VerifyOtpResponseSchema,
  );
};
