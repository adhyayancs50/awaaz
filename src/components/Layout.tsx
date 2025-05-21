
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NavBar } from "@/components/NavBar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { FileAudio, Book, Settings, Translate } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-light bg-tribal-pattern-light dark:bg-tribal-pattern-dark">
      <NavBar />
      
      {user?.isLoggedIn && (
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <Tabs 
            defaultValue={location.pathname} 
            className="w-full max-w-md"
            onValueChange={(value) => navigate(value)}
          >
            <TabsList className="grid w-full grid-cols-4 p-1 bg-neutral-sand rounded-lg">
              <TabsTrigger value="/" className="data-[state=active]:bg-white flex gap-2 items-center">
                <FileAudio className="w-4 h-4" />
                <span>{t("record")}</span>
              </TabsTrigger>
              <TabsTrigger value="/archive" className="data-[state=active]:bg-white flex gap-2 items-center">
                <Book className="w-4 h-4" />
                <span>{t("archive")}</span>
              </TabsTrigger>
              <TabsTrigger value="/translate" className="data-[state=active]:bg-white flex gap-2 items-center">
                <Translate className="w-4 h-4" />
                <span>{t("translate")}</span>
              </TabsTrigger>
              <TabsTrigger value="/settings" className="data-[state=active]:bg-white flex gap-2 items-center">
                <Settings className="w-4 h-4" />
                <span>{t("settings")}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="py-6 bg-neutral-sand/40 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-secondary font-medium">AWAaz - From Forgotten To Forever</p>
          <p className="text-xs text-muted-foreground mt-1">Preserving Cultural Heritage Through Voice</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
