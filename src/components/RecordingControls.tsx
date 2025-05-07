
import React from "react";
import { Button } from "@/components/ui/button";
import { useRecorder } from "@/contexts/RecorderContext";
import AudioWaveform from "@/components/AudioWaveform";
import { formatTime } from "@/lib/utils";
import { ContentType } from "@/types";

const RecordingControls: React.FC = () => {
  const { 
    recorderState, 
    recordAudio, 
    stopRecording, 
    pauseRecording, 
    resumeRecording, 
    resetRecording 
  } = useRecorder();
  
  const { isRecording, isPaused, duration, contentType } = recorderState;
  
  const handleStartRecording = async (type: ContentType) => {
    await recordAudio(type);
  };
  
  return (
    <div className="flex flex-col items-center">
      {!isRecording && !contentType ? (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <h2 className="text-lg font-medium text-center">What would you like to record?</h2>
          <div className="grid grid-cols-1 gap-3">
            <Button 
              variant="outline" 
              className="h-16 text-lg border-2 border-primary hover:bg-primary/10"
              onClick={() => handleStartRecording(ContentType.WORD)}
            >
              Single Word or Phrase
            </Button>
            <Button 
              variant="outline"
              className="h-16 text-lg border-2 border-primary hover:bg-primary/10"
              onClick={() => handleStartRecording(ContentType.STORY)}
            >
              Story or Conversation
            </Button>
            <Button 
              variant="outline"
              className="h-16 text-lg border-2 border-primary hover:bg-primary/10"
              onClick={() => handleStartRecording(ContentType.SONG)}
            >
              Song or Music
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 w-full max-w-xs">
          <div className="bg-white p-6 rounded-full shadow-lg">
            <AudioWaveform isRecording={isRecording} isPaused={isPaused} />
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-medium mb-1">
              {contentType === ContentType.WORD ? "Recording Word" : 
               contentType === ContentType.STORY ? "Recording Story" : 
               "Recording Song"}
            </h2>
            <p className="text-2xl font-bold">{formatTime(duration)}</p>
          </div>
          
          <div className="flex justify-center gap-4">
            {isRecording ? (
              <>
                {isPaused ? (
                  <Button 
                    variant="outline"
                    size="lg"
                    className="rounded-full w-14 h-14 flex items-center justify-center"
                    onClick={resumeRecording}
                  >
                    <span className="sr-only">Resume</span>
                    <div className="w-4 h-8 bg-primary"></div>
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    size="lg"
                    className="rounded-full w-14 h-14 flex items-center justify-center"
                    onClick={pauseRecording}
                  >
                    <span className="sr-only">Pause</span>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <div className="w-2 h-8 bg-primary mr-1"></div>
                      <div className="w-2 h-8 bg-primary"></div>
                    </div>
                  </Button>
                )}
                
                <Button 
                  variant="destructive"
                  size="lg"
                  className="rounded-full w-14 h-14 flex items-center justify-center"
                  onClick={stopRecording}
                >
                  <span className="sr-only">Stop</span>
                  <div className="w-6 h-6 bg-white"></div>
                </Button>
              </>
            ) : (
              <Button 
                variant="default"
                className="py-2 px-4"
                onClick={resetRecording}
              >
                Start Over
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
