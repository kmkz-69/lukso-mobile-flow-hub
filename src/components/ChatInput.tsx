
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, PlusCircle, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onVoice: () => void;
  onAction: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onVoice, onAction }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-background border-t border-border thumb-zone">
      <div className="flex items-end space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={onAction}
        >
          <PlusCircle className="h-5 w-5 text-lukso-primary" />
        </Button>
        <div className="relative flex-grow">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[44px] w-full resize-none py-3 pr-12"
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-1 right-1"
            onClick={onVoice}
          >
            <Mic className="h-5 w-5 text-lukso-primary" />
          </Button>
        </div>
        <Button
          className="bg-lukso-primary hover:bg-lukso-secondary text-white shrink-0"
          size="icon"
          onClick={handleSend}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
