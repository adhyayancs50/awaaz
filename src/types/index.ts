
export enum ContentType {
  WORD = "word", // Renamed to "sentence" in UI but keeping enum the same for compatibility
  STORY = "story",
  SONG = "song"
}

export enum TranslationLanguage {
  HINDI = "hindi",
  ENGLISH = "english",
  ORIGINAL = "original"
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  isLoggedIn: boolean;
}

export interface Recording {
  id: string;
  title: string;
  contentType: ContentType;
  audioUrl: string;
  duration: number;
  date: string;
  language?: string;
  speaker?: string;
  tribe?: string;
  region?: string;
  transcription?: string;
  translations?: {
    [key in TranslationLanguage]?: string;
  };
  userId: string;
  syncStatus: 'local' | 'syncing' | 'synced';
  imageUrl?: string;
  // Thread-related fields
  threadTitle?: string;
  partNumber?: string;
  partDescription?: string;
  isBookmarked?: boolean;
  isFollowed?: boolean;
}

export interface Thread {
  title: string;
  parts: Recording[];
}

export interface SyncOptions {
  syncOnWifiOnly: boolean;
  autoSync: boolean;
}

export interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  contentType: ContentType | null;
}

export interface RecordingFormData {
  title: string;
  contentType: ContentType;
  language?: string;
  speaker?: string;
}
