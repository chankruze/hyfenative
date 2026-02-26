import { AppRoute } from '@/navigation/routes';
import type { OtpVia } from '@/schemas/domain/otp.schema';

export type RootStackParamList = {
  [AppRoute.Welcome]: undefined;
  [AppRoute.Login]: undefined;
  [AppRoute.VerifyOtp]: {
    identifier: string;
    via: OtpVia;
  };
};
