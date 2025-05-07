
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  content: string;
  sender: {
    name: string;
    image?: string;
  } | 'system';
  timestamp: string;
  isOwn: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  timestamp,
  isOwn
}) => {
  // Handle system messages
  if (sender === 'system') {
    return (
      <div className="flex justify-center mb-4">
        <Card className="bg-lukso-primary/5 border-lukso-primary/30 p-2 max-w-[80%]">
          <div className="text-xs text-center">{content}</div>
          <div className="text-xs text-muted-foreground text-center mt-1">{timestamp}</div>
        </Card>
      </div>
    );
  }

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

export default ChatMessage;
