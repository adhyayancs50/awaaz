
export enum ContentType {
  WORD = "word",
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
  tribe?: string;
  region?: string;
  isLoggedIn: boolean;
}

export interface Recording {
  id: string;
  title: string;
  contentType: ContentType;
  audioUrl: string;
  duration: number;
  date: string;
  tribe?: string;
  language?: string;
  region?: string;
  speaker?: string;
  transcription?: string;
  translations?: {
    [key in TranslationLanguage]?: string;
  };
  userId: string;
  syncStatus: 'local' | 'syncing' | 'synced';
  imageUrl?: string;
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
  tribe?: string;
  language?: string;
  region?: string;
  speaker?: string;
}
