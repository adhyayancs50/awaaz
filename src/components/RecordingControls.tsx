
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRecorder } from "@/contexts/RecorderContext";
import AudioWaveform from "@/components/AudioWaveform";
import { formatTime } from "@/lib/utils";
import { ContentType } from "@/types";
import { useTranslation } from "@/contexts/TranslationContext";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const RecordingControls: React.FC = () => {
  const { 
    recorderState, 
    recordAudio, 
    stopRecording, 
    pauseRecording, 
    resumeRecording, 
    resetRecording 
  } = useRecorder();
  const { t } = useTranslation();
  
  const [language, setLanguage] = useState("");
  const [region, setRegion] = useState(""); // Added region state
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  
  const { isRecording, isPaused, duration, contentType } = recorderState;
  
  const handleContentTypeSelection = (type: ContentType) => {
    setSelectedContentType(type);
    setShowLanguagePrompt(true);
  };
  
  const handleStartRecording = async () => {
    if (!language.trim()) {
      toast({
        title: t("error"),
        description: t("languageRequired"),
        variant: "destructive",
      });
      return;
    }
    
    if (!region.trim()) {
      toast({
        title: t("error"),
        description: "Please enter a region",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedContentType) {
      await recordAudio(selectedContentType, region); // Passing region to recordAudio
      setShowLanguagePrompt(false);
    }
  };
  
  const handleCancelLanguagePrompt = () => {
    setShowLanguagePrompt(false);
    setSelectedContentType(null);
    setLanguage("");
    setRegion(""); // Reset region too
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isRecording && !contentType ? (
        <>
          {showLanguagePrompt ? (
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <h2 className="text-lg font-medium text-center">{t("enterLanguageName")}</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">{t("language")} ({t("required")})</Label>
                  <Input
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder={t("languageName")}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region">{t("region")} ({t("required")})</Label>
                  <Input
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder={t("enterRegionOrState")}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                
                <div className="flex justify-between gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelLanguagePrompt}
                    className="flex-1"
                  >
                    {t("cancel")}
                  </Button>
                  <Button 
                    onClick={handleStartRecording}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {t("startRecording")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <h2 className="text-lg font-medium text-center">{t("recordSentence")}</h2>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  className="h-16 text-lg border-2 border-green-600 hover:bg-green-50 text-green-700"
                  onClick={() => handleContentTypeSelection(ContentType.WORD)}
                >
                  Phrase
                </Button>
                <Button 
                  variant="outline"
                  className="h-16 text-lg border-2 border-green-600 hover:bg-green-50 text-green-700"
                  onClick={() => handleContentTypeSelection(ContentType.STORY)}
                >
                  Stories
                </Button>
                <Button 
                  variant="outline"
                  className="h-16 text-lg border-2 border-green-600 hover:bg-green-50 text-green-700"
                  onClick={() => handleContentTypeSelection(ContentType.SONG)}
                >
                  {t("song")}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-5 w-full max-w-xs">
          <motion.div 
            className="bg-white p-6 rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AudioWaveform isRecording={isRecording} isPaused={isPaused} />
          </motion.div>
          
          <div className="text-center">
            <h2 className="text-xl font-medium mb-1">
              {contentType === ContentType.WORD ? "Phrase" : 
               contentType === ContentType.STORY ? "Stories" : 
               t("song")}
            </h2>
            <p className="text-2xl font-bold">{formatTime(duration)}</p>
          </div>
          
          <div className="flex justify-center gap-4">
            {isRecording ? (
              <>
                {isPaused ? (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline"
                      size="lg"
                      className="rounded-full w-14 h-14 flex items-center justify-center border-2 border-green-500"
                      onClick={resumeRecording}
                    >
                      <span className="sr-only">{t("resume")}</span>
                      <div className="w-4 h-8 bg-green-500"></div>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline"
                      size="lg"
                      className="rounded-full w-14 h-14 flex items-center justify-center border-2 border-green-500"
                      onClick={pauseRecording}
                    >
                      <span className="sr-only">{t("pause")}</span>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <div className="w-2 h-8 bg-green-500 mr-1"></div>
                        <div className="w-2 h-8 bg-green-500"></div>
                      </div>
                    </Button>
                  </motion.div>
                )}
                
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="destructive"
                    size="lg"
                    className="rounded-full w-14 h-14 flex items-center justify-center bg-red-500 hover:bg-red-600"
                    onClick={stopRecording}
                  >
                    <span className="sr-only">{t("stop")}</span>
                    <div className="w-6 h-6 bg-white"></div>
                  </Button>
                </motion.div>
              </>
            ) : (
              <Button 
                variant="default"
                className="py-2 px-4 bg-green-600 hover:bg-green-700"
                onClick={resetRecording}
              >
                {t("startOver")}
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RecordingControls;
