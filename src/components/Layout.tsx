
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NavBar } from "@/components/NavBar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileAudio, Book, Settings, Languages, Upload, Map } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-light bg-tribal-pattern-light dark:bg-tribal-pattern-dark">
      <NavBar />
      
      {user?.isLoggedIn && (
        <div className="container mx-auto px-4 py-4 flex justify-center overflow-x-auto">
          <Tabs 
            defaultValue={location.pathname} 
            className="w-full max-w-xl"
            onValueChange={(value) => navigate(value)}
          >
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-4 gap-1' : 'grid-cols-7'} p-1 bg-green-100 rounded-lg`}>
              <TabsTrigger value="/" className="data-[state=active]:bg-white data-[state=active]:text-green-700 flex gap-1 items-center">
                <Home className="w-4 h-4" />
                {!isMobile && <span>{t("home")}</span>}
              </TabsTrigger>
              <TabsTrigger value="/record" className="data-[state=active]:bg-white data-[state=active]:text-green-700 flex gap-1 items-center">
                <FileAudio className="w-4 h-4" />
                {!isMobile && <span>{t("record")}</span>}
              </TabsTrigger>
              <TabsTrigger value="/archive" className="data-[state=active]:bg-white data-[state=active]:text-green-700 flex gap-1 items-center">
                <Book className="w-4 h-4" />
                {!isMobile && <span>{t("archive")}</span>}
              </TabsTrigger>
              <TabsTrigger value="/translate" className="data-[state=active]:bg-white data-[state=active]:text-green-700 flex gap-1 items-center">
                <Languages className="w-4 h-4" />
                {!isMobile && <span>{t("translate")}</span>}
              </TabsTrigger>
              {isMobile ? (
                <TabsTrigger value="#more" className="data-[state=active]:bg-white data-[state=active]:text-green-700 flex gap-1 items-center" onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4" />
                </TabsTrigger>
              ) : (
                <>
                  <TabsTrigger value="/upload" className="data-[state=active]:bg-white data-[state=active]:text-green-700 flex gap-1 items-center">
                    <Upload className="w-4 h-4" />
                    <span>{t("upload")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="/language-map" className="data-[state=active]:bg-white data-[state=active]:text-green-700 flex gap-1 items-center">
                    <Map className="w-4 h-4" />
                    <span>{t("map")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="/settings" className="data-[state=active]:bg-white data-[state=active]:text-green-700 flex gap-1 items-center">
                    <Settings className="w-4 h-4" />
                    <span>{t("settings")}</span>
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </Tabs>
        </div>
      )}
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="py-6 bg-green-50 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-green-700 font-medium">AWAaz - From Forgotten To Forever</p>
          <p className="text-xs text-muted-foreground mt-1">Preserving Cultural Heritage Through Voice</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
