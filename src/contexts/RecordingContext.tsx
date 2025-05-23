
import React, { createContext, useContext } from "react";
import { Recording } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRecordingsData } from "@/hooks/useRecordingsData";
import { RecordingStats } from "@/types/recording";

interface RecordingContextType {
  recordings: Recording[];
  addRecording: (recording: Omit<Recording, "id" | "date" | "syncStatus" | "userId">) => void;
  getRecording: (id: string) => Recording | undefined;
  updateRecording: (id: string, data: Partial<Recording>) => void;
  deleteRecording: (id: string) => void;
  isLoading: boolean;
  syncRecordings: () => Promise<void>;
  getStats: () => RecordingStats;
}

const RecordingContext = createContext<RecordingContextType>({
  recordings: [],
  addRecording: () => {},
  getRecording: () => undefined,
  updateRecording: () => {},
  deleteRecording: () => {},
  isLoading: true,
  syncRecordings: async () => {},
  getStats: () => ({ languages: 0, recordings: 0, contributors: 0 }),
});

export const useRecordings = () => useContext(RecordingContext);

export const RecordingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const {
    recordings,
    isLoading,
    getStats,
    addRecording,
    getRecording,
    updateRecording,
    deleteRecording,
    syncRecordings
  } = useRecordingsData(user?.id);

  return (
    <RecordingContext.Provider value={{ 
      recordings, 
      addRecording, 
      getRecording, 
      updateRecording, 
      deleteRecording, 
      isLoading,
      syncRecordings,
      getStats
    }}>
      {children}
    </RecordingContext.Provider>
  );
};
