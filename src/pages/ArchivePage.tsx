
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecordings } from "@/contexts/RecordingContext";
import { useToast } from "@/components/ui/use-toast";
import { ContentType, Recording } from "@/types";
import RecordingCard from "@/components/RecordingCard";
import EmptyState from "@/components/EmptyState";
import FilterBar from "@/components/FilterBar";

const ArchivePage: React.FC = () => {
  const { user } = useAuth();
  const { recordings, deleteRecording } = useRecordings();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    contentType: null as ContentType | null,
    language: null as string | null,
    tribe: null as string | null,
  });
  
  const [availableFilters, setAvailableFilters] = useState({
    languages: [] as string[],
    tribes: [] as string[],
  });
  
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);
  
  // Populate available filters from recordings
  useEffect(() => {
    const languages = new Set<string>();
    const tribes = new Set<string>();
    
    recordings.forEach(recording => {
      if (recording.language) languages.add(recording.language);
      if (recording.tribe) tribes.add(recording.tribe);
    });
    
    setAvailableFilters({
      languages: Array.from(languages),
      tribes: Array.from(tribes),
    });
  }, [recordings]);
  
  // Apply filters and search
  useEffect(() => {
    let filtered = [...recordings];
    
    // Apply content type filter
    if (activeFilters.contentType) {
      filtered = filtered.filter(rec => rec.contentType === activeFilters.contentType);
    }
    
    // Apply language filter
    if (activeFilters.language) {
      filtered = filtered.filter(rec => rec.language === activeFilters.language);
    }
    
    // Apply tribe filter
    if (activeFilters.tribe) {
      filtered = filtered.filter(rec => rec.tribe === activeFilters.tribe);
    }
    
    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(rec => 
        rec.title.toLowerCase().includes(term) ||
        (rec.language && rec.language.toLowerCase().includes(term)) ||
        (rec.tribe && rec.tribe.toLowerCase().includes(term)) ||
        (rec.region && rec.region.toLowerCase().includes(term)) ||
        (rec.speaker && rec.speaker.toLowerCase().includes(term)) ||
        (rec.transcription && rec.transcription.toLowerCase().includes(term))
      );
    }
    
    setFilteredRecordings(filtered);
  }, [recordings, searchTerm, activeFilters]);
  
  const handleFilterChange = (
    type: "contentType" | "language" | "tribe", 
    value: string | null
  ) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value,
    }));
  };
  
  const handleClearFilters = () => {
    setActiveFilters({
      contentType: null,
      language: null,
      tribe: null,
    });
    setSearchTerm("");
  };
  
  const handleDelete = (id: string) => {
    deleteRecording(id);
  };
  
  if (!user?.isLoggedIn) {
    return (
      <EmptyState
        title="Sign in to access the archive"
        description="Create an account or sign in to browse the collection of recordings."
        icon="📚"
      />
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Archive</h1>
      
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilters={activeFilters}
        availableFilters={availableFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      {filteredRecordings.length === 0 ? (
        recordings.length === 0 ? (
          <EmptyState
            title="Your archive is empty"
            description="Start recording to preserve cultural heritage."
            actionLabel="Record Now"
            actionRoute="/"
            icon="🎵"
          />
        ) : (
          <EmptyState
            title="No matching recordings"
            description="Try adjusting your search or filters to find what you're looking for."
            actionLabel="Clear Filters"
            actionRoute="#"
            icon="🔍"
          />
        )
      ) : (
        <div className="grid gap-6">
          {filteredRecordings.map((recording) => (
            <RecordingCard
              key={recording.id}
              recording={recording}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivePage;
