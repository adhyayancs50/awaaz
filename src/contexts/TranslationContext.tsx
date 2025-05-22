
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
    guest: "Guest",
    signIn: "Sign In",
    
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
    
    // Home Page
    home: "Home",
    startRecording: "Start Recording",
    captureVoiceDescription: "Record songs, stories, or sentences in your tribal language",
    browseArchive: "Browse Archive",
    exploreRecordingsDescription: "Explore the digital archive of recordings",
    translateRecording: "Translate Recording",
    helpTranslateDescription: "Help preserve languages by translating recordings",
    uploadRecording: "Upload Recording",
    uploadExistingDescription: "Upload existing audio files to the archive",
    communityStats: "Community Stats",
    languagesArchived: "Languages Archived",
    totalRecordings: "Total Recordings",
    activeContributors: "Active Contributors",
    learnAboutAWAaz: "Learn About AWAaz",
    preserveLanguagesSubtitle: "Preserve cultural heritage through voice recording"
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
    guest: "अतिथि",
    signIn: "साइन इन करें",
    
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
    
    // Home Page
    home: "होम",
    startRecording: "रिकॉर्डिंग शुरू करें",
    captureVoiceDescription: "अपनी जनजातीय भाषा में गीत, कहानियां या वाक्य रिकॉर्ड करें",
    browseArchive: "आर्काइव ब्राउज़ करें",
    exploreRecordingsDescription: "रिकॉर्डिंग के डिजिटल आर्काइव का अन्वेषण करें",
    translateRecording: "रिकॉर्डिंग अनुवाद करें",
    helpTranslateDescription: "रिकॉर्डिंग का अनुवाद करके भाषाओं को संरक्षित करने में मदद करें",
    uploadRecording: "रिकॉर्डिंग अपलोड करें",
    uploadExistingDescription: "मौजूदा ऑडियो फ़ाइलों को आर्काइव में अपलोड करें",
    communityStats: "समुदाय के आंकड़े",
    languagesArchived: "संग्रहीत भाषाएँ",
    totalRecordings: "कुल रिकॉर्डिंग",
    activeContributors: "सक्रिय योगदानकर्ता",
    learnAboutAWAaz: "AWAaz के बारे में जानें",
    preserveLanguagesSubtitle: "आवाज़ रिकॉर्डिंग के माध्यम से सांस्कृतिक विरासत को संरक्षित करें"
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
