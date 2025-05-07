
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface UniversalProfileIconProps {
  address: string;
  name: string;
  image?: string;
  hasUnread?: boolean;
  showHoverCard?: boolean;
}

const UniversalProfileIcon: React.FC<UniversalProfileIconProps> = ({
  address,
  name,
  image,
  hasUnread = false,
  showHoverCard = true
}) => {
  const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  
  const avatarContent = (
    <Avatar className={`h-12 w-12 ${hasUnread ? 'animate-glow-pulse border-2 border-lukso-primary' : ''}`}>
      <AvatarImage src={image} alt={name} />
      <AvatarFallback className="bg-lukso-dark text-lukso-light">
        {name.substring(0, 2).toUpperCase()}
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
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback className="bg-lukso-dark text-lukso-light">
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{name}</h4>
            <p className="text-xs text-muted-foreground">{shortAddress}</p>
            <div className="flex items-center pt-2">
              <Badge variant="outline" className="bg-lukso-primary/10 text-lukso-primary text-xs">
                LSP3 Profile
              </Badge>
              <Badge variant="outline" className="ml-2 bg-lukso-secondary/10 text-lukso-light text-xs">
                Credibility: 94%
              </Badge>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UniversalProfileIcon;
