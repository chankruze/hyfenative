import { postWithSchema } from '@/api/request';
import {
  LoginPayloadSchema,
  LoginResponseSchema,
  VerifyOtpPayloadSchema,
  VerifyOtpResponseSchema,
  type LoginPayload,
  type LoginResponse,
  type VerifyOtpPayload,
  type VerifyOtpResponse,
} from '@/schemas/api/auth.schema';

const login = (payload: LoginPayload): Promise<LoginResponse> => {
  const valid = LoginPayloadSchema.parse(payload);
  return postWithSchema<LoginPayload, typeof LoginResponseSchema>(
    '/management/auth/login',
    valid,
    LoginResponseSchema,
  );
};

const verify = (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
  const valid = VerifyOtpPayloadSchema.parse(payload);
  return postWithSchema<VerifyOtpPayload, typeof VerifyOtpResponseSchema>(
    '/management/auth/verify_otp',
    valid,
    VerifyOtpResponseSchema,
  );
};

const authApi = { login, verify };

export default authApi;
