
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecorder } from "@/contexts/RecorderContext";
import { useTranslation } from "@/contexts/TranslationContext";
import RecordingControls from "@/components/RecordingControls";
import RecordingForm from "@/components/RecordingForm";
import AuthForm from "@/components/AuthForm";
import { motion } from "framer-motion";

const RecordPage: React.FC = () => {
  const { user } = useAuth();
  const { audioUrl } = useRecorder();
  const { t } = useTranslation();
  
  if (!user?.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("signIn")}
        </motion.h1>
        <AuthForm />
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <motion.h1 
        className="text-3xl font-bold mb-8 text-center text-green-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {t("record")}
      </motion.h1>
      
      {audioUrl ? (
        <RecordingForm />
      ) : (
        <RecordingControls />
      )}
    </div>
  );
};

export default RecordPage;
