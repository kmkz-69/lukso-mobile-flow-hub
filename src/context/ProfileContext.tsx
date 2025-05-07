
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface Profile {
  address: string;
  name: string;
  image: string;
  isConnected: boolean;
}

interface ProfileContextType {
  profile: Profile;
  connectProfile: () => Promise<void>;
  disconnectProfile: () => void;
  checkConnection: () => boolean;
  isLoading: boolean;
}

const defaultProfile = {
  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  name: "Your Profile",
  image: "https://i.pravatar.cc/150?img=5",
  isConnected: false,
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  connectProfile: async () => {},
  disconnectProfile: () => {},
  checkConnection: () => false,
  isLoading: false,
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simulated LUKSO blockchain connection
  const connectProfile = async (): Promise<void> => {
    setIsLoading(true);
    
    // In a real implementation, this would connect to LUKSO UP
    // For demo purposes, we'll simulate a connection
    return new Promise((resolve) => {
      setTimeout(() => {
        setProfile({
          ...profile,
          isConnected: true,
        });
        toast({
          title: "Success",
          description: "Connected to LUKSO Universal Profile",
        });
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  const disconnectProfile = () => {
    setProfile({
      ...profile,
      isConnected: false,
    });
    toast({
      title: "Disconnected",
      description: "Disconnected from LUKSO Universal Profile",
      variant: "destructive",
    });
  };

  const checkConnection = () => {
    return profile.isConnected;
  };

  return (
    <ProfileContext.Provider value={{ profile, connectProfile, disconnectProfile, checkConnection, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
