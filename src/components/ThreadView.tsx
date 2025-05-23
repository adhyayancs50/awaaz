import React, { useState } from "react";
import { useRecordings } from "@/contexts/RecordingContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Thread, Recording } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { PlayCircle, BookmarkPlus, Bookmark, Bell, BellOff, Clock, Globe } from "lucide-react";
import AudioPlayer from "./AudioPlayer";

interface ThreadViewProps {
  threadTitle: string;
  onClose?: () => void;
}

const ThreadView: React.FC<ThreadViewProps> = ({ threadTitle, onClose }) => {
  const { recordings, updateRecording } = useRecordings();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [activeRecording, setActiveRecording] = useState<Recording | null>(null);
  
  // Get all recordings in this thread, sorted by part number if available
  const threadRecordings = React.useMemo(() => {
    const filtered = recordings
      .filter(rec => rec.threadTitle === threadTitle)
      .sort((a, b) => {
        // If both have part numbers, sort numerically
        if (a.partNumber && b.partNumber) {
          const numA = parseInt(a.partNumber) || 0;
          const numB = parseInt(b.partNumber) || 0;
          return numA - numB;
        }
        // If only one has part number, prioritize it
        if (a.partNumber) return -1;
        if (b.partNumber) return 1;
        // Otherwise sort by date
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
    return filtered;
  }, [recordings, threadTitle]);
  
  // Check if any recording in this thread is bookmarked or followed
  const isThreadBookmarked = threadRecordings.some(rec => rec.isBookmarked);
  const isThreadFollowed = threadRecordings.some(rec => rec.isFollowed);
  
  // Toggle bookmark status for all recordings in thread
  const toggleBookmark = () => {
    threadRecordings.forEach(recording => {
      updateRecording(recording.id, { isBookmarked: !isThreadBookmarked });
    });
    
    toast({
      title: isThreadBookmarked ? t("threadUnbookmarked") : t("threadBookmarked"),
      description: isThreadBookmarked ? t("threadRemovedFromBookmarks") : t("threadAddedToBookmarks"),
    });
  };
  
  // Toggle follow status for all recordings in thread
  const toggleFollow = () => {
    threadRecordings.forEach(recording => {
      updateRecording(recording.id, { isFollowed: !isThreadFollowed });
    });
    
    toast({
      title: isThreadFollowed ? t("threadUnfollowed") : t("threadFollowed"),
      description: isThreadFollowed ? t("threadNotificationsOff") : t("threadNotificationsOn"),
    });
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }).format(date);
  };
  
  if (threadRecordings.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            {t("noRecordingsInThread")}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-green-50 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-green-700">{threadTitle}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {threadRecordings.length} {threadRecordings.length === 1 ? t("part") : t("parts")}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-green-200 hover:bg-green-100"
              onClick={toggleBookmark}
            >
              {isThreadBookmarked ? (
                <Bookmark className="h-4 w-4 text-green-600" />
              ) : (
                <BookmarkPlus className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-green-200 hover:bg-green-100"
              onClick={toggleFollow}
            >
              {isThreadFollowed ? (
                <Bell className="h-4 w-4 text-green-600" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {activeRecording ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                <PlayCircle className="h-4 w-4 mr-2 text-green-600" />
                {activeRecording.title}
                {activeRecording.partNumber && (
                  <Badge variant="outline" className="ml-2 border-green-200">
                    {t("part")} {activeRecording.partNumber}
                  </Badge>
                )}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveRecording(null)}
              >
                {t("backToList")}
              </Button>
            </div>
            
            {activeRecording.partDescription && (
              <p className="text-sm text-muted-foreground italic">
                {activeRecording.partDescription}
              </p>
            )}
            
            <AudioPlayer audioUrl={activeRecording.audioUrl} />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-green-100">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(activeRecording.date)}
              </div>
              
              <div className="flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                {activeRecording.language}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {threadRecordings.map((recording) => (
              <div 
                key={recording.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-green-50 transition-colors cursor-pointer"
                onClick={() => setActiveRecording(recording)}
              >
                <div className="flex items-center">
                  <PlayCircle className="h-5 w-5 mr-3 text-green-600" />
                  <div>
                    <h4 className="font-medium">{recording.title}</h4>
                    {recording.partNumber && (
                      <div className="text-sm text-muted-foreground">
                        {t("part")} {recording.partNumber}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(recording.date)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-green-50 flex justify-between p-3">
        <div className="text-xs text-muted-foreground">
          {t("language")}: {threadRecordings[0].language}
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
          >
            {t("close")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ThreadView;
