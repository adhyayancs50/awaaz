
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useRecordings } from "@/contexts/RecordingContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Archive, Globe, Headphones, Languages, Mic, Upload, Users, Map } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { getStats } = useRecordings();
  const isMobile = useIsMobile();

  // Get real-time stats from recordings
  const stats = getStats();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gradient">
          {t("welcomeBack")}, {user?.name || t("guest")}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("fromForgottenToForever")}
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-12"
      >
        <h2 className="text-xl font-semibold mb-6 text-center md:text-left">
          {t("whatWouldYouLikeToDo")}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={item}>
            <Link to="/record" className="block h-full">
              <Card className="h-full bg-white dark:bg-neutral-dark border border-border hover:border-primary-200 dark:hover:border-primary-900 hover:shadow-card transition-all duration-300 overflow-hidden relative group hover:opacity-80 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-50/0 to-primary-50/70 dark:from-primary-900/0 dark:to-primary-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 flex items-center justify-center mb-2">
                    <Mic className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <CardTitle className="text-lg">{t("recordNewVoice")}</CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <CardDescription>
                    {t("captureLanguageDescription")}
                  </CardDescription>
                </CardContent>
                <CardFooter className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-end px-6">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("startRecording")} →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link to="/archive" className="block h-full">
              <Card className="h-full bg-white dark:bg-neutral-dark border border-border hover:border-primary-200 dark:hover:border-primary-900 hover:shadow-card transition-all duration-300 overflow-hidden relative group hover:opacity-80 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-50/0 to-primary-50/70 dark:from-primary-900/0 dark:to-primary-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 flex items-center justify-center mb-2">
                    <Archive className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <CardTitle className="text-lg">{t("browseArchive")}</CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <CardDescription>
                    {t("exploreRecordingsDescription")}
                  </CardDescription>
                </CardContent>
                <CardFooter className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-end px-6">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("exploreArchive")} →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link to="/translate" className="block h-full">
              <Card className="h-full bg-white dark:bg-neutral-dark border border-border hover:border-primary-200 dark:hover:border-primary-900 hover:shadow-card transition-all duration-300 overflow-hidden relative group hover:opacity-80 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-50/0 to-primary-50/70 dark:from-primary-900/0 dark:to-primary-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 flex items-center justify-center mb-2">
                    <Globe className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <CardTitle className="text-lg">{t("translateRecording")}</CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <CardDescription>
                    {t("helpTranslateDescription")}
                  </CardDescription>
                </CardContent>
                <CardFooter className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-end px-6">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("startTranslating")} →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link to="/upload" className="block h-full">
              <Card className="h-full bg-white dark:bg-neutral-dark border border-border hover:border-primary-200 dark:hover:border-primary-900 hover:shadow-card transition-all duration-300 overflow-hidden relative group hover:opacity-80 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-50/0 to-primary-50/70 dark:from-primary-900/0 dark:to-primary-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 flex items-center justify-center mb-2">
                    <Upload className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <CardTitle className="text-lg">{t("uploadRecording")}</CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <CardDescription>
                    {t("uploadExistingDescription")}
                  </CardDescription>
                </CardContent>
                <CardFooter className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-end px-6">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("uploadFiles")} →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <Card className="bg-white dark:bg-neutral-dark border-border overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent pointer-events-none" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              {t("communityImpact")}
            </CardTitle>
            <CardDescription>
              {t("communityStatsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-3 gap-6'} text-center`}>
              <div className="p-5 bg-neutral-surface dark:bg-neutral-dark/50 rounded-lg">
                <Languages className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {stats.languages}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("languagesArchived")}
                </p>
              </div>
              
              <div className="p-5 bg-neutral-surface dark:bg-neutral-dark/50 rounded-lg">
                <Headphones className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {stats.recordings}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("totalRecordings")}
                </p>
              </div>
              
              <div className={`p-5 bg-neutral-surface dark:bg-neutral-dark/50 rounded-lg ${isMobile ? 'col-span-2' : ''}`}>
                <Map className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {stats.regions}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("regionsCovered")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex justify-center"
      >
        <Link to="/about">
          <Button variant="outline" className="border-primary-200 dark:border-primary-900 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20">
            {t("learnAboutAWAaz")}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HomePage;
