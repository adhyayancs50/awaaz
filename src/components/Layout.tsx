
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NavBar } from "@/components/NavBar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  FileAudio, 
  Book, 
  Settings, 
  Languages, 
  Upload, 
  Map,
  Mic,
  Archive,
  GlobeIcon
} from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-neutral-light pattern-light dark:bg-neutral-dark dark:pattern-dark">
      <NavBar />
      
      {user?.isLoggedIn && (
        <div className="container mx-auto px-4 py-4 flex justify-center overflow-x-auto">
          <Tabs 
            defaultValue={location.pathname} 
            className="w-full max-w-3xl"
            onValueChange={(value) => navigate(value)}
          >
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-4 gap-1' : 'grid-cols-7 gap-2'} p-1 bg-neutral-surface dark:bg-neutral-dark/50 rounded-lg shadow-soft`}>
              <TabsTrigger 
                value="/" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-sidebar data-[state=active]:shadow-soft data-[state=active]:text-primary dark:data-[state=active]:text-primary-300 flex gap-1.5 items-center"
              >
                <Home className="w-4 h-4" />
                {!isMobile && <span>{t("home")}</span>}
              </TabsTrigger>
              
              <TabsTrigger 
                value="/record" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-sidebar data-[state=active]:shadow-soft data-[state=active]:text-primary dark:data-[state=active]:text-primary-300 flex gap-1.5 items-center"
              >
                <Mic className="w-4 h-4" />
                {!isMobile && <span>{t("record")}</span>}
              </TabsTrigger>
              
              <TabsTrigger 
                value="/archive" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-sidebar data-[state=active]:shadow-soft data-[state=active]:text-primary dark:data-[state=active]:text-primary-300 flex gap-1.5 items-center"
              >
                <Archive className="w-4 h-4" />
                {!isMobile && <span>{t("archive")}</span>}
              </TabsTrigger>
              
              <TabsTrigger 
                value="/translate" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-sidebar data-[state=active]:shadow-soft data-[state=active]:text-primary dark:data-[state=active]:text-primary-300 flex gap-1.5 items-center"
              >
                <GlobeIcon className="w-4 h-4" />
                {!isMobile && <span>{t("translate")}</span>}
              </TabsTrigger>
              
              {isMobile ? (
                <TabsTrigger 
                  value="#more" 
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-sidebar data-[state=active]:shadow-soft data-[state=active]:text-primary dark:data-[state=active]:text-primary-300 flex gap-1.5 items-center" 
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="w-4 h-4" />
                </TabsTrigger>
              ) : (
                <>
                  <TabsTrigger 
                    value="/upload" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-sidebar data-[state=active]:shadow-soft data-[state=active]:text-primary dark:data-[state=active]:text-primary-300 flex gap-1.5 items-center"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t("upload")}</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="/language-map" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-sidebar data-[state=active]:shadow-soft data-[state=active]:text-primary dark:data-[state=active]:text-primary-300 flex gap-1.5 items-center"
                  >
                    <Map className="w-4 h-4" />
                    <span>{t("map")}</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="/settings" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-sidebar data-[state=active]:shadow-soft data-[state=active]:text-primary dark:data-[state=active]:text-primary-300 flex gap-1.5 items-center"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{t("settings")}</span>
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </Tabs>
        </div>
      )}
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="py-8 bg-white dark:bg-neutral-dark border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-medium text-primary-600 dark:text-primary-400">AWAaz - From Forgotten To Forever</p>
              <p className="text-sm text-muted-foreground mt-1">Preserving Cultural Heritage Through Voice</p>
            </div>
            
            <div className="flex items-center gap-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary-600 transition-colors">
                {t("aboutAWAaz")}
              </Link>
              <Link to="/settings" className="text-sm text-muted-foreground hover:text-primary-600 transition-colors">
                {t("settings")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
