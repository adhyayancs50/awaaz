
import React, { useState } from "react";
import { useRecorder } from "@/contexts/RecorderContext";
import { useRecordings } from "@/contexts/RecordingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecordingFormData, ContentType } from "@/types";
import AudioPlayer from "@/components/AudioPlayer";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const RecordingForm: React.FC = () => {
  const { recorderState, audioUrl, recordingData, resetRecording } = useRecorder();
  const { addRecording } = useRecordings();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RecordingFormData>({
    title: "",
    contentType: recorderState.contentType || ContentType.WORD,
    tribe: "",
    language: "",
    region: "",
    speaker: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioUrl || !recordingData) {
      toast({
        title: "Recording not found",
        description: "Please record audio before saving",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your recording",
        variant: "destructive",
      });
      return;
    }
    
    addRecording({
      title: formData.title,
      contentType: formData.contentType,
      audioUrl: audioUrl,
      duration: recorderState.duration,
      tribe: formData.tribe,
      language: formData.language,
      region: formData.region,
      speaker: formData.speaker,
    });
    
    resetRecording();
    navigate("/archive");
  };
  
  if (!audioUrl) {
    return null;
  }
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">Save Your Recording</h2>
      
      <div className="mb-6">
        <AudioPlayer audioUrl={audioUrl} />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title (Required)</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Give your recording a title"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="Language name"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tribe">Tribe/Community</Label>
            <Input
              id="tribe"
              name="tribe"
              value={formData.tribe}
              onChange={handleChange}
              placeholder="Tribe or community name"
            />
          </div>
          <div>
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="Geographic region"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="speaker">Speaker</Label>
          <Input
            id="speaker"
            name="speaker"
            value={formData.speaker}
            onChange={handleChange}
            placeholder="Name of the speaker"
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={resetRecording}>
            Discard
          </Button>
          <Button type="submit">Save Recording</Button>
        </div>
      </form>
    </div>
  );
};

export default RecordingForm;
