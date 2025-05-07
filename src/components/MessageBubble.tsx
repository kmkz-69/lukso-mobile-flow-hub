
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageBubbleProps {
  content: string;
  sender: {
    name: string;
    image?: string;
  };
  timestamp: string;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  sender,
  timestamp,
  isOwn
}) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwn && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={sender.image} alt={sender.name} />
          <AvatarFallback className="bg-lukso-dark text-lukso-light">
            {sender.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[75%]`}>
        {!isOwn && (
          <div className="text-xs text-muted-foreground mb-1">{sender.name}</div>
        )}
        <div className={`p-3 rounded-2xl ${isOwn ? 'bg-lukso-primary text-white' : 'bg-secondary'}`}>
          <div className="text-sm">{content}</div>
        </div>
        <div className={`text-xs text-muted-foreground mt-1 ${isOwn ? 'text-right' : ''}`}>
          {timestamp}
        </div>
      </div>
      {isOwn && (
        <Avatar className="h-8 w-8 ml-2">
          <AvatarImage src={sender.image} alt={sender.name} />
          <AvatarFallback className="bg-lukso-dark text-lukso-light">
            {sender.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
