
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useRecordings } from "@/contexts/RecordingContext";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ContentType } from "@/types";
import { motion } from "framer-motion";

const UploadPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { addRecording } = useRecordings();
  const { toast } = useToast();
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [contentType, setContentType] = useState<ContentType>(ContentType.WORD);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile) {
      toast({
        title: t("error"),
        description: t("pleaseSelectAudioFile"),
        variant: "destructive",
      });
      return;
    }
    
    if (!language) {
      toast({
        title: t("error"),
        description: t("pleaseEnterLanguage"),
        variant: "destructive",
      });
      return;
    }
    
    if (!title) {
      toast({
        title: t("error"),
        description: t("pleaseEnterTitle"),
        variant: "destructive",
      });
      return;
    }
    
    // Create a blob URL for the audio file
    const audioUrl = URL.createObjectURL(audioFile);
    
    // Add recording to the recordings context
    // Adding a duration property (default to 0 for uploaded files since we can't easily determine duration)
    addRecording({
      title,
      language,
      contentType,
      audioUrl,
      duration: 0, // Adding the missing duration property
      transcription: "",
      translations: {}
    });
    
    // Reset the form and show success message
    setAudioFile(null);
    setTitle("");
    setLanguage("");
    setUploadComplete(true);
    
    // Reset the success message after 3 seconds
    setTimeout(() => {
      setUploadComplete(false);
    }, 3000);
  };
  
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
        {t("uploadRecording")}
      </motion.h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-green-700">{t("uploadAudioFile")}</CardTitle>
        </CardHeader>
        <CardContent>
          {uploadComplete ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-green-700 font-medium">{t("uploadSuccessful")}</p>
              <p className="text-sm text-muted-foreground mt-2">{t("recordingAddedToArchive")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">{t("language")}</Label>
                <Input
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder={t("enterLanguageName")}
                  className="border-green-200 focus:border-green-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">{t("title")}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("enterRecordingTitle")}
                  className="border-green-200 focus:border-green-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t("contentType")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={contentType === ContentType.WORD ? "default" : "outline"}
                    className={contentType === ContentType.WORD ? "bg-green-600 hover:bg-green-700" : "border-green-200"}
                    onClick={() => setContentType(ContentType.WORD)}
                  >
                    {t("sentence")}
                  </Button>
                  <Button
                    type="button"
                    variant={contentType === ContentType.STORY ? "default" : "outline"}
                    className={contentType === ContentType.STORY ? "bg-green-600 hover:bg-green-700" : "border-green-200"}
                    onClick={() => setContentType(ContentType.STORY)}
                  >
                    {t("story")}
                  </Button>
                  <Button
                    type="button"
                    variant={contentType === ContentType.SONG ? "default" : "outline"}
                    className={contentType === ContentType.SONG ? "bg-green-600 hover:bg-green-700" : "border-green-200"}
                    onClick={() => setContentType(ContentType.SONG)}
                  >
                    {t("song")}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audio-upload">{t("selectAudioFile")}</Label>
                <div className="border-2 border-dashed border-green-200 rounded-lg p-4 hover:bg-green-50 transition-colors">
                  <Input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="audio-upload" className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-8 w-8 text-green-600 mb-2" />
                    <span className="text-green-700 font-medium">{t("clickToSelectFile")}</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {audioFile ? audioFile.name : t("audioFormatSupported")}
                    </span>
                  </label>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!audioFile}
              >
                {t("upload")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
