
import { Recording as BaseRecording } from "@/types";

// Extended types specific to recording functionality
export interface RecordingStats {
  languages: number;
  recordings: number;
  contributors: number;
}

export interface NewRecordingData extends Omit<BaseRecording, "id" | "date" | "syncStatus" | "userId"> {
  // Fields required for adding a new recording
}
