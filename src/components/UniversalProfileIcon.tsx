import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { useProfile } from '@/context/ProfileContext';
import { Skeleton } from "@/components/ui/skeleton";

interface UniversalProfileIconProps {
  address?: string;
  name?: string;
  image?: string;
  hasUnread?: boolean;
  showHoverCard?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const UniversalProfileIcon: React.FC<UniversalProfileIconProps> = ({
  address,
  name,
  image,
  hasUnread = false,
  showHoverCard = true,
  size = 'md'
}) => {
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<{
    name: string;
    image: string;
    address: string;
  } | null>(null);

  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!address && !profile.address) return;
      
      setIsLoading(true);
      try {
        // If no props passed, use the connected profile
        const targetAddress = address || profile.address;
        const targetName = name || profile.name;
        const targetImage = image || profile.image;

        setProfileData({
          name: targetName,
          image: targetImage,
          address: targetAddress
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address, name, image, profile]);

  if (isLoading) {
    return <Skeleton className={`rounded-full ${sizeClasses[size]}`} />;
  }

  const displayName = profileData?.name || name || 'Unknown';
  const displayImage = profileData?.image || image || 'https://eth-blockies.vercel.app/api/default?size=200';
  const displayAddress = profileData?.address || address || '0x000...0000';
  
  const shortAddress = `${displayAddress.substring(0, 6)}...${displayAddress.substring(displayAddress.length - 4)}`;
  
  const avatarContent = (
    <Avatar className={`${sizeClasses[size]} ${hasUnread ? 'animate-glow-pulse border-2 border-lukso-primary' : ''}`}>
      <AvatarImage src={displayImage} alt={displayName} />
      <AvatarFallback className="bg-lukso-dark text-lukso-light">
        {displayName.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
  
  if (!showHoverCard) {
    return avatarContent;
  }
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {avatarContent}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 glass-card">
        <div className="flex justify-between space-x-4">
          <Avatar className={sizeClasses[size]}>
            <AvatarImage src={displayImage} />
            <AvatarFallback className="bg-lukso-dark text-lukso-light">
              {displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{displayName}</h4>
            <p className="text-xs text-muted-foreground">{shortAddress}</p>
            <div className="flex items-center pt-2">
              <Badge variant="outline" className="bg-lukso-primary/10 text-lukso-primary text-xs">
                LSP3 Profile
              </Badge>
              {profile.isConnected && displayAddress === profile.address && (
                <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 text-xs">
                  Connected
                </Badge>
              )}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UniversalProfileIcon;
// import React from 'react';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
// import { Badge } from "@/components/ui/badge";

// interface UniversalProfileIconProps {
//   address: string;
//   name: string;
//   image?: string;
//   hasUnread?: boolean;
//   showHoverCard?: boolean;
// }

// const UniversalProfileIcon: React.FC<UniversalProfileIconProps> = ({
//   address,
//   name,
//   image,
//   hasUnread = false,
//   showHoverCard = true
// }) => {
//   const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  
//   const avatarContent = (
//     <Avatar className={`h-12 w-12 ${hasUnread ? 'animate-glow-pulse border-2 border-lukso-primary' : ''}`}>
//       <AvatarImage src={image} alt={name} />
//       <AvatarFallback className="bg-lukso-dark text-lukso-light">
//         {name.substring(0, 2).toUpperCase()}
//       </AvatarFallback>
//     </Avatar>
//   );
  
//   if (!showHoverCard) {
//     return avatarContent;
//   }
  
//   return (
//     <HoverCard>
//       <HoverCardTrigger asChild>
//         {avatarContent}
//       </HoverCardTrigger>
//       <HoverCardContent className="w-80 glass-card">
//         <div className="flex justify-between space-x-4">
//           <Avatar>
//             <AvatarImage src={image} />
//             <AvatarFallback className="bg-lukso-dark text-lukso-light">
//               {name.substring(0, 2).toUpperCase()}
//             </AvatarFallback>
//           </Avatar>
//           <div className="space-y-1">
//             <h4 className="text-sm font-semibold">{name}</h4>
//             <p className="text-xs text-muted-foreground">{shortAddress}</p>
//             <div className="flex items-center pt-2">
//               <Badge variant="outline" className="bg-lukso-primary/10 text-lukso-primary text-xs">
//                 LSP3 Profile
//               </Badge>
//               <Badge variant="outline" className="ml-2 bg-lukso-secondary/10 text-lukso-light text-xs">
//                 Credibility: 94%
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </HoverCardContent>
//     </HoverCard>
//   );
// };

// export default UniversalProfileIcon;
