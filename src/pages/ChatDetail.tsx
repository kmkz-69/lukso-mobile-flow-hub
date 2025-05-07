
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flag, MoreVertical } from "lucide-react";
import UniversalProfileIcon from '@/components/UniversalProfileIcon';
import MilestoneScroller from '@/components/MilestoneScroller';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import AiSuggestionCard from '@/components/AiSuggestionCard';
import DealBottomSheet from '@/components/DealBottomSheet';
import MilestoneActionSheet from '@/components/MilestoneActionSheet';
import DisputeActionSheet from '@/components/DisputeActionSheet';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/context/ChatContext';
import { useDeal, Milestone } from '@/context/DealContext';

// Mock users data for backward compatibility
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

const ChatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { messages, sendMessage, markAsRead, setChatStatus } = useChat();
  const { milestones, createMilestone } = useDeal();
  
  const [showDealSheet, setShowDealSheet] = useState(false);
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);
  const [showMilestoneAction, setShowMilestoneAction] = useState(false);
  const [showDisputeAction, setShowDisputeAction] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  
  // Get the actual chat messages or default to empty array
  const chatId = id || '1';
  const chatMessages = messages[chatId] || [];
  
  // Get the chat user (for demo, always use Alice)
  const chatUser = mockUsers['alice'];
  
  // Get the milestones for this chat
  const chatMilestones = milestones[chatId] || [];
  
  // Mark chat as read when opening
  useEffect(() => {
    if (chatId) {
      markAsRead(chatId);
    }
  }, [chatId, markAsRead]);
  
  const handleSendMessage = (content: string) => {
    sendMessage(chatId, content);
  };
  
  const handleBookDeal = (amount: number, autoApprove: boolean) => {
    setShowDealSheet(false);
    
    // Create a new milestone
    createMilestone(chatId, "Custom Milestone", amount).then(() => {
      // Add system message
      const systemMsg = {
        id: `system-${Date.now()}`,
        content: `📝 Created a milestone for ${amount.toFixed(1)} LYX. Transaction hash: 0x742d...f44e`,
        sender: 'system',
        timestamp: 'Just now'
      };
      
      // Update chat status
      setChatStatus(chatId, "Milestone Created");
    });
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
  
  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowMilestoneAction(true);
  };
  
  const handleDisputeClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowDisputeAction(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="p-3 border-b border-border">
        <div className="flex justify-between items-center">
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
          
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-3">
          <MilestoneScroller 
            milestones={chatMilestones}
            onMilestoneClick={handleMilestoneClick}
          />
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {chatMessages.map(message => (
          <ChatMessage
            key={message.id}
            content={message.content}
            sender={message.sender === 'system' ? 'system' : mockUsers[message.sender === 'me' ? 'me' : 'alice']}
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
      
      <MilestoneActionSheet
        isOpen={showMilestoneAction}
        milestone={selectedMilestone}
        chatId={chatId}
        onClose={() => setShowMilestoneAction(false)}
        onDisputeClick={handleDisputeClick}
      />
      
      <DisputeActionSheet
        isOpen={showDisputeAction}
        milestone={selectedMilestone}
        chatId={chatId}
        onClose={() => setShowDisputeAction(false)}
      />
    </div>
  );
};

export default ChatDetail;
