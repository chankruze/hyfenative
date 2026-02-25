import { z } from 'zod';

export const LoginPayloadSchema = z.object({
  phone: z.string().min(1),
});

export const LoginResponseSchema = z
  .object({
    message: z.string().optional(),
    requestId: z.string().optional(),
  })
  .passthrough();

export const VerifyOtpPayloadSchema = z.object({
  phone: z.string().min(1),
  otp: z.string().min(4),
});

export const VerifyOtpResponseSchema = z.object({
  auth: z.object({
    token: z.string().min(1),
  }),
});

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type VerifyOtpPayload = z.infer<typeof VerifyOtpPayloadSchema>;
export type VerifyOtpResponse = z.infer<typeof VerifyOtpResponseSchema>;
