
import React, { useEffect, useRef } from "react";

interface AudioWaveformProps {
  isRecording: boolean;
  isPaused: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ isRecording, isPaused }) => {
  const bars = 5;
  const waveRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!waveRef.current) return;
    
    const barElements = Array.from(waveRef.current.querySelectorAll('.bar'));
    if (!isRecording || isPaused) {
      barElements.forEach(bar => {
        const htmlBar = bar as HTMLElement;
        htmlBar.style.height = '12px';
        htmlBar.style.opacity = isPaused ? '0.5' : '1';
      });
      return;
    }
    
    const animate = () => {
      if (!waveRef.current || !isRecording || isPaused) return;
      
      barElements.forEach(bar => {
        const htmlBar = bar as HTMLElement;
        const height = Math.floor(Math.random() * 30) + 5;
        htmlBar.style.height = `${height}px`;
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isRecording, isPaused]);
  
  return (
    <div ref={waveRef} className="audio-wave-animation">
      {Array.from({ length: bars }).map((_, index) => (
        <div
          key={index}
          className={`bar transition-all duration-300 ${
            isRecording && !isPaused ? "" : ""
          }`}
          style={{ 
            height: "12px",
            opacity: isPaused ? 0.5 : 1
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
