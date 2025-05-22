
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

const SettingsPage = () => {
  const { user, updateDisplayName, deleteAccount, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const [displayName, setDisplayName] = useState("");
  
  // Check if we need to open the auth form directly
  const openAuthForm = location.state?.openAuthForm;
  
  useEffect(() => {
    if (user?.name) {
      setDisplayName(user.name);
    }
  }, [user]);
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      updateDisplayName(displayName.trim());
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  
  if (!user?.isLoggedIn || openAuthForm) {
    return (
      <div className="max-w-md mx-auto">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("settings")}
        </motion.h1>
        <AuthForm />
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <motion.h1 
        className="text-3xl font-bold mb-8 text-center text-green-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {t("settings")}
      </motion.h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t("displayName")}</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-green-200 focus:border-green-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-gray-50 border-green-100"
              />
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading || !displayName.trim() || displayName === user.name}
              >
                {t("updateProfile")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="border-red-100">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4 text-red-600">{t("dangerZone")}</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full"
              >
                {t("deleteAccount")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("confirmDeletion")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteAccountWarning")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>{t("delete")}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
