
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UniversalProfileIcon from './UniversalProfileIcon';

interface ChatListItemProps {
  id: string;
  name: string;
  address: string;
  lastMessage: string;
  lastMessageTime: string;
  status?: string;
  isUnread?: boolean;
  profileImage?: string;
  onClick?: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  id,
  name,
  address,
  lastMessage,
  lastMessageTime,
  status,
  isUnread = false,
  profileImage,
  onClick
}) => {
  return (
    <Card 
      className={`flex items-center p-3 mb-2 ${isUnread ? 'bg-lukso-primary/5' : 'bg-background'} hover:bg-lukso-dark/20 transition-colors cursor-pointer squish-button`}
      onClick={onClick}
    >
      <UniversalProfileIcon 
        address={address}
        name={name}
        image={profileImage}
        hasUnread={isUnread}
        showHoverCard={false}
      />
      <div className="ml-3 flex-grow overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">{name}</h3>
          <span className="text-xs text-muted-foreground">{lastMessageTime}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground truncate max-w-[70%]">{lastMessage}</p>
          {status && (
            <Badge 
              variant="outline" 
              className={`text-xs ${status.includes('Paid') || status.includes('✅') ? 'bg-green-500/10 text-green-500' : 'bg-lukso-primary/10 text-lukso-primary'}`}
            >
              {status}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChatListItem;
