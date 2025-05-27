
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
import { Bell, Lock, LogOut, User, Languages } from "lucide-react";

const SettingsPage = () => {
  const { user, updateDisplayName, deleteAccount, logout, isLoading, updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, currentLanguage, changeLanguage } = useTranslation();
  
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  
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

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      updatePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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

  const handleLogout = () => {
    logout();
    navigate("/");
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
    <div className="max-w-xl mx-auto">
      <motion.h1 
        className="text-3xl font-bold mb-8 text-center text-green-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {t("settings")}
      </motion.h1>
      
      {/* Profile Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            {t("profile")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
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

      {/* Language Preference Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary-600" />
            {t("languagePreference")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Label htmlFor="language">{t("selectLanguage")}</Label>
            <Select
              value={currentLanguage}
              onValueChange={(value) => changeLanguage(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary-600" />
            {t("changePassword")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border-green-200 focus:border-green-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("newPassword")}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-green-200 focus:border-green-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-green-200 focus:border-green-400"
              />
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
              >
                {t("updatePassword")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-600" />
            {t("notifications")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">{t("receiveEmailNotifications")}</Label>
            <Switch
              id="notifications"
              checked={receiveNotifications}
              onCheckedChange={setReceiveNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <div className="mb-6">
        <Button 
          onClick={handleLogout}
          className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("logout")}
        </Button>
      </div>
      
      {/* Danger Zone */}
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
