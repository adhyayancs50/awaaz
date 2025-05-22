
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecordPage from "./pages/RecordPage";
import ArchivePage from "./pages/ArchivePage";
import SettingsPage from "./pages/SettingsPage";
import TranslationPage from "./pages/TranslationPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import SplashScreen from "./components/SplashScreen";
import { AuthProvider } from "./contexts/AuthContext";
import { RecordingProvider } from "./contexts/RecordingContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { RecorderProvider } from "./contexts/RecorderContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  const handleSplashFinished = () => {
    setShowSplash(false);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <AuthProvider>
          <SettingsProvider>
            <RecordingProvider>
              <RecorderProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  {showSplash ? (
                    <SplashScreen onFinished={handleSplashFinished} />
                  ) : (
                    <BrowserRouter>
                      <AnimatePresence mode="wait">
                        <Layout>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/record" element={<RecordPage />} />
                            <Route path="/archive" element={<ArchivePage />} />
                            <Route path="/translate" element={<TranslationPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Layout>
                      </AnimatePresence>
                    </BrowserRouter>
                  )}
                </TooltipProvider>
              </RecorderProvider>
            </RecordingProvider>
          </SettingsProvider>
        </AuthProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
};

export default App;
