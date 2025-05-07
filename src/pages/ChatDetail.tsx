
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UniversalProfileIcon from '@/components/UniversalProfileIcon';
import MilestoneScroller from '@/components/MilestoneScroller';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import AiSuggestionCard from '@/components/AiSuggestionCard';
import DealBottomSheet from '@/components/DealBottomSheet';
import { useToast } from '@/components/ui/use-toast';

// Mock data
const mockUsers = {
  'alice': {
    id: '1',
    name: 'Alice Designer',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    image: 'https://i.pravatar.cc/150?img=1'
  },
  'me': {
    id: 'me',
    name: 'Your Profile',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    image: 'https://i.pravatar.cc/150?img=5'
  }
};

const mockMilestones = [
  {
    id: '1',
    title: 'Design Mockups',
    amount: '5.0',
    status: 'completed' as const
  },
  {
    id: '2',
    title: 'Frontend Implementation',
    amount: '7.5',
    status: 'active' as const
  },
  {
    id: '3',
    title: 'Backend Integration',
    amount: '10.0',
    status: 'locked' as const
  }
];

const mockMessages = [
  {
    id: '1',
    content: "Hi there! I'm interested in discussing the project requirements.",
    sender: 'alice',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    content: "Hi Alice, I'd love to talk about the project.",
    sender: 'me',
    timestamp: '10:32 AM'
  },
  {
    id: '3',
    content: "Great! I've reviewed the specifications and I think I can deliver exactly what you need.",
    sender: 'alice',
    timestamp: '10:35 AM'
  },
  {
    id: '4',
    content: "Sounds good. What's your timeline for the design mockups?",
    sender: 'me',
    timestamp: '10:38 AM'
  },
  {
    id: '5',
    content: "I can have the initial mockups ready by the end of this week. Then we can iterate based on your feedback.",
    sender: 'alice',
    timestamp: '10:42 AM'
  },
  {
    id: '6',
    content: "Perfect. I've just completed the first milestone and uploaded the designs to the shared workspace.",
    sender: 'alice',
    timestamp: '10:45 AM'
  }
];

const ChatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState(mockMessages);
  const [showDealSheet, setShowDealSheet] = useState(false);
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);
  
  // Find the chat based on the ID
  const chatUser = mockUsers['alice']; // For demo, always use Alice
  
  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'me',
      timestamp: 'Just now'
    };
    setMessages([...messages, newMessage]);
  };
  
  const handleBookDeal = (amount: number, autoApprove: boolean) => {
    setShowDealSheet(false);
    
    // Show animation and toast
    setTimeout(() => {
      toast({
        title: "Transaction Submitted",
        description: `${amount.toFixed(1)} LYX escrow created with ${autoApprove ? 'auto-approval' : 'manual approval'}.`,
      });
      
      // Add system message
      const systemMsg = {
        id: `system-${Date.now()}`,
        content: `📝 Created a milestone for ${amount.toFixed(1)} LYX. Transaction hash: 0x742d...f44e`,
        sender: 'system',
        timestamp: 'Just now'
      };
      setMessages([...messages, systemMsg]);
    }, 1000);
  };
  
  const handleVoiceCommand = () => {
    toast({
      title: "Voice Recognition",
      description: "Listening for commands...",
    });
    
    // Simulate voice recognition
    setTimeout(() => {
      toast({
        title: "Command Recognized",
        description: "Creating milestone: Frontend Implementation",
      });
      setShowDealSheet(true);
    }, 2000);
  };
  
  const handleAiSuggestion = () => {
    setShowAiSuggestion(false);
    setShowDealSheet(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="p-3 border-b border-border">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <UniversalProfileIcon 
            address={chatUser.address}
            name={chatUser.name}
            image={chatUser.image}
          />
          
          <div className="flex flex-col">
            <h2 className="text-sm font-medium">{chatUser.name}</h2>
            <span className="text-xs text-muted-foreground">
              Last active: Just now
            </span>
          </div>
        </div>
        
        <div className="mt-3">
          <MilestoneScroller 
            milestones={mockMilestones}
            onMilestoneClick={(milestone) => {
              toast({
                title: `Milestone: ${milestone.title}`,
                description: `Status: ${milestone.status}, Amount: ${milestone.amount} LYX`,
              });
            }}
          />
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            content={message.content}
            sender={mockUsers[message.sender === 'me' ? 'me' : 'alice']}
            timestamp={message.timestamp}
            isOwn={message.sender === 'me'}
          />
        ))}
        
        {showAiSuggestion && (
          <AiSuggestionCard
            title="Book this milestone?"
            description="I noticed you're discussing the Frontend Implementation milestone. Would you like to create an escrow contract for this work?"
            actionText="Book Frontend Milestone (7.5 LYX)"
            type="deal"
            onAction={handleAiSuggestion}
          />
        )}
      </div>
      
      <ChatInput
        onSend={handleSendMessage}
        onVoice={handleVoiceCommand}
        onAction={() => setShowDealSheet(true)}
      />
      
      <DealBottomSheet
        isOpen={showDealSheet}
        onClose={() => setShowDealSheet(false)}
        onConfirm={handleBookDeal}
      />
    </div>
  );
};

export default ChatDetail;
