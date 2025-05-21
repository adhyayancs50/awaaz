
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecordings } from "@/contexts/RecordingContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import EmptyState from "@/components/EmptyState";
import { toast } from "@/components/ui/use-toast";

const SettingsPage: React.FC = () => {
  const { user, logout, updateDisplayName, deleteAccount } = useAuth();
  const { syncRecordings } = useRecordings();
  const { syncOptions, updateSyncOptions } = useSettings();
  const { t, currentLanguage, setLanguage } = useTranslation();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || "");
  
  const handleSyncOptionsChange = (key: keyof typeof syncOptions, value: boolean) => {
    updateSyncOptions({ [key]: value });
  };
  
  const handleDisplayNameUpdate = () => {
    if (!displayName.trim()) {
      toast({
        title: t("error"),
        description: t("displayNameRequired"),
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      updateDisplayName(displayName);
      toast({
        title: t("success"),
        description: t("displayNameUpdated"),
      });
    } catch (error) {
      console.error("Failed to update display name:", error);
      toast({
        title: t("error"),
        description: t("updateFailed"),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      // Navigation happens automatically due to auth state change
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };
  
  if (!user?.isLoggedIn) {
    return (
      <EmptyState
        title={t("signInToAccessSettings")}
        description={t("createAccountOrSignIn")}
        icon="⚙️"
      />
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("settings")}</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("profile")}</CardTitle>
            <CardDescription>{t("manageYourInfo")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.photoURL} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-medium text-lg">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <Label htmlFor="displayName">{t("displayName")}</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t("yourName")}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleDisplayNameUpdate} disabled={isUpdating}>
              {isUpdating ? t("updating") : t("updateProfile")}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">{t("deleteAccount")}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("deleteAccountWarning")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>
                    {t("deleteAccount")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("language")}</CardTitle>
            <CardDescription>{t("chooseYourLanguage")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="language-switch">{t("useHindi")}</Label>
              <Switch
                id="language-switch"
                checked={currentLanguage === "hi"}
                onCheckedChange={(checked) => setLanguage(checked ? "hi" : "en")}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("syncSettings")}</CardTitle>
            <CardDescription>{t("configureSync")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="wifi-only">{t("syncOnWifiOnly")}</Label>
                <p className="text-sm text-muted-foreground">{t("saveMobileData")}</p>
              </div>
              <Switch
                id="wifi-only"
                checked={syncOptions.syncOnWifiOnly}
                onCheckedChange={(checked) => handleSyncOptionsChange("syncOnWifiOnly", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sync">{t("autoSync")}</Label>
                <p className="text-sm text-muted-foreground">{t("autoSyncDescription")}</p>
              </div>
              <Switch
                id="auto-sync"
                checked={syncOptions.autoSync}
                onCheckedChange={(checked) => handleSyncOptionsChange("autoSync", checked)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => syncRecordings()}>
              {t("syncNow")}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("aboutAWAaz")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t("aboutAWAazDescription")}
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Version 1.0.0</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
