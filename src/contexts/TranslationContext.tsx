
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface TranslationContextType {
  t: (key: string) => string;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key: string) => key,
  currentLanguage: "en",
  setLanguage: () => {},
});

export const useTranslation = () => useContext(TranslationContext);

// Extended translation dictionary
const translations = {
  en: {
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    login: "Login",
    register: "Register",
    createAccount: "Create Account",
    joinAWAaz: "Join AWAaz community",
    welcomeBack: "Welcome back",
    loginToContinue: "Log in to continue",
    whatToCallYou: "What should we call you?",
    yourName: "Your name",
    loggingIn: "Logging in...",
    creating: "Creating account...",
    logout: "Logout",
    record: "Record",
    archive: "Archive",
    translate: "Translate",
    settings: "Settings",
    home: "Home",
    aboutAWAaz: "About AWAaz",
    title: "Title",
    required: "Required",
    recordingTitle: "Recording title",
    language: "Language",
    languageName: "Language name",
    speaker: "Speaker",
    speakerName: "Speaker name",
    discard: "Discard",
    saveRecording: "Save Recording",
    recordSentence: "What would you like to record?",
    singleSentence: "Single Sentence",
    conversation: "Conversation",
    song: "Song",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    startOver: "Start Over",
    recordingNotFound: "Recording not found",
    titleRequired: "Title is required",
    languageRequired: "Language is required",
    passwordsDoNotMatch: "Passwords do not match",
    error: "Error",
    saveYourRecording: "Save Your Recording",
    startRecording: "Start Recording",
    cancel: "Cancel",
    enterLanguageName: "Enter Language Name",
    welcome: "Welcome",
    browseTips: "Browse Archive",
    translateTips: "Translate",
    recordTips: "Record Audio",
    uploadTips: "Upload Audio",
    languages: "Languages",
    recordings: "Recordings",
    contributors: "Contributors",
  },
  hi: {
    signIn: "साइन इन करें",
    signUp: "साइन अप करें",
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    login: "लॉगिन",
    register: "रजिस्टर करें",
    createAccount: "खाता बनाएं",
    joinAWAaz: "आवाज़ समुदाय से जुड़ें",
    welcomeBack: "वापसी पर स्वागत है",
    loginToContinue: "जारी रखने के लिए लॉगिन करें",
    whatToCallYou: "हम आपको क्या बुलाएं?",
    yourName: "आपका नाम",
    loggingIn: "लॉगिन हो रहा है...",
    creating: "खाता बन रहा है...",
    logout: "लॉगआउट",
    record: "रिकॉर्ड",
    archive: "आर्काइव",
    translate: "अनुवाद",
    settings: "सेटिंग्स",
    home: "होम",
    aboutAWAaz: "आवाज़ के बारे में",
    title: "शीर्षक",
    required: "आवश्यक",
    recordingTitle: "रिकॉर्डिंग का शीर्षक",
    language: "भाषा",
    languageName: "भाषा का नाम",
    speaker: "वक्ता",
    speakerName: "वक्ता का नाम",
    discard: "त्यागें",
    saveRecording: "रिकॉर्डिंग सहेजें",
    recordSentence: "आप क्या रिकॉर्ड करना चाहेंगे?",
    singleSentence: "एकल वाक्य",
    conversation: "बातचीत",
    song: "गीत",
    pause: "रोकें",
    resume: "जारी रखें",
    stop: "बंद करें",
    startOver: "फिर से शुरू करें",
    recordingNotFound: "रिकॉर्डिंग नहीं मिली",
    titleRequired: "शीर्षक आवश्यक है",
    languageRequired: "भाषा आवश्यक है",
    passwordsDoNotMatch: "पासवर्ड मेल नहीं खाते",
    error: "त्रुटि",
    saveYourRecording: "अपनी रिकॉर्डिंग सहेजें",
    startRecording: "रिकॉर्डिंग शुरू करें",
    cancel: "रद्द करें",
    enterLanguageName: "भाषा का नाम दर्ज करें",
    welcome: "स्वागत है",
    browseTips: "आर्काइव ब्राउज़ करें",
    translateTips: "अनुवाद करें",
    recordTips: "ऑडियो रिकॉर्ड करें",
    uploadTips: "ऑडियो अपलोड करें",
    languages: "भाषाएँ",
    recordings: "रिकॉर्डिंग",
    contributors: "योगदानकर्ता",
  },
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem("awaaz_language");
    return (savedLang === "hi" ? "hi" : "en") as Language;
  });

  useEffect(() => {
    localStorage.setItem("awaaz_language", currentLanguage);
    // Update document language for accessibility
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const t = (key: string): string => {
    const translatedText = translations[currentLanguage][key as keyof typeof translations["en"]];
    return translatedText || key;
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  return (
    <TranslationContext.Provider value={{ t, currentLanguage, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};
