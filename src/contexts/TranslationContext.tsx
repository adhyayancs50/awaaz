
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
    uploadRecording: "Upload Recording",
    uploadAudioFile: "Upload Audio File",
    upload: "Upload",
    clickToSelectFile: "Click to Select File",
    audioFormatSupported: "MP3, WAV, and M4A formats supported",
    uploadSuccessful: "Upload Successful",
    recordingAddedToArchive: "Recording added to archive",
    selectAudioFile: "Select Audio File",
    pleaseSelectAudioFile: "Please select an audio file",
    pleaseEnterLanguage: "Please enter a language",
    pleaseEnterTitle: "Please enter a title",
    enterRecordingTitle: "Enter recording title",
    word: "Word",
    dangerZone: "Danger Zone",
    deleteAccount: "Delete Account",
    confirmDeletion: "Confirm Deletion",
    deleteAccountWarning: "This action cannot be undone. This will permanently delete your account and all associated data.",
    delete: "Delete",
    updateProfile: "Update Profile",
    displayName: "Display Name",
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
    uploadRecording: "रिकॉर्डिंग अपलोड करें",
    uploadAudioFile: "ऑडियो फ़ाइल अपलोड करें",
    upload: "अपलोड करें",
    clickToSelectFile: "फ़ाइल चुनने के लिए क्लिक करें",
    audioFormatSupported: "MP3, WAV, और M4A प्रारूप समर्थित हैं",
    uploadSuccessful: "अपलोड सफल",
    recordingAddedToArchive: "रिकॉर्डिंग आर्काइव में जोड़ी गई",
    selectAudioFile: "ऑडियो फ़ाइल चुनें",
    pleaseSelectAudioFile: "कृपया एक ऑडियो फ़ाइल चुनें",
    pleaseEnterLanguage: "कृपया एक भाषा दर्ज करें",
    pleaseEnterTitle: "कृपया एक शीर्षक दर्ज करें",
    enterRecordingTitle: "रिकॉर्डिंग शीर्षक दर्ज करें",
    word: "शब्द",
    dangerZone: "खतरा क्षेत्र",
    deleteAccount: "खाता हटाएं",
    confirmDeletion: "हटाने की पुष्टि करें",
    deleteAccountWarning: "यह क्रिया पूर्ववत नहीं की जा सकती। यह आपके खाते और सभी संबंधित डेटा को स्थायी रूप से हटा देगी।",
    delete: "हटाएं",
    updateProfile: "प्रोफाइल अपडेट करें",
    displayName: "प्रदर्शन नाम",
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
