import { z } from "zod";

export const OtpViaSchema = z.enum(["whatsapp", "sms", "email"]);
export type OtpVia = z.infer<typeof OtpViaSchema>;

export const OtpPortalSchema = z.enum(["partner", "customer", "management"]);
export type OtpPortal = z.infer<typeof OtpPortalSchema>;
