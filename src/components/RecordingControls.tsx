
import React from "react";
import { Button } from "@/components/ui/button";
import { useRecorder } from "@/contexts/RecorderContext";
import AudioWaveform from "@/components/AudioWaveform";
import { formatTime } from "@/lib/utils";
import { ContentType } from "@/types";
import { useTranslation } from "@/contexts/TranslationContext";
import { motion } from "framer-motion";

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
  
  const { isRecording, isPaused, duration, contentType } = recorderState;
  
  const handleStartRecording = async (type: ContentType) => {
    await recordAudio(type);
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isRecording && !contentType ? (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <h2 className="text-lg font-medium text-center">{t("recordSentence")}</h2>
          <div className="grid grid-cols-1 gap-3">
            <Button 
              variant="outline" 
              className="h-16 text-lg border-2 border-green-600 hover:bg-green-50 text-green-700"
              onClick={() => handleStartRecording(ContentType.WORD)}
            >
              {t("singleSentence")}
            </Button>
            <Button 
              variant="outline"
              className="h-16 text-lg border-2 border-green-600 hover:bg-green-50 text-green-700"
              onClick={() => handleStartRecording(ContentType.STORY)}
            >
              {t("conversation")}
            </Button>
            <Button 
              variant="outline"
              className="h-16 text-lg border-2 border-green-600 hover:bg-green-50 text-green-700"
              onClick={() => handleStartRecording(ContentType.SONG)}
            >
              {t("song")}
            </Button>
          </div>
        </div>
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
              {contentType === ContentType.WORD ? t("singleSentence") : 
               contentType === ContentType.STORY ? t("conversation") : 
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
