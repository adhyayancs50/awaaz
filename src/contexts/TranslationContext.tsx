import React, { createContext, useContext, useState, useEffect } from "react";

type TranslationContextType = {
  t: (key: string) => string;
  changeLanguage: (lang: string) => void;
  currentLanguage: string;
};

interface TranslationMap {
  [key: string]: {
    [key: string]: string;
  };
}

const TranslationContext = createContext<TranslationContextType>({
  t: () => "",
  changeLanguage: () => {},
  currentLanguage: "en",
});

// All of our translations
const translations: TranslationMap = {
  en: {
    home: "Home",
    record: "Record",
    archive: "Archive",
    translate: "Translate",
    settings: "Settings",
    about: "About",
    login: "Login",
    register: "Register",
    logout: "Logout",
    email: "Email",
    password: "Password",
    error: "Error",
    passwordsDoNotMatch: "Passwords do not match",
    welcomeBack: "Welcome Back!",
    loginToContinue: "Login to continue",
    loggingIn: "Logging In...",
    createAccount: "Create Account",
    joinAWAaz: "Join AWAaz",
    whatToCallYou: "What should we call you?",
    yourName: "Your Name",
    confirmPassword: "Confirm Password",
    creating: "Creating...",
    createAccountButton: "Create Account",
    upload: "Upload",
    languageMap: "Language Map",
    general: "General",
    account: "Account",
    preferences: "Preferences",
    displayName: "Display Name",
    updateProfile: "Update Profile",
    currentPassword: "Current Password",
    newPassword: "New Password",
    updatePassword: "Update Password",
    deleteAccount: "Delete Account",
    deleteAccountConfirmation: "Are you sure you want to delete your account? This action cannot be undone.",
    iUnderstand: "I understand the consequences",
    deleteMyAccount: "Delete My Account",
    language: "Language",
    english: "English",
    hindi: "Hindi",
    save: "Save",
    saved: "Saved",
    automaticTranslation: "Automatic Translation",
    automaticTranslationDescription: "Automatically translate recordings to your preferred language.",
    locationTracking: "Location Tracking",
    locationTrackingDescription: "Enable location tracking to improve language map accuracy.",
    recordAudio: "Record Audio",
    stopRecording: "Stop Recording",
    uploadRecording: "Upload Recording",
    translation: "Translation",
    originalText: "Original Text",
    translatedText: "Translated Text",
    recordNew: "Record New",
    signInWithGoogle: "Sign in with Google",
    signOut: "Sign Out",
    audioArchive: "Audio Archive",
    noRecordings: "No recordings yet. Start recording to see them here.",
    searchRecordings: "Search Recordings",
    search: "Search",
    clearSearch: "Clear Search",
    aboutAWAaz: "About AWAaz",
    awaazDescription: "AWAaz is a platform dedicated to preserving and promoting linguistic diversity. Record, translate, and share audio recordings to help document languages from around the world.",
    ourMission: "Our Mission",
    ourMissionDescription: "To empower communities to preserve their languages and cultures through accessible technology.",
    contactUs: "Contact Us",
    contactUsDescription: "Have questions or feedback? Reach out to us!",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    awaazTeam: "AWAaz Team",
    joinUs: "Join Us",
    pageNotFound: "Page Not Found",
    returnHome: "Return Home",
    uploadAudio: "Upload Audio",
    chooseAudioFile: "Choose Audio File",
    uploading: "Uploading...",
    audioFileName: "Audio File Name",
    audioFileDescription: "Audio File Description",
    selectLanguage: "Select Language",
    submit: "Submit",
    uploadSuccessful: "Upload Successful!",
    uploadFailed: "Upload Failed",
    locationConsent: "Location Consent",
    locationConsentDescription: "We need your consent to access your location for language mapping purposes. This data helps us understand the geographic distribution of languages and dialects.",
    grantAccess: "Grant Access",
    locationAccessDenied: "Location Access Denied",
    locationAccessDeniedDescription: "You have denied location access. Please enable it in your browser settings to improve language map accuracy.",
    okay: "Okay",
    locationServicesDisabled: "Location Services Disabled",
    locationServicesDisabledDescription: "Please enable location services in your device settings to allow us to determine your location.",
    goToSettings: "Go to Settings",
    recordings: "Recordings",
    recordingsFound: "recordings found",
    noRecordingsFound: "No recordings found",
    resetPassword: "Reset Password",
    resetPasswordDescription: "Enter your email address and we'll send you a link to reset your password.",
    resetPasswordButton: "Send Reset Link",
    resettingPassword: "Sending...",
    newPasswordRequired: "New Password Required",
    newPasswordDescription: "Enter your new password below.",
    newPasswordButton: "Update Password",
    updatingPassword: "Updating...",
    passwordResetSuccess: "Password Reset Successful!",
    passwordResetSuccessDescription: "Your password has been successfully reset. You can now log in with your new password.",
    goBackToLogin: "Go Back to Login",
  },
  hi: {
    home: "होम",
    record: "रिकॉर्ड",
    archive: "अभिलेख",
    translate: "अनुवाद",
    settings: "सेटिंग्स",
    about: "के बारे में",
    login: "लॉग इन",
    register: "रजिस्टर",
    logout: "लॉग आउट",
    email: "ईमेल",
    password: "पासवर्ड",
    error: "त्रुटि",
    passwordsDoNotMatch: "पासवर्ड मेल नहीं खाते",
    welcomeBack: "वापस स्वागत है!",
    loginToContinue: "जारी रखने के लिए लॉग इन करें",
    loggingIn: "लॉग इन कर रहा है...",
    createAccount: "खाता बनाएं",
    joinAWAaz: "आवाज़ में शामिल हों",
    whatToCallYou: "हम आपको क्या बुलाएं?",
    yourName: "आपका नाम",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    creating: "बना रहा है...",
    createAccountButton: "खाता बनाएं",
    upload: "अपलोड",
    languageMap: "भाषा मानचित्र",
    general: "सामान्य",
    account: "खाता",
    preferences: "प्राथमिकताएँ",
    displayName: "डिस्प्ले नाम",
    updateProfile: "प्रोफ़ाइल अपडेट करें",
    currentPassword: "वर्तमान पासवर्ड",
    newPassword: "नया पासवर्ड",
    updatePassword: "पासवर्ड अपडेट करें",
    deleteAccount: "खाता हटाएं",
    deleteAccountConfirmation: "क्या आप वाकई अपना खाता हटाना चाहते हैं? इस कार्रवाई को वापस नहीं किया जा सकता।",
    iUnderstand: "मैं परिणामों को समझता हूं",
    deleteMyAccount: "मेरा खाता हटाएं",
    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
    save: "सहेजें",
    saved: "सहेजा गया",
    automaticTranslation: "स्वचालित अनुवाद",
    automaticTranslationDescription: "रिकॉर्डिंग को अपनी पसंदीदा भाषा में स्वचालित रूप से अनुवाद करें।",
    locationTracking: "स्थान ट्रैकिंग",
    locationTrackingDescription: "भाषा मानचित्र सटीकता को बेहतर बनाने के लिए स्थान ट्रैकिंग सक्षम करें।",
    recordAudio: "ऑडियो रिकॉर्ड करें",
    stopRecording: "रिकॉर्डिंग रोकें",
    uploadRecording: "रिकॉर्डिंग अपलोड करें",
    translation: "अनुवाद",
    originalText: "मूल पाठ",
    translatedText: "अनुवादित पाठ",
    recordNew: "नया रिकॉर्ड करें",
    signInWithGoogle: "गूगल से साइन इन करें",
    signOut: "साइन आउट",
    audioArchive: "ऑडियो संग्रह",
    noRecordings: "अभी तक कोई रिकॉर्डिंग नहीं है। उन्हें देखने के लिए रिकॉर्डिंग शुरू करें।",
    searchRecordings: "रिकॉर्डिंग खोजें",
    search: "खोज",
    clearSearch: "खोज साफ़ करें",
    aboutAWAaz: "आवाज़ के बारे में",
    awaazDescription: "आवाज़ एक मंच है जो भाषाई विविधता को संरक्षित और बढ़ावा देने के लिए समर्पित है। दुनिया भर की भाषाओं का दस्तावेजीकरण करने में मदद करने के लिए ऑडियो रिकॉर्डिंग रिकॉर्ड करें, अनुवाद करें और साझा करें।",
    ourMission: "हमारा मिशन",
    ourMissionDescription: "सुलभ प्रौद्योगिकी के माध्यम से समुदायों को अपनी भाषाओं और संस्कृतियों को संरक्षित करने के लिए सशक्त बनाना।",
    contactUs: "संपर्क करें",
    contactUsDescription: "कोई प्रश्न या प्रतिक्रिया है? हमसे संपर्क करें!",
    termsOfService: "सेवा की शर्तें",
    privacyPolicy: "गोपनीयता नीति",
    awaazTeam: "आवाज़ टीम",
    joinUs: "हमसे जुड़ें",
    pageNotFound: "पृष्ठ नहीं मिला",
    returnHome: "घर लौटें",
    uploadAudio: "ऑडियो अपलोड करें",
    chooseAudioFile: "ऑडियो फ़ाइल चुनें",
    uploading: "अपलोड हो रहा है...",
    audioFileName: "ऑडियो फ़ाइल का नाम",
    audioFileDescription: "ऑडियो फ़ाइल विवरण",
    selectLanguage: "भाषा का चयन करें",
    submit: "जमा करें",
    uploadSuccessful: "अपलोड सफल!",
    uploadFailed: "अपलोड विफल",
    locationConsent: "स्थान सहमति",
    locationConsentDescription: "हमें भाषा मानचित्रण उद्देश्यों के लिए आपके स्थान तक पहुंचने के लिए आपकी सहमति की आवश्यकता है। यह डेटा हमें भाषाओं और बोलियों के भौगोलिक वितरण को समझने में मदद करता है।",
    grantAccess: "पहुंच प्रदान करें",
    locationAccessDenied: "स्थान पहुंच अस्वीकृत",
    locationAccessDeniedDescription: "आपने स्थान पहुंच से इनकार कर दिया है। भाषा मानचित्र सटीकता को बेहतर बनाने के लिए कृपया इसे अपनी ब्राउज़र सेटिंग में सक्षम करें।",
    okay: "ठीक है",
    locationServicesDisabled: "स्थान सेवाएं अक्षम हैं",
    locationServicesDisabledDescription: "कृपया हमें अपना स्थान निर्धारित करने की अनुमति देने के लिए अपनी डिवाइस सेटिंग में स्थान सेवाएं सक्षम करें।",
    goToSettings: "सेटिंग्स पर जाएं",
    recordings: "रिकॉर्डिंग",
    recordingsFound: "रिकॉर्डिंग मिलीं",
    noRecordingsFound: "कोई रिकॉर्डिंग नहीं मिली",
        resetPassword: "पासवर्ड रीसेट करें",
    resetPasswordDescription: "अपना ईमेल पता दर्ज करें और हम आपको अपना पासवर्ड रीसेट करने के लिए एक लिंक भेजेंगे।",
    resetPasswordButton: "रीसेट लिंक भेजें",
    resettingPassword: "भेज रहा है...",
    newPasswordRequired: "नए पासवर्ड की आवश्यकता है",
    newPasswordDescription: "नीचे अपना नया पासवर्ड दर्ज करें।",
    newPasswordButton: "पासवर्ड अपडेट करें",
    updatingPassword: "अपडेट कर रहा है...",
    passwordResetSuccess: "पासवर्ड रीसेट सफल!",
    passwordResetSuccessDescription: "आपका पासवर्ड सफलतापूर्वक रीसेट कर दिया गया है। अब आप अपने नए पासवर्ड से लॉग इन कर सकते हैं।",
    goBackToLogin: "लॉगिन पर वापस जाएं",
  }
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    // Get stored language from localStorage or default to English
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    // Store language preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', currentLanguage);
    }
  }, [currentLanguage]);

  const changeLanguage = (lang: string) => {
    if (lang && (lang === 'en' || lang === 'hi')) {
      setCurrentLanguage(lang);
    }
  };

  const t = (key: string) => {
    // Get the translation based on the current language
    if (!translations[currentLanguage]) {
      return key; // Return the key if language doesn't exist
    }

    return translations[currentLanguage][key] || translations['en'][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ t, changeLanguage, currentLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
