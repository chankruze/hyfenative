const en = {
  common: {
    continue: 'Continue',
    back: 'Back',
  },
  welcome: {
    kicker: 'Hyfenative - React Native Boilerplate',
    title: 'Build Faster With A Clean React Native Stack',
    subtitle:
      'Ky-powered API contracts, schema validation, persistent query cache, and MMKV-ready auth flows.',
    cardTitle: 'What is wired',
    point1: '1. Typed API helpers with Zod schema checks',
    point2: '2. Request/response key case transformation',
    point3: '3. Normalized API errors + auth token persistence',
    themeMode: 'Theme mode',
    fontScale: 'Font scale',
    language: 'Language',
    toLogin: 'Continue to login',
  },
  auth: {
    loginKicker: 'Secure Sign In',
    loginTitle: 'Continue with your identifier',
    loginSubtitle: 'Enter mobile number or email and we will send a one-time code.',
    identifierLabel: 'Identifier',
    identifierPlaceholder: 'Phone or email',
    sendOtpVia: 'Send OTP via',
    backToWelcome: 'Back to welcome',
    validateIdentifier: 'Please enter phone or email.',
    verifyKicker: 'Verify OTP',
    verifyTitle: 'Enter code to finish sign in',
    verifyIdentifier: 'Identifier: {{identifier}}',
    verifyDelivery: 'Delivery: {{via}}',
    otpLabel: 'One-time code',
    otpPlaceholder: 'Enter OTP',
    verifyOtp: 'Verify OTP',
    resendOtp: 'Resend OTP',
    changeIdentifier: 'Change identifier',
    validateOtp: 'Please enter OTP code.',
    verifySuccess: 'Verified successfully. Token is now stored.',
    resendSuccess: 'A fresh OTP has been sent.',
  },
} as const;

export default en;
