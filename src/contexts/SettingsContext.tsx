
import React, { createContext, useContext, useState, useEffect } from "react";
import { SyncOptions } from "@/types";

interface SettingsContextType {
  syncOptions: SyncOptions;
  updateSyncOptions: (options: Partial<SyncOptions>) => void;
}

const defaultSyncOptions: SyncOptions = {
  syncOnWifiOnly: true,
  autoSync: true
};

const SettingsContext = createContext<SettingsContextType>({
  syncOptions: defaultSyncOptions,
  updateSyncOptions: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syncOptions, setSyncOptions] = useState<SyncOptions>(defaultSyncOptions);

  // Load settings from local storage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem("awaaz_settings");
        if (storedSettings) {
          setSyncOptions(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("awaaz_settings", JSON.stringify(syncOptions));
  }, [syncOptions]);

  const updateSyncOptions = (options: Partial<SyncOptions>) => {
    setSyncOptions(prev => ({ ...prev, ...options }));
  };

  return (
    <SettingsContext.Provider value={{ syncOptions, updateSyncOptions }}>
      {children}
    </SettingsContext.Provider>
  );
};
