
import React from "react";

interface AudioWaveformProps {
  isRecording: boolean;
  isPaused: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ isRecording, isPaused }) => {
  const bars = 5;
  
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {Array.from({ length: bars }).map((_, index) => (
        <div
          key={index}
          className={`w-2 bg-primary rounded-full transition-all ${
            isRecording && !isPaused
              ? `animate-wave-${index + 1}`
              : "h-3"
          }`}
          style={{ 
            height: isRecording && !isPaused ? `${Math.random() * 30 + 10}px` : "12px",
            opacity: isPaused ? 0.5 : 1
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
