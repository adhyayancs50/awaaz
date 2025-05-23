import React, { useEffect, useState, useMemo } from "react";
import { useRecordings } from "@/contexts/RecordingContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, MicVocal, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import MapComponent from "@/components/MapComponent";

const LanguageMapPage: React.FC = () => {
  const { recordings } = useRecordings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Extract unique languages with their counts and regions
  const languageData = useMemo(() => {
    const languageMap = new Map();
    
    recordings.forEach(recording => {
      if (recording.language) {
        const language = recording.language.trim();
        if (!languageMap.has(language)) {
          languageMap.set(language, {
            name: language,
            count: 1,
            region: recording.region || "Unknown",
            recordings: [recording.id]
          });
        } else {
          const data = languageMap.get(language);
          data.count += 1;
          data.recordings.push(recording.id);
          // Update region if it was previously unknown
          if (data.region === "Unknown" && recording.region) {
            data.region = recording.region;
          }
        }
      }
    });
    
    return Array.from(languageMap.values());
  }, [recordings]);
  
  return (
    <div className="container mx-auto px-4">
      <motion.h1 
        className="text-3xl font-bold mb-6 text-center text-green-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {t("languageMap")}
      </motion.h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-green-700">{t("exploreLanguageOrigins")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[60vh] w-full">
            <MapComponent languages={languageData} />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {languageData.map((lang) => (
          <Card key={lang.name} className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-green-600" />
                {lang.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <MicVocal className="mr-2 h-4 w-4 text-green-500" />
                  <span>{t("recordings")}: {lang.count}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-green-500" />
                  <span>{t("region")}: {lang.region}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-4 border-green-200 hover:bg-green-50 py-2"
                  onClick={() => navigate('/archive', { state: { filterLanguage: lang.name } })}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>{t("viewRecordings")}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LanguageMapPage;
