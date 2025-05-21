
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-3xl text-green-700 font-bold text-center">
              {t("aboutAWAaz")}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6 px-6 md:px-8 space-y-6 text-lg">
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
              platform designed to function even in remote areas with low connectivity. Whether 
              you're a language preserver, a curious learner, or a cultural volunteer — your voice matters here.
            </p>
            
            <p>
              We believe that every language holds a unique worldview, and that by preserving words, 
              we preserve wisdom. Awaaz is not just an app — it's a living archive, a tribute to oral heritage, 
              and a growing community united by sound, culture, and memory.
            </p>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-xl font-bold text-green-800 mb-3">Our Mission</h3>
              <p className="text-green-900">
                To document, preserve, and celebrate the endangered tribal languages of India by building 
                a collaborative and accessible digital archive.
              </p>
            </div>
            
            <div className="bg-stone-50 p-6 rounded-lg border border-stone-100">
              <h3 className="text-xl font-bold text-stone-800 mb-3">Join Us</h3>
              <p className="text-stone-900">
                Whether you're a speaker, a translator, or simply passionate about saving our shared cultural 
                heritage — Awaaz is your platform to contribute. Together, let's ensure that no language, 
                no story, and no song is ever forgotten.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AboutPage;
