
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AITypingIndicatorProps {
  sender: {
    name: string;
    image?: string;
  };
}

const AITypingIndicator: React.FC<AITypingIndicatorProps> = ({ sender }) => {
  return (
    <div className="flex justify-start mb-4">
      <Avatar className="h-8 w-8 mr-2">
        <AvatarImage src={sender.image} alt={sender.name} />
        <AvatarFallback className="bg-lukso-dark text-lukso-light">
          {sender.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[75%]">
        <div className="text-xs text-muted-foreground mb-1">{sender.name}</div>
        <div className="p-3 rounded-2xl bg-secondary">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITypingIndicator;
