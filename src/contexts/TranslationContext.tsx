
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface TranslationContextType {
  t: (key: string) => string;
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

const translations = {
  en: {
    // Auth
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    createAccount: "Create Account",
    welcomeBack: "Welcome Back",
    loginToContinue: "Please login to continue",
    joinAWAaz: "Join AWAaz to preserve languages",
    whatToCallYou: "What should we call you?",
    yourName: "Your name",
    loggingIn: "Logging in...",
    creating: "Creating...",
    
    // Home Page
    welcomeMessage: "Help preserve linguistic heritage by recording, archiving, and translating languages",
    startRecording: "Start Recording",
    recordDescription: "Capture voices, stories, and songs in endangered languages",
    browseArchive: "Browse Digital Archive",
    archiveDescription: "Explore the collection of recorded languages",
    totalLanguagesRecorded: "Total recordings",
    yourContributions: "Your contributions",
    translateRecordings: "Translate Recordings",
    translateDescription: "Help make languages accessible to broader audiences",
    helpPreserve: "Contribute your translation skills to help preserve cultural context",
    uploadManually: "Upload Manually",
    uploadDescription: "Upload pre-recorded audio files",
    uploadInstructions: "Select audio files from your device to add to the archive",
    quickAccess: "Quick Access",
    help: "Help & FAQs",
    
    // Recording
    record: "Record",
    recordSentence: "Record a Sentence",
    singleSentence: "Record a Single Sentence",
    conversation: "Record a Conversation",
    song: "Record a Song or Music",
    recording: "Recording...",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    startOver: "Start Over",
    upload: "Upload",
    
    // Translation
    translate: "Translate",
    translateTo: "Translate to",
    targetLanguage: "Target Language",
    hindi: "Hindi",
    english: "English",
    original: "Original Language",
    translationInstructions: "Help preserve languages by translating recordings",
    selectTranslationLanguage: "Select which language you want to translate content into",
    selectRecording: "Select a recording to translate",
    submitTranslation: "Submit Translation",
    submitting: "Submitting...",
    translationSaved: "Your translation has been saved",
    translationSubmissionFailed: "Failed to submit translation. Please try again.",
    selectRecordingAndEnterTranslation: "Please select a recording and enter your translation",
    enterTranslationHere: "Enter your translation here",
    availableTasks: "Available Tasks",
    myTasks: "My Tasks",
    completed: "Completed",
    noRecordingsToTranslate: "No available recordings for this language",
    noAssignedTranslations: "You don't have any assigned translations",
    noCompletedTranslations: "You haven't completed any translations yet",
    signInToTranslate: "Sign in to translate",
    createAccountOrSignInToTranslate: "Create an account or sign in to help with translations",
    translateToHindi: "Translate to Hindi",
    translateToEnglish: "Translate to English",
    originalTranscription: "Original Transcription",
    
    // Archive
    archive: "Archive",
    noRecordings: "No recordings found",
    tryAdjustingFilters: "Try adjusting your filters",
    clearFilters: "Clear Filters",
    recordNow: "Record Now",
    
    // Settings
    settings: "Settings",
    profile: "Profile",
    manageYourInfo: "Manage your personal information",
    displayName: "Display Name",
    updateProfile: "Update Profile",
    deleteAccount: "Delete Account",
    areYouSure: "Are you sure?",
    deleteAccountWarning: "This will permanently delete your account and all your data. This action cannot be undone.",
    cancel: "Cancel",
    language: "Language",
    speaker: "Speaker",
    chooseYourLanguage: "Choose your preferred language",
    useHindi: "Use Hindi",
    syncSettings: "Sync Settings",
    configureSync: "Configure how your recordings are synchronized",
    syncOnWifiOnly: "Sync only on Wi-Fi",
    saveMobileData: "Save mobile data by only syncing on Wi-Fi networks",
    autoSync: "Auto Sync",
    autoSyncDescription: "Automatically sync recordings when online",
    syncNow: "Sync Now",
    aboutAWAaz: "About AWAaz",
    aboutAWAazDescription: "AWAaz is dedicated to preserving endangered tribal languages in India through voice recording, transcription, and translation. Your contributions help build a valuable archive of linguistic heritage.",
    
    // Messages
    success: "Success",
    error: "Error",
    displayNameRequired: "Display name is required",
    displayNameUpdated: "Your display name has been updated",
    updateFailed: "Update failed. Please try again.",
    passwordsDoNotMatch: "Passwords do not match",
    
    // Common
    signInToAccessSettings: "Sign in to access settings",
    createAccountOrSignIn: "Create an account or sign in to configure your preferences.",
    updating: "Updating...",
    user: "User"
  },
  hi: {
    // Auth
    login: "लॉग इन करें",
    register: "रजिस्टर करें",
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    createAccount: "खाता बनाएं",
    welcomeBack: "वापसी पर स्वागत है",
    loginToContinue: "कृपया जारी रखने के लिए लॉगिन करें",
    joinAWAaz: "भाषाओं को संरक्षित करने के लिए AWAaz से जुड़ें",
    whatToCallYou: "हम आपको क्या कहें?",
    yourName: "आपका नाम",
    loggingIn: "लॉग इन हो रहा है...",
    creating: "बना रहा है...",
    
    // Home Page
    welcomeMessage: "भाषाओं को रिकॉर्ड, संग्रह और अनुवाद करके भाषाई विरासत को संरक्षित करने में मदद करें",
    startRecording: "रिकॉर्डिंग शुरू करें",
    recordDescription: "लुप्तप्राय भाषाओं में आवाज़ें, कहानियां और गीत कैप्चर करें",
    browseArchive: "डिजिटल आर्काइव ब्राउज़ करें",
    archiveDescription: "रिकॉर्ड की गई भाषाओं के संग्रह का अन्वेषण करें",
    totalLanguagesRecorded: "कुल रिकॉर्डिंग",
    yourContributions: "आपका योगदान",
    translateRecordings: "रिकॉर्डिंग का अनुवाद करें",
    translateDescription: "भाषाओं को व्यापक दर्शकों तक पहुंचाने में मदद करें",
    helpPreserve: "सांस्कृतिक संदर्भ को संरक्षित करने में मदद के लिए अपने अनुवाद कौशल का योगदान दें",
    uploadManually: "मैन्युअल रूप से अपलोड करें",
    uploadDescription: "पहले से रिकॉर्ड की गई ऑडियो फ़ाइलें अपलोड करें",
    uploadInstructions: "आर्काइव में जोड़ने के लिए अपने डिवाइस से ऑडियो फ़ाइलें चुनें",
    quickAccess: "त्वरित पहुंच",
    help: "सहायता और अक्सर पूछे जाने वाले प्रश्न",
    
    // Recording
    record: "रिकॉर्ड",
    recordSentence: "एक वाक्य रिकॉर्ड करें",
    singleSentence: "एक वाक्य रिकॉर्ड करें",
    conversation: "एक वार्तालाप रिकॉर्ड करें",
    song: "गीत या संगीत रिकॉर्ड करें",
    recording: "रिकॉर्डिंग...",
    pause: "रोकें",
    resume: "जारी रखें",
    stop: "बंद करें",
    startOver: "फिर से शुरू करें",
    upload: "अपलोड करें",
    
    // Translation
    translate: "अनुवाद",
    translateTo: "इसमें अनुवाद करें",
    targetLanguage: "लक्षित भाषा",
    hindi: "हिंदी",
    english: "अंग्रेजी",
    original: "मूल भाषा",
    translationInstructions: "रिकॉर्डिंग का अनुवाद करके भाषाओं को संरक्षित करने में मदद करें",
    selectTranslationLanguage: "चुनें कि आप किस भाषा में सामग्री का अनुवाद करना चाहते हैं",
    selectRecording: "अनुवाद के लिए एक रिकॉर्डिंग चुनें",
    submitTranslation: "अनुवाद जमा करें",
    submitting: "जमा कर रहा है...",
    translationSaved: "आपका अनुवाद सहेज लिया गया है",
    translationSubmissionFailed: "अनुवाद जमा करने में विफल। कृपया पुनः प्रयास करें।",
    selectRecordingAndEnterTranslation: "कृपया एक रिकॉर्डिंग चुनें और अपना अनुवाद दर्ज करें",
    enterTranslationHere: "अपना अनुवाद यहां दर्ज करें",
    availableTasks: "उपलब्ध कार्य",
    myTasks: "मेरे कार्य",
    completed: "पूर्ण किए गए",
    noRecordingsToTranslate: "इस भाषा के लिए कोई उपलब्ध रिकॉर्डिंग नहीं है",
    noAssignedTranslations: "आपको कोई असाइन किया गया अनुवाद नहीं है",
    noCompletedTranslations: "आपने अभी तक कोई अनुवाद पूरा नहीं किया है",
    signInToTranslate: "अनुवाद करने के लिए साइन इन करें",
    createAccountOrSignInToTranslate: "अनुवाद में सहायता करने के लिए एक खाता बनाएं या साइन इन करें",
    translateToHindi: "हिंदी में अनुवाद करें",
    translateToEnglish: "अंग्रेजी में अनुवाद करें",
    originalTranscription: "मूल प्रतिलेखन",
    
    // Archive
    archive: "आर्काइव",
    noRecordings: "कोई रिकॉर्डिंग नहीं मिली",
    tryAdjustingFilters: "अपने फ़िल्टर समायोजित करने का प्रयास करें",
    clearFilters: "फ़िल्टर साफ़ करें",
    recordNow: "अभी रिकॉर्ड करें",
    
    // Settings
    settings: "सेटिंग्स",
    profile: "प्रोफ़ाइल",
    manageYourInfo: "अपनी व्यक्तिगत जानकारी प्रबंधित करें",
    displayName: "प्रदर्शन नाम",
    updateProfile: "प्रोफ़ाइल अपडेट करें",
    deleteAccount: "खाता हटाएँ",
    areYouSure: "क्या आप सुनिश्चित हैं?",
    deleteAccountWarning: "यह आपके खाते और आपके सभी डेटा को स्थायी रूप से हटा देगा। यह क्रिया पूर्ववत नहीं की जा सकती है।",
    cancel: "रद्द करें",
    language: "भाषा",
    speaker: "वक्ता",
    chooseYourLanguage: "अपनी पसंदीदा भाषा चुनें",
    useHindi: "हिंदी का उपयोग करें",
    syncSettings: "सिंक सेटिंग्स",
    configureSync: "कॉन्फ़िगर करें कि आपकी रिकॉर्डिंग कैसे सिंक्रनाइज़ होती है",
    syncOnWifiOnly: "केवल वाई-फ़ाई पर सिंक करें",
    saveMobileData: "वाई-फ़ाई नेटवर्क पर सिंक करके मोबाइल डेटा बचाएं",
    autoSync: "ऑटो सिंक",
    autoSyncDescription: "ऑनलाइन होने पर स्वचालित रूप से रिकॉर्डिंग सिंक करें",
    syncNow: "अभी सिंक करें",
    aboutAWAaz: "AWAaz के बारे में",
    aboutAWAazDescription: "AWAaz भारत की लुप्तप्राय आदिवासी भाषाओं को ध्वनि रिकॉर्डिंग, प्रतिलेखन और अनुवाद के माध्यम से संरक्षित करने के लिए समर्पित है। आपका योगदान भाषाई विरासत के एक मूल्यवान संग्रह का निर्माण करने में मदद करता है।",
    
    // Messages
    success: "सफलता",
    error: "त्रुटि",
    displayNameRequired: "प्रदर्शन नाम आवश्यक है",
    displayNameUpdated: "आपका प्रदर्शन नाम अपडेट किया गया है",
    updateFailed: "अपडेट विफल। कृपया पुनः प्रयास करें।",
    passwordsDoNotMatch: "पासवर्ड मेल नहीं खाते",
    
    // Common
    signInToAccessSettings: "सेटिंग्स तक पहुंचने के लिए साइन इन करें",
    createAccountOrSignIn: "अपनी प्राथमिकताओं को कॉन्फ़िगर करने के लिए एक खाता बनाएं या साइन इन करें।",
    updating: "अपडेट हो रहा है...",
    user: "उपयोगकर्ता"
  }
};

const TranslationContext = createContext<TranslationContextType>({
  t: key => key,
  currentLanguage: "en",
  setLanguage: () => {},
});

export const useTranslation = () => useContext(TranslationContext);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("awaaz_language");
    return (savedLanguage === "hi" ? "hi" : "en") as Language;
  });

  useEffect(() => {
    localStorage.setItem("awaaz_language", language);
    document.documentElement.lang = language;
    
    // Set direction for RTL languages if needed
    // document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <TranslationContext.Provider value={{ t, currentLanguage: language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};
