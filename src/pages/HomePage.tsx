
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, FileAudio, Book, Languages, Upload } from "lucide-react";
import { motion } from "framer-motion";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const stats = {
    languages: 24,
    recordings: 450,
    contributors: 67,
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          {t("welcomeBack")}, {user?.name || t("guest")}!
        </h1>
        <p className="text-muted-foreground">
          {t("preserveLanguagesSubtitle")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div 
          custom={0} 
          initial="hidden" 
          animate="visible" 
          variants={cardVariants}
        >
          <Link to="/">
            <Card className="h-full hover:bg-green-50 hover:shadow-md transition-all cursor-pointer border-green-200">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <FileAudio className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-medium text-green-700 mb-2">{t("startRecording")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("captureVoiceDescription")}
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div 
          custom={1} 
          initial="hidden" 
          animate="visible" 
          variants={cardVariants}
        >
          <Link to="/archive">
            <Card className="h-full hover:bg-green-50 hover:shadow-md transition-all cursor-pointer border-green-200">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Book className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-medium text-green-700 mb-2">{t("browseArchive")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("exploreRecordingsDescription")}
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div 
          custom={2} 
          initial="hidden" 
          animate="visible" 
          variants={cardVariants}
        >
          <Link to="/translate">
            <Card className="h-full hover:bg-green-50 hover:shadow-md transition-all cursor-pointer border-green-200">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Languages className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-medium text-green-700 mb-2">{t("translateRecording")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("helpTranslateDescription")}
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div 
          custom={3} 
          initial="hidden" 
          animate="visible" 
          variants={cardVariants}
        >
          <Link to="/upload">
            <Card className="h-full hover:bg-green-50 hover:shadow-md transition-all cursor-pointer border-green-200">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Upload className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-medium text-green-700 mb-2">{t("uploadRecording")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("uploadExistingDescription")}
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-8"
      >
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-neutral-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium text-green-700 mb-4 text-center">
              {t("communityStats")}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <p className="text-3xl font-bold text-green-600">{stats.languages}</p>
                <p className="text-sm text-muted-foreground">{t("languagesArchived")}</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-green-600">{stats.recordings}</p>
                <p className="text-sm text-muted-foreground">{t("totalRecordings")}</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-green-600">{stats.contributors}</p>
                <p className="text-sm text-muted-foreground">{t("activeContributors")}</p>
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
          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
            {t("learnAboutAWAaz")}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HomePage;
