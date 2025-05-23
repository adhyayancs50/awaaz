
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentType } from "@/types";
import { useTranslation } from "@/contexts/TranslationContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeFilters: {
    contentType: ContentType | null;
    language: string | null;
    tribe: string | null;
    threadOnly?: boolean;
  };
  availableFilters: {
    languages: string[];
    tribes: string[];
  };
  onFilterChange: (type: "contentType" | "language" | "tribe" | "threadOnly", value: any) => void;
  onClearFilters: () => void;
  showThreadFilter?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  activeFilters,
  availableFilters,
  onFilterChange,
  onClearFilters,
  showThreadFilter = false
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  const hasActiveFilters = 
    activeFilters.contentType !== null || 
    activeFilters.language !== null || 
    activeFilters.tribe !== null ||
    (showThreadFilter && activeFilters.threadOnly);
    
  return (
    <div className="mb-6 space-y-3">
      <div className="relative">
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("searchRecordings")}
          className="pr-10"
        />
        <span className="absolute right-3 top-2.5 text-muted-foreground">🔍</span>
      </div>
      
      <div>
        <div className={`flex flex-wrap gap-2 mb-2 ${isMobile ? 'justify-center' : ''}`}>
          <Badge
            variant={activeFilters.contentType === ContentType.WORD ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/20"
            onClick={() => 
              onFilterChange(
                "contentType", 
                activeFilters.contentType === ContentType.WORD ? null : ContentType.WORD
              )
            }
          >
            {t("word")}
          </Badge>
          
          <Badge
            variant={activeFilters.contentType === ContentType.STORY ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/20"
            onClick={() => 
              onFilterChange(
                "contentType", 
                activeFilters.contentType === ContentType.STORY ? null : ContentType.STORY
              )
            }
          >
            {t("story")}
          </Badge>
          
          <Badge
            variant={activeFilters.contentType === ContentType.SONG ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/20"
            onClick={() => 
              onFilterChange(
                "contentType", 
                activeFilters.contentType === ContentType.SONG ? null : ContentType.SONG
              )
            }
          >
            {t("song")}
          </Badge>
          
          {showThreadFilter && (
            <Badge
              variant={activeFilters.threadOnly ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20"
              onClick={() => 
                onFilterChange(
                  "threadOnly", 
                  !activeFilters.threadOnly
                )
              }
            >
              {t("storyThreads")}
            </Badge>
          )}
          
          {availableFilters.languages.map(lang => (
            <Badge
              key={lang}
              variant={activeFilters.language === lang ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20"
              onClick={() => 
                onFilterChange(
                  "language", 
                  activeFilters.language === lang ? null : lang
                )
              }
            >
              {lang}
            </Badge>
          ))}
          
          {availableFilters.tribes.map(tribe => (
            <Badge
              key={tribe}
              variant={activeFilters.tribe === tribe ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20"
              onClick={() => 
                onFilterChange(
                  "tribe", 
                  activeFilters.tribe === tribe ? null : tribe
                )
              }
            >
              {tribe}
            </Badge>
          ))}
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs px-2 h-7"
            onClick={onClearFilters}
          >
            {t("clearFilters")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
