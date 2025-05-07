
import React, { createContext, useContext, useState, ReactNode } from "react";

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
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  const connectProfile = async (): Promise<void> => {
    // In a real implementation, this would connect to LUKSO UP
    // For demo purposes, we'll simulate a connection
    return new Promise((resolve) => {
      setTimeout(() => {
        setProfile({
          ...profile,
          isConnected: true,
        });
        resolve();
      }, 1000);
    });
  };

  const disconnectProfile = () => {
    setProfile({
      ...profile,
      isConnected: false,
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, connectProfile, disconnectProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
