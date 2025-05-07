
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, PlusCircle, Send, Bot } from "lucide-react";
import { useProfile } from '@/context/ProfileContext';

interface ChatInputProps {
  onSend: (message: string) => void;
  onVoice: () => void;
  onAction: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onVoice, onAction }) => {
  const [message, setMessage] = useState('');
  const { profile } = useProfile();
  const [aiMode, setAiMode] = useState(true);

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
          className={`shrink-0 ${!profile.isConnected ? 'opacity-50' : ''}`}
          onClick={onAction}
          disabled={!profile.isConnected}
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
            disabled={!profile.isConnected}
          />
          <div className="absolute bottom-1 right-1 flex">
            <Button
              variant="ghost"
              size="icon"
              className={`${aiMode ? 'text-green-500' : ''}`}
              onClick={() => setAiMode(!aiMode)}
              disabled={!profile.isConnected}
            >
              <Bot className={`h-5 w-5 ${aiMode ? 'text-green-500' : 'text-lukso-primary'}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className=""
              onClick={onVoice}
              disabled={!profile.isConnected}
            >
              <Mic className="h-5 w-5 text-lukso-primary" />
            </Button>
          </div>
        </div>
        <Button
          className="bg-lukso-primary hover:bg-lukso-secondary text-white shrink-0"
          size="icon"
          onClick={handleSend}
          disabled={!profile.isConnected || message.trim() === ''}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      {!profile.isConnected && (
        <div className="mt-2 text-xs text-center text-amber-600">
          Please connect your LUKSO Universal Profile to send messages
        </div>
      )}
    </div>
  );
};

export default ChatInput;
