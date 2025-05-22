
import React from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-green-600 mb-4">{t("aboutUs")}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-8 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">{t("ourStory")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Awaaz is a grassroots-driven digital initiative committed to preserving the endangered 
              languages and oral traditions of India's indigenous communities — one voice at a time.
            </p>
            <p>
              Born out of a deep respect for our cultural roots, Awaaz empowers tribal elders, 
              storytellers, and native speakers to record, archive, and share their languages, 
              stories, and songs — in their own voices. These recordings are then opened to a 
              network of bilingual volunteers who help translate them into Hindi and English, 
              making them accessible to future generations and researchers around the world.
            </p>
            <p>
              Built with accessibility and inclusion at its heart, Awaaz is a free, mobile-friendly 
              platform designed to function even in remote areas with low connectivity. Whether you're 
              a language preserver, a curious learner, or a cultural volunteer — your voice matters here.
            </p>
            <p>
              We believe that every language holds a unique worldview, and that by preserving words, 
              we preserve wisdom. Awaaz is not just an app — it's a living archive, a tribute to oral 
              heritage, and a growing community united by sound, culture, and memory.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">{t("ourMission")}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              To document, preserve, and celebrate the endangered tribal languages of India by 
              building a collaborative and accessible digital archive.
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">{t("joinUs")}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Whether you're a speaker, a translator, or simply passionate about saving our 
              shared cultural heritage — Awaaz is your platform to contribute. Together, let's 
              ensure that no language, no story, and no song is ever forgotten.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AboutPage;
