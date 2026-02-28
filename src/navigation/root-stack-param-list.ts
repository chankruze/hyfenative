import { AppRoute } from '@/navigation/routes';
import type { OtpVia } from '@/api/endpoints/auth/otp.schema';

export type RootStackParamList = {
  [AppRoute.Welcome]: undefined;
  [AppRoute.UiDemo]: undefined;
  [AppRoute.Login]: undefined;
  [AppRoute.VerifyOtp]: {
    identifier: string;
    via: OtpVia;
  };
};
