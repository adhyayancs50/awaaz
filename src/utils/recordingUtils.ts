
import { Recording } from "@/types";
import { RecordingStats } from "@/types/recording";

/**
 * Calculates statistics based on recordings data
 */
export const calculateRecordingStats = (recordings: Recording[]): RecordingStats => {
  // Get unique languages by filtering out empty strings and null values
  const languages = new Set(recordings
    .filter(rec => rec.language && rec.language.trim() !== "")
    .map(rec => rec.language?.toLowerCase().trim()));
  
  // Get unique contributors
  const uniqueContributors = new Set(recordings
    .filter(rec => rec.userId && rec.userId.trim() !== "")
    .map(rec => rec.userId));
  
  return {
    languages: languages.size,
    recordings: recordings.length,
    contributors: uniqueContributors.size
  };
};

/**
 * Gets a single recording by ID
 */
export const findRecordingById = (recordings: Recording[], id: string): Recording | undefined => {
  return recordings.find(rec => rec.id === id);
};

/**
 * Mock function to simulate syncing recordings to a backend
 */
export const syncRecordingsToBackend = async (recordings: Recording[]): Promise<Recording[]> => {
  // Find recordings that need syncing
  const unsynced = recordings.filter(rec => rec.syncStatus === 'local');
  
  if (unsynced.length === 0) {
    return recordings; // No changes needed
  }

  // Update status to syncing
  const updatedRecordings = recordings.map(rec => 
    rec.syncStatus === 'local' ? { ...rec, syncStatus: 'syncing' as const } : rec
  );

  // Mock API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // After successful sync, update status to synced
  return updatedRecordings.map(rec => 
    rec.syncStatus === 'syncing' ? { ...rec, syncStatus: 'synced' as const } : rec
  );
};
