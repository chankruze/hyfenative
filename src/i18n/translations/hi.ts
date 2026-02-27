const hi = {
  common: {
    continue: 'जारी रखें',
    back: 'वापस',
  },
  welcome: {
    kicker: 'हाइफेनेटिव - रिएक्ट नेटिव बॉयलरप्लेट',
    title: 'साफ़ रिएक्ट नेटिव स्टैक के साथ तेज़ी से बनाएं',
    subtitle:
      'Ky-पावर्ड API कॉन्ट्रैक्ट्स, स्कीमा वैलिडेशन, पर्सिस्टेंट क्वेरी कैश, और MMKV-रेडी ऑथ फ्लोज़।',
    cardTitle: 'क्या तैयार है',
    point1: '1. Zod स्कीमा चेक्स के साथ टाइप्ड API हेल्पर्स',
    point2: '2. रिक्वेस्ट/रिस्पॉन्स की केस ट्रांसफॉर्मेशन',
    point3: '3. नॉर्मलाइज़्ड API एरर + ऑथ टोकन पर्सिस्टेंस',
    themeMode: 'थीम मोड',
    fontScale: 'फ़ॉन्ट स्केल',
    language: 'भाषा',
    toLogin: 'लॉगिन पर जारी रखें',
  },
  auth: {
    loginKicker: 'सुरक्षित लॉगिन',
    loginTitle: 'अपने पहचानकर्ता के साथ जारी रखें',
    loginSubtitle: 'मोबाइल नंबर या ईमेल दर्ज करें, हम एक वन-टाइम कोड भेजेंगे।',
    identifierLabel: 'पहचानकर्ता',
    identifierPlaceholder: 'फोन या ईमेल',
    sendOtpVia: 'OTP भेजें',
    backToWelcome: 'वेलकम पर वापस जाएं',
    validateIdentifier: 'कृपया फोन या ईमेल दर्ज करें।',
    verifyKicker: 'OTP सत्यापित करें',
    verifyTitle: 'साइन-इन पूरा करने के लिए कोड दर्ज करें',
    verifyIdentifier: 'पहचानकर्ता: {{identifier}}',
    verifyDelivery: 'डिलीवरी: {{via}}',
    otpLabel: 'वन-टाइम कोड',
    otpPlaceholder: 'OTP दर्ज करें',
    verifyOtp: 'OTP सत्यापित करें',
    resendOtp: 'OTP फिर भेजें',
    changeIdentifier: 'पहचानकर्ता बदलें',
    validateOtp: 'कृपया OTP कोड दर्ज करें।',
    verifySuccess: 'सत्यापन सफल हुआ। टोकन अब स्टोर हो गया है।',
    resendSuccess: 'एक नया OTP भेज दिया गया है।',
  },
} as const;

export default hi;
