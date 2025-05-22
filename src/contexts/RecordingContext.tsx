
import React, { createContext, useContext, useState, useEffect } from "react";
import { Recording, ContentType, TranslationLanguage } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface RecordingContextType {
  recordings: Recording[];
  addRecording: (recording: Omit<Recording, "id" | "date" | "syncStatus" | "userId">) => void;
  getRecording: (id: string) => Recording | undefined;
  updateRecording: (id: string, data: Partial<Recording>) => void;
  deleteRecording: (id: string) => void;
  isLoading: boolean;
  syncRecordings: () => Promise<void>;
  getStats: () => { languages: number, recordings: number, contributors: number };
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
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load recordings from local storage on component mount
  useEffect(() => {
    const loadRecordings = () => {
      try {
        const storedRecordings = localStorage.getItem("awaaz_recordings");
        if (storedRecordings) {
          setRecordings(JSON.parse(storedRecordings));
        }
      } catch (error) {
        console.error("Failed to load recordings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecordings();
  }, []);

  // Save recordings to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("awaaz_recordings", JSON.stringify(recordings));
  }, [recordings]);

  // Calculate real-time statistics based on recordings data
  const getStats = () => {
    const languages = new Set(recordings.filter(rec => rec.language).map(rec => rec.language));
    const uniqueContributors = new Set(recordings.map(rec => rec.userId));
    
    return {
      languages: languages.size,
      recordings: recordings.length,
      contributors: uniqueContributors.size
    };
  };

  const addRecording = (recordingData: Omit<Recording, "id" | "date" | "syncStatus" | "userId">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save recordings",
        variant: "destructive",
      });
      return;
    }

    const newRecording: Recording = {
      ...recordingData,
      id: `rec_${Date.now()}`,
      date: new Date().toISOString(),
      syncStatus: 'local',
      userId: user.id,
    };

    setRecordings(prev => [...prev, newRecording]);
    
    toast({
      title: "Recording saved",
      description: "Your recording has been saved locally",
    });
  };

  const getRecording = (id: string) => {
    return recordings.find(rec => rec.id === id);
  };

  const updateRecording = (id: string, data: Partial<Recording>) => {
    setRecordings(prev => 
      prev.map(rec => rec.id === id ? { ...rec, ...data } : rec)
    );
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(rec => rec.id !== id));
    toast({
      title: "Recording deleted",
      description: "Your recording has been removed",
    });
  };

  // Mock function to simulate syncing recordings to a backend
  const syncRecordings = async () => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to sync recordings",
        variant: "destructive",
      });
      return;
    }

    // Find recordings that need syncing
    const unsynced = recordings.filter(rec => rec.syncStatus === 'local');
    
    if (unsynced.length === 0) {
      toast({
        title: "All synced",
        description: "All recordings are already synced",
      });
      return;
    }

    // Update status to syncing
    setRecordings(prev => 
      prev.map(rec => 
        rec.syncStatus === 'local' ? { ...rec, syncStatus: 'syncing' } : rec
      )
    );

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status to synced
      setRecordings(prev => 
        prev.map(rec => 
          rec.syncStatus === 'syncing' ? { ...rec, syncStatus: 'synced' } : rec
        )
      );
      
      toast({
        title: "Sync completed",
        description: `${unsynced.length} recordings have been synced`,
      });
    } catch (error) {
      console.error("Sync failed:", error);
      
      // Revert status back to local
      setRecordings(prev => 
        prev.map(rec => 
          rec.syncStatus === 'syncing' ? { ...rec, syncStatus: 'local' } : rec
        )
      );
      
      toast({
        title: "Sync failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

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
