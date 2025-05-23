
import { useState, useEffect } from "react";
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
import UploadPage from "./pages/UploadPage";
import LanguageMapPage from "./pages/LanguageMapPage";
import VerifyPage from "./pages/VerifyPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import SplashScreen from "./components/SplashScreen";
import { AuthProvider } from "./contexts/AuthContext";
import { RecordingProvider } from "./contexts/RecordingContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { RecorderProvider } from "./contexts/RecorderContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import { AnimatePresence } from "framer-motion";
import "./App.css";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  // Apply global font styling
  useEffect(() => {
    // Clean up any leftover classes from old design
    document.body.classList.remove('font-poppins');
    // Add new default font to the document
    document.body.classList.add('font-inter');
  }, []);
  
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
                            <Route path="/upload" element={<UploadPage />} />
                            <Route path="/language-map" element={<LanguageMapPage />} />
                            <Route path="/verify" element={<VerifyPage />} />
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
