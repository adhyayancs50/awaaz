
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecordings } from "@/contexts/RecordingContext";
import { useToast } from "@/components/ui/use-toast";
import { ContentType, Recording, Thread } from "@/types";
import RecordingCard from "@/components/RecordingCard";
import EmptyState from "@/components/EmptyState";
import FilterBar from "@/components/FilterBar";
import { useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "@/contexts/TranslationContext";
import ThreadView from "@/components/ThreadView";
import { Button } from "@/components/ui/button";
import { Bookmark, ListMusic } from "lucide-react";

const ArchivePage: React.FC = () => {
  const { user } = useAuth();
  const { recordings, bookmarkedRecordings, deleteRecording } = useRecordings();
  const { toast } = useToast();
  const { t } = useTranslation();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    contentType: null as ContentType | null,
    language: null as string | null,
    tribe: null as string | null,
    threadOnly: false,
  });
  
  const [availableFilters, setAvailableFilters] = useState({
    languages: [] as string[],
    tribes: [] as string[],
  });
  
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  
  // Apply location state if present (for language filtering from map)
  useEffect(() => {
    if (location.state?.filterLanguage) {
      setActiveFilters(prev => ({
        ...prev,
        language: location.state.filterLanguage
      }));
      // Clear location state to prevent filter persisting on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
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
  
  // Group recordings into threads
  useEffect(() => {
    const threadMap = new Map<string, Recording[]>();
    
    // Group recordings by thread title
    recordings.forEach(recording => {
      if (recording.threadTitle) {
        if (!threadMap.has(recording.threadTitle)) {
          threadMap.set(recording.threadTitle, [recording]);
        } else {
          threadMap.get(recording.threadTitle)?.push(recording);
        }
      }
    });
    
    // Convert map to array of Thread objects
    const threadArray: Thread[] = Array.from(threadMap).map(([title, parts]) => ({
      title,
      parts: parts.sort((a, b) => {
        // Sort by part number if available, otherwise by date
        if (a.partNumber && b.partNumber) {
          return parseInt(a.partNumber) - parseInt(b.partNumber);
        }
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }),
    }));
    
    setThreads(threadArray);
  }, [recordings]);
  
  // Apply filters and search
  useEffect(() => {
    let filtered = [...recordings];
    
    // Filter by active tab - removed "followed" logic
    if (activeTab === "bookmarked") {
      filtered = bookmarkedRecordings;
    }
    
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
    
    // Apply thread only filter
    if (activeFilters.threadOnly) {
      filtered = filtered.filter(rec => rec.threadTitle);
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
        (rec.threadTitle && rec.threadTitle.toLowerCase().includes(term)) ||
        (rec.transcription && rec.transcription.toLowerCase().includes(term))
      );
    }
    
    setFilteredRecordings(filtered);
  }, [recordings, bookmarkedRecordings, searchTerm, activeFilters, activeTab]);
  
  const handleFilterChange = (
    type: "contentType" | "language" | "tribe" | "threadOnly", 
    value: any
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
      threadOnly: false,
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
  
  // Group recordings by thread for display
  const getGroupedContent = () => {
    // If a specific thread is selected, return just that thread
    if (selectedThread) {
      return (
        <div className="mb-6">
          <ThreadView 
            threadTitle={selectedThread} 
            onClose={() => setSelectedThread(null)} 
          />
        </div>
      );
    }
    
    // First, display threads if we're not filtering too specifically
    const visibleThreads = threads.filter(thread => {
      const threadVisible = thread.parts.some(part => 
        filteredRecordings.some(rec => rec.id === part.id)
      );
      return threadVisible;
    });
    
    // Get recordings that are not part of any thread, or all recordings if threadOnly is false
    const standaloneRecordings = activeFilters.threadOnly 
      ? [] 
      : filteredRecordings.filter(rec => !rec.threadTitle);
    
    return (
      <>
        {visibleThreads.length > 0 && (
          <div className="mb-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center text-green-700">
              <ListMusic className="mr-2 h-5 w-5" />
              {t("storyThreads")}
            </h2>
            
            <div className="grid gap-4">
              {visibleThreads.map((thread) => (
                <div 
                  key={thread.title}
                  className="border rounded-lg p-4 hover:bg-green-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedThread(thread.title)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{thread.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {thread.parts.length} {thread.parts.length === 1 ? t("part") : t("parts")} • {thread.parts[0].language}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {thread.parts.some(part => bookmarkedRecordings.some(bm => bm.id === part.id)) && (
                        <Bookmark className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {standaloneRecordings.length > 0 && (
          <div className="grid gap-6">
            <h2 className="text-xl font-semibold text-green-700">
              {visibleThreads.length > 0 ? t("individualRecordings") : t("recordings")}
            </h2>
            
            {standaloneRecordings.map((recording) => (
              <RecordingCard
                key={recording.id}
                recording={recording}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
        
        {visibleThreads.length === 0 && standaloneRecordings.length === 0 && (
          <EmptyState
            title={t("noMatchingRecordings")}
            description={t("tryAdjustingFilters")}
            actionLabel={t("clearFilters")}
            actionRoute="#"
            icon="🔍"
            onAction={handleClearFilters}
          />
        )}
      </>
    );
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">{t("archive")}</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">{t("allRecordings")}</TabsTrigger>
          <TabsTrigger value="bookmarked" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            {t("bookmarked")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilters={activeFilters}
        availableFilters={availableFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        showThreadFilter={true}
      />
      
      {recordings.length === 0 ? (
        <EmptyState
          title={t("yourArchiveIsEmpty")}
          description={t("startRecording")}
          actionLabel={t("recordNow")}
          actionRoute="/"
          icon="🎵"
        />
      ) : (
        getGroupedContent()
      )}
    </div>
  );
};

export default ArchivePage;
