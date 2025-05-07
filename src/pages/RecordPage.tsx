
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecorder } from "@/contexts/RecorderContext";
import { Button } from "@/components/ui/button";
import RecordingControls from "@/components/RecordingControls";
import RecordingForm from "@/components/RecordingForm";
import EmptyState from "@/components/EmptyState";

const RecordPage: React.FC = () => {
  const { user } = useAuth();
  const { audioUrl, resetRecording } = useRecorder();
  
  if (!user?.isLoggedIn) {
    return (
      <EmptyState
        title="Sign in to start recording"
        description="Create an account or sign in to preserve cultural heritage through audio recordings."
        icon="🎙️"
      />
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Record</h1>
      
      {audioUrl ? (
        <RecordingForm />
      ) : (
        <RecordingControls />
      )}
    </div>
  );
};

export default RecordPage;
