
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecordings } from "@/contexts/RecordingContext";
import { Recording, TranslationLanguage } from "@/types";
import { useTranslation } from "@/contexts/TranslationContext";
import AudioPlayer from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import EmptyState from "@/components/EmptyState";
import { motion } from "framer-motion";

const TranslationPage: React.FC = () => {
  const { user } = useAuth();
  const { recordings, updateRecording } = useRecordings();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<TranslationLanguage>(TranslationLanguage.HINDI);
  const [translationText, setTranslationText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRecordings, setAvailableRecordings] = useState<Recording[]>([]);
  
  // Filter recordings that are available for translation
  useEffect(() => {
    if (!user) return;
    
    // Get recordings by other users and exclude those already translated by current user
    const recordingsForTranslation = recordings.filter(recording => {
      // Skip user's own recordings
      if (recording.userId === user.id) return false;
      
      // Check if this language translation is already done
      const hasTranslation = recording.translations && 
                            recording.translations[targetLanguage];
                              
      return !hasTranslation;
    });
    
    setAvailableRecordings(recordingsForTranslation);
    
    // Reset selected recording if it's no longer available
    if (selectedRecordingId && 
        !recordingsForTranslation.some(rec => rec.id === selectedRecordingId)) {
      setSelectedRecordingId(null);
      setTranslationText("");
    }
  }, [recordings, user, targetLanguage]);
  
  const selectedRecording = selectedRecordingId 
    ? recordings.find(rec => rec.id === selectedRecordingId) 
    : null;
    
  const handleSubmitTranslation = () => {
    if (!selectedRecording || !translationText.trim()) {
      toast({
        title: t("error"),
        description: t("selectRecordingAndEnterTranslation"),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create translations object if it doesn't exist
      const existingTranslations = selectedRecording.translations || {};
      
      // Update the recording with the new translation
      updateRecording(selectedRecording.id, {
        translations: {
          ...existingTranslations,
          [targetLanguage]: translationText,
        }
      });
      
      toast({
        title: t("success"),
        description: t("translationSaved"),
      });
      
      // Reset form
      setSelectedRecordingId(null);
      setTranslationText("");
    } catch (error) {
      console.error("Translation submission failed:", error);
      toast({
        title: t("error"),
        description: t("translationSubmissionFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user?.isLoggedIn) {
    return (
      <EmptyState
        title={t("signInToTranslate")}
        description={t("createAccountOrSignInToTranslate")}
        icon="🌐"
      />
    );
  }
  
  return (
    <motion.div 
      className="max-w-md mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">{t("translate")}</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("translationInstructions")}</CardTitle>
          <CardDescription>{t("selectTranslationLanguage")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={targetLanguage}
            onValueChange={(value) => setTargetLanguage(value as TranslationLanguage)}
          >
            <SelectTrigger className="w-full mb-4 border-green-300">
              <SelectValue placeholder={t("translateTo")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TranslationLanguage.HINDI}>{t("hindi")}</SelectItem>
              <SelectItem value={TranslationLanguage.ENGLISH}>{t("english")}</SelectItem>
            </SelectContent>
          </Select>
          
          {availableRecordings.length > 0 ? (
            <Select
              value={selectedRecordingId || ""}
              onValueChange={setSelectedRecordingId}
            >
              <SelectTrigger className="w-full border-green-300">
                <SelectValue placeholder={t("selectRecording")} />
              </SelectTrigger>
              <SelectContent>
                {availableRecordings.map(recording => (
                  <SelectItem key={recording.id} value={recording.id}>
                    {recording.title} 
                    {recording.language && ` (${recording.language})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-muted-foreground text-center py-4">{t("noRecordingsToTranslate")}</p>
          )}
        </CardContent>
      </Card>
      
      {selectedRecording && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{selectedRecording.title}</CardTitle>
              <CardDescription>
                {selectedRecording.language && `${t("language")}: ${selectedRecording.language}`}
                {selectedRecording.speaker && ` • ${t("speaker")}: ${selectedRecording.speaker}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AudioPlayer audioUrl={selectedRecording.audioUrl} />
              
              {selectedRecording.transcription && (
                <div className="mt-4">
                  <h3 className="font-medium mb-1">{t("originalTranscription")}:</h3>
                  <p className="p-3 bg-gray-50 rounded border">{selectedRecording.transcription}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {targetLanguage === TranslationLanguage.HINDI
                  ? t("translateToHindi")
                  : t("translateToEnglish")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={translationText}
                onChange={(e) => setTranslationText(e.target.value)}
                placeholder={t("enterTranslationHere")}
                rows={6}
                className="resize-none border-green-300 focus:border-green-500 focus:ring-green-500"
              />
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmitTranslation} 
                disabled={isSubmitting || !translationText.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? t("submitting") : t("submitTranslation")}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TranslationPage;
