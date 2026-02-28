import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRoute } from '@/navigation/routes';
import type { RootStackParamList } from '@/navigation/root-stack-param-list';
import { LoginScreen } from '@/screens/auth/login-screen';
import { UiDemoScreen } from '@/screens/ui-demo-screen';
import { VerifyOtpScreen } from '@/screens/auth/verify-otp-screen';
import { WelcomeScreen } from '@/screens/welcome-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={AppRoute.Welcome}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        keyboardHandlingEnabled: false,
      }}
    >
      <Stack.Screen name={AppRoute.Welcome} component={WelcomeScreen} />
      <Stack.Screen name={AppRoute.UiDemo} component={UiDemoScreen} />
      <Stack.Screen name={AppRoute.Login} component={LoginScreen} />
      <Stack.Screen name={AppRoute.VerifyOtp} component={VerifyOtpScreen} />
    </Stack.Navigator>
  );
}
