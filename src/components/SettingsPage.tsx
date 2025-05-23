import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SettingsPage: React.FC = () => {
  const { user, updateDisplayName, updatePassword, deleteAccount, isLoading } = useAuth();
  const { t, changeLanguage, currentLanguage } = useTranslation();
  
  const [displayName, setDisplayName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "currentPassword") {
      setCurrentPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };
  
  const handleUpdateDisplayName = async () => {
    if (displayName.trim() === "") return;
    await updateDisplayName(displayName);
  };
  
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    await updatePassword(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      await deleteAccount();
    }
  };
  
  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
  };
  
  return (
    <div className="container py-12">
      <Card className="w-full max-w-2xl mx-auto shadow-card">
        <CardHeader>
          <CardTitle>{t("settings")}</CardTitle>
          <CardDescription>{t("manageYourAccountSettings")}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("profileInformation")}</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="displayName" className="text-right font-medium">
                  {t("displayName")}
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={handleDisplayNameChange}
                  className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button onClick={handleUpdateDisplayName} disabled={isLoading}>
                {isLoading ? t("updating") : t("updateDisplayName")}
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("updatePassword")}</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="currentPassword" className="text-right font-medium">
                  {t("currentPassword")}
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={handlePasswordChange}
                  className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="newPassword" className="text-right font-medium">
                  {t("newPassword")}
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="confirmPassword" className="text-right font-medium">
                  {t("confirmPassword")}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handlePasswordChange}
                  className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button onClick={handleUpdatePassword} disabled={isLoading}>
                {isLoading ? t("updating") : t("updatePassword")}
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("languageSettings")}</h3>
            <div className="space-x-2">
              <Button variant={currentLanguage === 'en' ? 'default' : 'outline'} onClick={() => changeLanguage('en')}>
                English
              </Button>
              <Button variant={currentLanguage === 'hi' ? 'default' : 'outline'} onClick={() => changeLanguage('hi')}>
                Hindi
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("dangerZone")}</h3>
            <p className="text-sm text-muted-foreground">{t("deleteAccountWarning")}</p>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading}>
              {isLoading ? t("deleting") : t("deleteAccount")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
