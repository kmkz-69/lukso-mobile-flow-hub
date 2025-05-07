import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useUpProvider } from "./upProvider";
import { ERC725 } from '@erc725/erc725.js';
import erc725schema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';

interface Profile {
  address: string;
  name: string;
  image: string;
  backgroundImage: string;
  isConnected: boolean;
}

interface ProfileContextType {
  profile: Profile;
  connectProfile: () => Promise<void>;
  disconnectProfile: () => void;
  checkConnection: () => boolean;
  isLoading: boolean;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

const defaultProfile = {
  address: "",
  name: "Your Profile",
  image: "https://tools-web-components.pages.dev/images/sample-avatar.jpg",
  backgroundImage: "https://tools-web-components.pages.dev/images/sample-background.jpg",
  isConnected: false,
};

const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs/';
const RPC_ENDPOINT_TESTNET = 'https://rpc.testnet.lukso.network';
const RPC_ENDPOINT_MAINNET = 'https://rpc.mainnet.lukso.network';

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  connectProfile: async () => {},
  disconnectProfile: () => {},
  checkConnection: () => false,
  isLoading: false,
  isSearching: false,
  setIsSearching: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { provider, accounts, contextAccounts, chainId, walletConnected } = useUpProvider();

  useEffect(() => {
    if (walletConnected && accounts.length > 0) {
      handleProfileConnection(accounts[0]);
    }
  }, [walletConnected, accounts]);

  const fetchProfileData = async (address: string) => {
    try {
      const config = { ipfsGateway: IPFS_GATEWAY };
      const rpcEndpoint = chainId === 42 ? RPC_ENDPOINT_MAINNET : RPC_ENDPOINT_TESTNET;
      const profileInstance = new ERC725(erc725schema, address, rpcEndpoint, config);
      const fetchedData = await profileInstance.fetchData('LSP3Profile');

      if (fetchedData?.value && typeof fetchedData.value === 'object' && 'LSP3Profile' in fetchedData.value) {
        const profileImagesIPFS = fetchedData.value.LSP3Profile.profileImage;
        const fullName = fetchedData.value.LSP3Profile.name;
        const profileBackground = fetchedData.value.LSP3Profile.backgroundImage;

        return {
          fullName: fullName || '',
          imgUrl: profileImagesIPFS?.[0]?.url
            ? profileImagesIPFS[0].url.replace('ipfs://', IPFS_GATEWAY)
            : defaultProfile.image,
          background: profileBackground?.[0]?.url
            ? profileBackground[0].url.replace('ipfs://', IPFS_GATEWAY)
            : defaultProfile.backgroundImage,
        };
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
    return {
      fullName: '',
      imgUrl: defaultProfile.image,
      background: defaultProfile.backgroundImage,
    };
  };

  const handleProfileConnection = async (address: string) => {
    setIsLoading(true);
    try {
      const profileData = await fetchProfileData(address);
      
      setProfile({
        address,
        name: profileData.fullName,
        image: profileData.imgUrl,
        backgroundImage: profileData.background,
        isConnected: true,
      });

      toast({
        title: "Success",
        description: "Connected to LUKSO Universal Profile",
      });
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to Universal Profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectProfile = async (): Promise<void> => {
    if (!provider) {
      toast({
        title: "Error",
        description: "Wallet provider not available",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        await handleProfileConnection(accounts[0]);
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Error",
        description: "User rejected the connection request",
        variant: "destructive",
      });
    }
  };

  const disconnectProfile = () => {
    setProfile(defaultProfile);
    toast({
      title: "Disconnected",
      description: "Disconnected from LUKSO Universal Profile",
      variant: "destructive",
    });
  };

  const checkConnection = () => {
    return walletConnected && profile.isConnected;
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      connectProfile, 
      disconnectProfile, 
      checkConnection, 
      isLoading,
      isSearching,
      setIsSearching
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);