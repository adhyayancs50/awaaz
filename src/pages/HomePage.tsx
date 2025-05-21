
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileAudio, Book, Languages, Upload, User, Settings, Info, HelpCircle } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRecordings } from "@/contexts/RecordingContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { recordings } = useRecordings();
  const navigate = useNavigate();
  
  // Get the recordings count for the current user
  const userRecordingsCount = recordings.filter(rec => rec.userId === user?.id).length;
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          {t("welcomeBack")}, {user?.name || t("user")}!
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("welcomeMessage")}
        </p>
      </motion.section>

      {/* Main Action Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        {/* Record Card */}
        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-lg transition-shadow border-primary/10 hover:border-primary/30">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileAudio /> {t("startRecording")}
              </CardTitle>
              <CardDescription>{t("recordDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate("/")}
                >
                  {t("singleSentence")}
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate("/")}
                >
                  {t("conversation")}
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate("/")}
                >
                  {t("song")}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-primary hover:bg-primary-dark"
                onClick={() => navigate("/")}
              >
                <FileAudio className="mr-2" /> {t("record")}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Browse Archive Card */}
        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-lg transition-shadow border-secondary/10 hover:border-secondary/30">
            <CardHeader className="bg-secondary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Book /> {t("browseArchive")}
              </CardTitle>
              <CardDescription>{t("archiveDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">{t("totalLanguagesRecorded")}: <span className="font-semibold">{recordings.length}</span></p>
              <p>{t("yourContributions")}: <span className="font-semibold">{userRecordingsCount}</span></p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => navigate("/archive")}
              >
                <Book className="mr-2" /> {t("archive")}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Translate Card */}
        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-lg transition-shadow border-accent/10 hover:border-accent/30">
            <CardHeader className="bg-accent/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-accent-foreground">
                <Languages /> {t("translateRecordings")}
              </CardTitle>
              <CardDescription>{t("translateDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-2">{t("helpPreserve")}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => navigate("/translate")}
              >
                <Languages className="mr-2" /> {t("translate")}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Upload Card */}
        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-lg transition-shadow border-muted hover:border-muted/50">
            <CardHeader className="bg-muted/20 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Upload /> {t("uploadManually")}
              </CardTitle>
              <CardDescription>{t("uploadDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">{t("uploadInstructions")}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/")}
              >
                <Upload className="mr-2" /> {t("upload")}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Links */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8"
      >
        <h3 className="text-xl font-semibold mb-4">{t("quickAccess")}</h3>
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-4 h-4" /> {t("settings")}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => navigate("/settings")}
          >
            <User className="w-4 h-4" /> {t("profile")}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => navigate("/about")}
          >
            <Info className="w-4 h-4" /> {t("aboutAWAaz")}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" /> {t("help")}
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
