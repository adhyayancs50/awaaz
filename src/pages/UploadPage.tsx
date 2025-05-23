
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useRecordings } from "@/contexts/RecordingContext";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Check, Bookmark, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ContentType } from "@/types";
import { motion } from "framer-motion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const UploadPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { addRecording, recordings } = useRecordings();
  const { toast } = useToast();
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [region, setRegion] = useState("");
  const [contentType, setContentType] = useState<ContentType>(ContentType.WORD);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  // New fields for storytelling threads feature
  const [isPartOfThread, setIsPartOfThread] = useState(false);
  const [threadTitle, setThreadTitle] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [partDescription, setPartDescription] = useState("");
  const [existingThreads, setExistingThreads] = useState<string[]>([]);
  const [selectedThread, setSelectedThread] = useState("");
  const [isNewThread, setIsNewThread] = useState(true);
  
  // Get unique thread titles from existing recordings
  React.useEffect(() => {
    const threads = new Set<string>();
    recordings.forEach(rec => {
      if (rec.threadTitle && rec.userId === user?.id) {
        threads.add(rec.threadTitle);
      }
    });
    setExistingThreads(Array.from(threads));
  }, [recordings, user]);
  
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
    
    // Thread validation
    if (isPartOfThread) {
      if (isNewThread && !threadTitle) {
        toast({
          title: t("error"),
          description: t("pleaseEnterThreadTitle"),
          variant: "destructive",
        });
        return;
      }
      
      if (!isNewThread && !selectedThread) {
        toast({
          title: t("error"),
          description: t("pleaseSelectExistingThread"),
          variant: "destructive",
        });
        return;
      }
    }
    
    // Create a blob URL for the audio file
    const audioUrl = URL.createObjectURL(audioFile);
    
    // Determine thread information
    const finalThreadTitle = isPartOfThread ? 
      (isNewThread ? threadTitle : selectedThread) : 
      undefined;
    
    // Add recording to the recordings context
    addRecording({
      title,
      language,
      contentType,
      audioUrl,
      duration: 0,
      transcription: "",
      translations: {},
      region,
      // Add thread-related fields
      threadTitle: finalThreadTitle,
      partNumber: isPartOfThread ? partNumber : undefined,
      partDescription: isPartOfThread ? partDescription : undefined
    });
    
    // Reset the form and show success message
    setAudioFile(null);
    setTitle("");
    setLanguage("");
    setRegion("");
    setIsPartOfThread(false);
    setThreadTitle("");
    setPartNumber("");
    setPartDescription("");
    setSelectedThread("");
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
                <Label htmlFor="region">{t("region")}</Label>
                <Input
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder={t("enterRegionOrState")}
                  className="border-green-200 focus:border-green-400"
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
                    {t("word")}
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
              
              <div className="space-y-2 pt-2 border-t border-green-100">
                <div className="flex items-center justify-between">
                  <Label htmlFor="thread-switch">{t("partOfStoryThread")}</Label>
                  <Switch
                    id="thread-switch"
                    checked={isPartOfThread}
                    onCheckedChange={setIsPartOfThread}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
                
                {isPartOfThread && (
                  <div className="space-y-4 p-3 bg-green-50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={isNewThread ? "default" : "outline"}
                        className={isNewThread ? "bg-green-600" : ""}
                        onClick={() => setIsNewThread(true)}
                      >
                        {t("newThread")}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={!isNewThread ? "default" : "outline"}
                        className={!isNewThread ? "bg-green-600" : ""}
                        onClick={() => setIsNewThread(false)}
                        disabled={existingThreads.length === 0}
                      >
                        {t("existingThread")}
                      </Button>
                    </div>
                    
                    {isNewThread ? (
                      <div className="space-y-2">
                        <Label htmlFor="thread-title">{t("threadTitle")}</Label>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-green-600 mr-2" />
                          <Input
                            id="thread-title"
                            value={threadTitle}
                            onChange={(e) => setThreadTitle(e.target.value)}
                            placeholder={t("enterThreadTitle")}
                            className="border-green-200 focus:border-green-400"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="existing-thread">{t("selectThread")}</Label>
                        <Select value={selectedThread} onValueChange={setSelectedThread}>
                          <SelectTrigger className="border-green-200 focus:border-green-400">
                            <SelectValue placeholder={t("selectExistingThread")} />
                          </SelectTrigger>
                          <SelectContent>
                            {existingThreads.map((thread) => (
                              <SelectItem key={thread} value={thread}>
                                {thread}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="part-number">{t("partNumber")}</Label>
                      <Input
                        id="part-number"
                        value={partNumber}
                        onChange={(e) => setPartNumber(e.target.value)}
                        placeholder={t("enterPartNumber")}
                        className="border-green-200 focus:border-green-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="part-description">{t("partDescription")}</Label>
                      <Textarea
                        id="part-description"
                        value={partDescription}
                        onChange={(e) => setPartDescription(e.target.value)}
                        placeholder={t("enterBriefDescription")}
                        className="border-green-200 focus:border-green-400"
                      />
                    </div>
                  </div>
                )}
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
