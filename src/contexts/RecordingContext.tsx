import React, { createContext, useContext, useState, useEffect } from "react";
import { Recording, ContentType, TranslationLanguage } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RecordingContextType {
  recordings: Recording[];
  bookmarkedRecordings: Recording[];
  addRecording: (recording: Omit<Recording, "id" | "date" | "syncStatus" | "userId">) => void;
  getRecording: (id: string) => Recording | undefined;
  updateRecording: (id: string, data: Partial<Recording>) => void;
  deleteRecording: (id: string) => void;
  toggleBookmark: (recordingId: string) => Promise<void>;
  isLoading: boolean;
  syncRecordings: () => Promise<void>;
  getStats: () => { languages: number, recordings: number, contributors: number, regions: number };
}

const RecordingContext = createContext<RecordingContextType>({
  recordings: [],
  bookmarkedRecordings: [],
  addRecording: () => {},
  getRecording: () => undefined,
  updateRecording: () => {},
  deleteRecording: () => {},
  toggleBookmark: async () => {},
  isLoading: true,
  syncRecordings: async () => {},
  getStats: () => ({ languages: 0, recordings: 0, contributors: 0, regions: 0 }),
});

export const useRecordings = () => useContext(RecordingContext);

export const RecordingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [bookmarkedRecordings, setBookmarkedRecordings] = useState<Recording[]>([]);
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

  // Load bookmarked recordings from Supabase
  useEffect(() => {
    const loadBookmarkedRecordings = async () => {
      if (!user?.id) return;

      try {
        const { data: bookmarks, error } = await supabase
          .from('bookmarks')
          .select(`
            recording_id,
            recordings (*)
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error("Error loading bookmarks:", error);
          return;
        }

        const bookmarkedRecs = bookmarks
          ?.map(bookmark => bookmark.recordings)
          .filter(Boolean) as Recording[] || [];
        
        setBookmarkedRecordings(bookmarkedRecs);
      } catch (error) {
        console.error("Failed to load bookmarked recordings:", error);
      }
    };

    loadBookmarkedRecordings();
  }, [user?.id]);

  // Save recordings to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("awaaz_recordings", JSON.stringify(recordings));
  }, [recordings]);

  // Calculate real-time statistics based on recordings data - Fixed regions count
  const getStats = () => {
    // Get unique languages by filtering out empty strings and null values
    const languages = new Set(recordings
      .filter(rec => rec.language && rec.language.trim() !== "")
      .map(rec => rec.language?.toLowerCase().trim()));
    
    // Get unique contributors
    const uniqueContributors = new Set(recordings
      .filter(rec => rec.userId && rec.userId.trim() !== "")
      .map(rec => rec.userId));
    
    // Fixed regions count - get unique regions from all recordings
    const regions = new Set(recordings
      .filter(rec => rec.region && rec.region.trim() !== "")
      .map(rec => rec.region?.toLowerCase().trim()));
    
    return {
      languages: languages.size,
      recordings: recordings.length,
      contributors: uniqueContributors.size,
      regions: regions.size
    };
  };

  const toggleBookmark = async (recordingId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark recordings",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if recording is already bookmarked
      const isBookmarked = bookmarkedRecordings.some(rec => rec.id === recordingId);

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('recording_id', recordingId);

        if (error) throw error;

        setBookmarkedRecordings(prev => prev.filter(rec => rec.id !== recordingId));
        toast({
          title: "Bookmark removed",
          description: "Recording removed from bookmarks",
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            recording_id: recordingId
          });

        if (error) throw error;

        const recording = recordings.find(rec => rec.id === recordingId);
        if (recording) {
          setBookmarkedRecordings(prev => [...prev, recording]);
        }

        toast({
          title: "Bookmark added",
          description: "Recording added to bookmarks",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
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
      isBookmarked: false,
      isFollowed: false,
    };

    setRecordings(prev => [...prev, newRecording]);
    
    toast({
      title: "Recording saved",
      description: "Your recording has been saved successfully",
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
      bookmarkedRecordings,
      addRecording, 
      getRecording, 
      updateRecording, 
      deleteRecording, 
      toggleBookmark,
      isLoading,
      syncRecordings,
      getStats
    }}>
      {children}
    </RecordingContext.Provider>
  );
};
