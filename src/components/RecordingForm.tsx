
import React, { useState, useEffect } from "react";
import { useRecorder } from "@/contexts/RecorderContext";
import { useRecordings } from "@/contexts/RecordingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecordingFormData, ContentType } from "@/types";
import AudioPlayer from "@/components/AudioPlayer";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/contexts/TranslationContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RecordingForm: React.FC = () => {
  const { recorderState, audioUrl, recordingData, resetRecording } = useRecorder();
  const { addRecording } = useRecordings();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RecordingFormData>({
    title: "",
    contentType: recorderState.contentType || ContentType.WORD,
    language: "",
    speaker: "",
    region: recorderState.region || "", // Initialize region from recorderState
  });
  
  // Set default language from localStorage if available
  useEffect(() => {
    const lastUsedLanguage = localStorage.getItem("awaaz_last_language");
    if (lastUsedLanguage) {
      setFormData(prev => ({ ...prev, language: lastUsedLanguage }));
    }
    
    // Set region from recorder state if available
    if (recorderState.region) {
      setFormData(prev => ({ ...prev, region: recorderState.region }));
    }
  }, [recorderState.region]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioUrl || !recordingData) {
      toast({
        title: t("error"),
        description: t("recordingNotFound"),
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.title.trim()) {
      toast({
        title: t("error"),
        description: t("titleRequired"),
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.language?.trim()) {
      toast({
        title: t("error"),
        description: t("languageRequired"),
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.region?.trim()) {
      toast({
        title: t("error"),
        description: "Please enter the region or state",
        variant: "destructive",
      });
      return;
    }
    
    // Save the language preference for future recordings
    localStorage.setItem("awaaz_last_language", formData.language);
    
    addRecording({
      title: formData.title,
      contentType: formData.contentType,
      audioUrl: audioUrl,
      duration: recorderState.duration,
      language: formData.language,
      speaker: formData.speaker,
      region: formData.region, // Include region in recording
    });
    
    resetRecording();
    navigate("/archive");
  };
  
  if (!audioUrl) {
    return null;
  }
  
  return (
    <motion.div 
      className="animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">{t("saveYourRecording")}</h2>
      
      <div className="mb-6">
        <AudioPlayer audioUrl={audioUrl} />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">{t("title")} ({t("required")})</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={t("recordingTitle")}
            required
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        
        <div>
          <Label htmlFor="language">{t("language")} ({t("required")})</Label>
          <Input
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder={t("languageName")}
            required
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        
        <div>
          <Label htmlFor="region">{t("region")} ({t("required")})</Label>
          <Input
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder={t("enterRegionOrState")}
            required
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        
        <div>
          <Label htmlFor="speaker">{t("speaker")}</Label>
          <Input
            id="speaker"
            name="speaker"
            value={formData.speaker}
            onChange={handleChange}
            placeholder={t("speakerName")}
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetRecording}
            className="border-green-500 text-green-600 hover:bg-green-50"
          >
            {t("discard")}
          </Button>
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700"
          >
            {t("saveRecording")}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default RecordingForm;
