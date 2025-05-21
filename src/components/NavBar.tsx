
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Menu, Language } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, currentLanguage, setLanguage } = useTranslation();
  
  const handleLanguageToggle = () => {
    setLanguage(currentLanguage === "en" ? "hi" : "en");
  };
  
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            className="w-9 h-9 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src="/lovable-uploads/72311bbf-01ec-4d7d-85b1-df143c27ae7f.png" 
              alt="AWAaz Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          <motion.span 
            className="text-xl font-bold font-poppins text-green-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            AWAaz
          </motion.span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLanguageToggle}
            className="text-green-700 hover:text-green-800 hover:bg-green-50"
          >
            {currentLanguage === "en" ? "हिंदी" : "English"}
          </Button>
          
          {user?.isLoggedIn ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={user.photoURL} />
                      <AvatarFallback className="bg-green-100 text-green-700">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/">{t("record")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/archive">{t("archive")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/translate">{t("translate")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">{t("settings")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/settings">
              <Button className="bg-green-600 hover:bg-green-700 transition-colors">
                {t("signIn")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
