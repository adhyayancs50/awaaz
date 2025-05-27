
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Recording, ContentType } from "@/types";
import AudioPlayer from "@/components/AudioPlayer";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface RecordingCardProps {
  recording: Recording;
  onDelete: (id: string) => void;
}

const RecordingCard: React.FC<RecordingCardProps> = ({ recording, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();
  
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.WORD:
        return "📝";
      case ContentType.STORY:
        return "📖";
      case ContentType.SONG:
        return "🎵";
      default:
        return "🎤";
    }
  };
  
  const getSyncStatusBadge = (status: Recording['syncStatus']) => {
    switch (status) {
      case 'local':
        return <Badge variant="outline">Local Only</Badge>;
      case 'syncing':
        return <Badge variant="secondary" className="animate-pulse-gentle">Syncing...</Badge>;
      case 'synced':
        return <Badge variant="default">Synced</Badge>;
      default:
        return null;
    }
  };

  // Check if current user owns this recording
  const canDelete = user && recording.userId === user.id;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>{getContentTypeIcon(recording.contentType)}</span>
            <span>{recording.title}</span>
          </CardTitle>
          {getSyncStatusBadge(recording.syncStatus)}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <AudioPlayer audioUrl={recording.audioUrl} />
        
        {showDetails ? (
          <div className="mt-4 space-y-2 text-sm">
            {recording.language && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language:</span>
                <span className="font-medium">{recording.language}</span>
              </div>
            )}
            
            {recording.tribe && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tribe/Community:</span>
                <span className="font-medium">{recording.tribe}</span>
              </div>
            )}
            
            {recording.region && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Region:</span>
                <span className="font-medium">{recording.region}</span>
              </div>
            )}
            
            {recording.speaker && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Speaker:</span>
                <span className="font-medium">{recording.speaker}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{formatDate(new Date(recording.date))}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{Math.round(recording.duration)} seconds</span>
            </div>
            
            {recording.transcription && (
              <div className="pt-2">
                <span className="text-muted-foreground block mb-1">Transcription:</span>
                <p className="font-medium bg-neutral-100 p-2 rounded">{recording.transcription}</p>
              </div>
            )}
            
            {recording.translations && Object.entries(recording.translations).length > 0 && (
              <div className="pt-2">
                <span className="text-muted-foreground block mb-1">Translations:</span>
                {Object.entries(recording.translations).map(([lang, text]) => (
                  <div key={lang} className="mb-2">
                    <p className="text-xs font-semibold uppercase">{lang}:</p>
                    <p className="font-medium bg-neutral-100 p-2 rounded">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2 text-sm flex gap-x-4">
            {recording.language && (
              <div className="flex items-center">
                <span>Language:</span>
                <Badge variant="outline" className="ml-1">{recording.language}</Badge>
              </div>
            )}
            
            {recording.tribe && (
              <div className="flex items-center">
                <span>Tribe:</span>
                <Badge variant="outline" className="ml-1">{recording.tribe}</Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Show Less" : "Show Details"}
        </Button>
        
        {canDelete && (
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(recording.id)}>
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RecordingCard;
