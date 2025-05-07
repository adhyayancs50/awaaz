
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecordings } from "@/contexts/RecordingContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/EmptyState";
import { toast } from "@/components/ui/use-toast";

const SettingsPage: React.FC = () => {
  const { user, login } = useAuth();
  const { syncRecordings } = useRecordings();
  const { syncOptions, updateSyncOptions } = useSettings();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    tribe: user?.tribe || "",
    region: user?.region || "",
  });
  
  const handleSyncOptionsChange = (key: keyof typeof syncOptions, value: boolean) => {
    updateSyncOptions({ [key]: value });
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileUpdate = () => {
    setIsUpdating(true);
    
    // Mock API call
    setTimeout(() => {
      // This is where we would update the user profile in a real app
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved",
      });
      setIsUpdating(false);
    }, 1000);
  };
  
  if (!user?.isLoggedIn) {
    return (
      <EmptyState
        title="Sign in to access settings"
        description="Create an account or sign in to configure your preferences."
        icon="⚙️"
      />
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
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
                <Label htmlFor="tribe">Tribe/Community</Label>
                <Input
                  id="tribe"
                  name="tribe"
                  value={profileData.tribe}
                  onChange={handleProfileChange}
                  placeholder="Your tribe or community"
                />
              </div>
              
              <div>
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  name="region"
                  value={profileData.region}
                  onChange={handleProfileChange}
                  placeholder="Your geographic region"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleProfileUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sync Settings</CardTitle>
            <CardDescription>Configure how your recordings are synchronized</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="wifi-only">Sync only on Wi-Fi</Label>
                <p className="text-sm text-muted-foreground">Save mobile data by only syncing on Wi-Fi networks</p>
              </div>
              <Switch
                id="wifi-only"
                checked={syncOptions.syncOnWifiOnly}
                onCheckedChange={(checked) => handleSyncOptionsChange("syncOnWifiOnly", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sync">Auto Sync</Label>
                <p className="text-sm text-muted-foreground">Automatically sync recordings when online</p>
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
              Sync Now
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About AWAaz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              AWAaz is dedicated to preserving endangered tribal languages in India through voice recording, transcription, and translation. Your contributions help build a valuable archive of linguistic heritage.
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
