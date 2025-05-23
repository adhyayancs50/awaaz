
import { useState, useEffect } from "react";
import { Recording } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { syncRecordingsToBackend, calculateRecordingStats, findRecordingById } from "@/utils/recordingUtils";
import { RecordingStats, NewRecordingData } from "@/types/recording";

/**
 * Custom hook that handles recordings data and operations
 */
export const useRecordingsData = (userId?: string) => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recordings from local storage on hook initialization
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

  // Get recording statistics
  const getStats = (): RecordingStats => {
    return calculateRecordingStats(recordings);
  };

  // Add a new recording
  const addRecording = (recordingData: NewRecordingData) => {
    if (!userId) {
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
      userId: userId,
      isBookmarked: false,
      isFollowed: false,
    };

    setRecordings(prev => [...prev, newRecording]);
    
    toast({
      title: "Recording saved",
      description: "Your recording has been saved successfully",
    });
  };

  // Get a specific recording by ID
  const getRecording = (id: string) => {
    return findRecordingById(recordings, id);
  };

  // Update an existing recording
  const updateRecording = (id: string, data: Partial<Recording>) => {
    setRecordings(prev => 
      prev.map(rec => rec.id === id ? { ...rec, ...data } : rec)
    );
  };

  // Delete a recording
  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(rec => rec.id !== id));
    toast({
      title: "Recording deleted",
      description: "Your recording has been removed",
    });
  };

  // Sync recordings with the backend
  const syncRecordings = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to sync recordings",
        variant: "destructive",
      });
      return;
    }

    const unsynced = recordings.filter(rec => rec.syncStatus === 'local');
    
    if (unsynced.length === 0) {
      toast({
        title: "All synced",
        description: "All recordings are already synced",
      });
      return;
    }

    try {
      const updatedRecordings = await syncRecordingsToBackend(recordings);
      setRecordings(updatedRecordings);
      
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

  return {
    recordings,
    isLoading,
    getStats,
    addRecording,
    getRecording,
    updateRecording,
    deleteRecording,
    syncRecordings
  };
};
