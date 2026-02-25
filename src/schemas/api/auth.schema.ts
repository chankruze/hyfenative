import { z } from "zod";
import { ApiBaseSchema, ApiKeyedResponseSchema } from "@/schemas/api.schema";
import { OtpPortalSchema, OtpViaSchema } from "@/schemas/domain/otp.schema";

export const SendOtpPayloadSchema = z.object({
  auth: z.object({
    identifier: z.string().min(1, "Identifier is required"),
    via: OtpViaSchema,
    portal: OtpPortalSchema,
  }),
});

export const VerifyOtpPayloadSchema = z.object({
  auth: z.object({
    identifier: z.string().min(1, "Identifier is required"),
    via: OtpViaSchema,
    code: z.string().min(1, "OTP code is required"),
    portal: OtpPortalSchema,
  }),
});

export const SendOtpResponseSchema = ApiBaseSchema;

export const VerifyOtpResponseSchema = ApiKeyedResponseSchema(
  "auth",
  z.object({
    token: z.string(),
    expiresIn: z.number(),
  })
);

export type SendOtpPayload = z.infer<typeof SendOtpPayloadSchema>;
export type SendOtpResponse = z.infer<typeof SendOtpResponseSchema>;

export type VerifyOtpPayload = z.infer<typeof VerifyOtpPayloadSchema>;
export type VerifyOtpResponse = z.infer<typeof VerifyOtpResponseSchema>;

// Backward-compatible aliases for existing mobile API contracts.
export const LoginPayloadSchema = SendOtpPayloadSchema;
export const LoginResponseSchema = SendOtpResponseSchema;

export type LoginPayload = SendOtpPayload;
export type LoginResponse = SendOtpResponse;
