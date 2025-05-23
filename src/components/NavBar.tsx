import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, LogOut, Menu, Settings, User } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, changeLanguage, currentLanguage } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
  };
  
  const handleSignInClick = () => {
    navigate("/settings", { state: { openAuthForm: true } });
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-dark border-b shadow-sm">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            className="w-9 h-9 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src="/lovable-uploads/72311bbf-01ec-4d7d-85b1-df143c27ae7f.png" 
              alt="AWAaz Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          <motion.span 
            className="text-xl font-semibold font-poppins text-primary-600 dark:text-primary-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            AWAaz
          </motion.span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLanguageChange(currentLanguage === "en" ? "hi" : "en")}
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:text-primary-200 dark:hover:bg-primary-900/20 transition-colors"
          >
            <Globe className="w-4 h-4 mr-1" />
            {currentLanguage === "en" ? "हिंदी" : "English"}
          </Button>
          
          {user?.isLoggedIn ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0">
                    <Avatar>
                      <AvatarImage src={user.photoURL} />
                      <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button 
              className="bg-primary hover:bg-primary-600 transition-colors"
              onClick={handleSignInClick}
            >
              {t("signIn")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
