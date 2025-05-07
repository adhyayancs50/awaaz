
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RecordPage from "./pages/RecordPage";
import ArchivePage from "./pages/ArchivePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import SplashScreen from "./components/SplashScreen";
import { AuthProvider } from "./contexts/AuthContext";
import { RecordingProvider } from "./contexts/RecordingContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { RecorderProvider } from "./contexts/RecorderContext";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  const handleSplashFinished = () => {
    setShowSplash(false);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
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
                    <Layout>
                      <Routes>
                        <Route path="/" element={<RecordPage />} />
                        <Route path="/archive" element={<ArchivePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </BrowserRouter>
                )}
              </TooltipProvider>
            </RecorderProvider>
          </RecordingProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
