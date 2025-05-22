
import React, { createContext, useContext, useState, useRef } from "react";
import { RecorderState, ContentType } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface RecorderContextType {
  recorderState: RecorderState;
  recordingData: Blob | null;
  recordAudio: (contentType: ContentType) => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
  audioUrl: string | null;
}

const initialRecorderState: RecorderState = {
  isRecording: false,
  isPaused: false,
  duration: 0,
  contentType: null
};

const RecorderContext = createContext<RecorderContextType>({
  recorderState: initialRecorderState,
  recordingData: null,
  recordAudio: async () => {},
  stopRecording: () => {},
  pauseRecording: () => {},
  resumeRecording: () => {},
  resetRecording: () => {},
  audioUrl: null
});

export const useRecorder = () => useContext(RecorderContext);

export const RecorderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recorderState, setRecorderState] = useState<RecorderState>(initialRecorderState);
  const [recordingData, setRecordingData] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const recordAudio = async (contentType: ContentType) => {
    try {
      // Request permission to access the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordingData(audioBlob);
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorder.start();
      
      setRecorderState({
        isRecording: true,
        isPaused: false,
        duration: 0,
        contentType
      });
      
      // Start timer to track duration
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setRecorderState(prev => ({
          ...prev,
          duration: seconds
        }));
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone error",
        description: "Unable to access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recorderState.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setRecorderState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false
      }));
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recorderState.isRecording && !recorderState.isPaused) {
      mediaRecorderRef.current.pause();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setRecorderState(prev => ({
        ...prev,
        isPaused: true
      }));
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recorderState.isPaused) {
      mediaRecorderRef.current.resume();
      
      // Restart the timer
      let seconds = recorderState.duration;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setRecorderState(prev => ({
          ...prev,
          duration: seconds
        }));
      }, 1000);
      
      setRecorderState(prev => ({
        ...prev,
        isPaused: false
      }));
    }
  };

  const resetRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setRecorderState(initialRecorderState);
    setRecordingData(null);
    setAudioUrl(null);
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    streamRef.current = null;
  };

  return (
    <RecorderContext.Provider value={{
      recorderState,
      recordingData,
      recordAudio,
      stopRecording,
      pauseRecording,
      resumeRecording,
      resetRecording,
      audioUrl
    }}>
      {children}
    </RecorderContext.Provider>
  );
};
