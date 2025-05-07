
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flag, MoreVertical } from "lucide-react";
import UniversalProfileIcon from '@/components/UniversalProfileIcon';
import MilestoneScroller from '@/components/MilestoneScroller';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import AITypingIndicator from '@/components/AITypingIndicator';
import AiSuggestionCard from '@/components/AiSuggestionCard';
import DealBottomSheet from '@/components/DealBottomSheet';
import MilestoneActionSheet from '@/components/MilestoneActionSheet';
import DisputeActionSheet from '@/components/DisputeActionSheet';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/context/ChatContext';
import { useDeal, Milestone } from '@/context/DealContext';
import { useProfile } from '@/context/ProfileContext';
import AIService from '@/services/AIService';

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
  const { profile } = useProfile();
  const { messages, sendMessage, markAsRead, setChatStatus, getAIResponse, isAITyping } = useChat();
  const { milestones, createMilestone } = useDeal();
  
  const [showDealSheet, setShowDealSheet] = useState(false);
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState({
    title: "",
    description: "",
    actionText: "",
    type: "deal" as "deal" | "escrow" | "dispute"
  });
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

  // Generate AI suggestion when chat messages change
  useEffect(() => {
    const generateSuggestion = async () => {
      if (!chatMessages.length) return;
      
      // Only generate suggestions occasionally
      if (chatMessages.length > 0 && chatMessages.length % 3 === 0) {
        const messageContents = chatMessages.map(msg => `${msg.sender === 'me' ? 'You' : 'User'}: ${msg.content}`);
        const currentContext = `The conversation is about a project with ${chatUser.name}.`;
        
        const suggestion = await AIService.suggestAction(messageContents, currentContext);
        
        if (suggestion) {
          // Parse the suggestion into parts
          let title = "AI Suggestion";
          let description = suggestion.suggestion || "";
          let actionText = "Accept Suggestion";
          
          if (suggestion.type === 'deal') {
            title = "Create a milestone?";
            actionText = "Create Milestone";
          } else if (suggestion.type === 'escrow') {
            title = "Release payment?";
            actionText = "Release Funds";
          } else if (suggestion.type === 'dispute') {
            title = "Resolve dispute?";
            actionText = "Open Dispute Resolution";
          }
          
          setAiSuggestion({
            title,
            description, 
            actionText,
            type: suggestion.type
          });
          
          setShowAiSuggestion(true);
        }
      }
    };
    
    generateSuggestion();
  }, [chatMessages]);
  
  const handleSendMessage = (content: string) => {
    if (!profile.isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your LUKSO Universal Profile to send messages",
        variant: "destructive"
      });
      return;
    }
    
    sendMessage(chatId, content);
    
    // Trigger AI response after a short delay
    setTimeout(() => {
      getAIResponse(chatId);
    }, 1000);
  };
  
  const handleBookDeal = (amount: number, autoApprove: boolean) => {
    setShowDealSheet(false);
    
    if (!profile.isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your LUKSO Universal Profile to create milestones",
        variant: "destructive"
      });
      return;
    }
    
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
    if (!profile.isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your LUKSO Universal Profile to use voice commands",
        variant: "destructive"
      });
      return;
    }
    
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
    
    if (aiSuggestion.type === 'deal') {
      setShowDealSheet(true);
    } else if (aiSuggestion.type === 'escrow') {
      // For demo purposes, just show the milestone action sheet
      if (chatMilestones.length > 0) {
        setSelectedMilestone(chatMilestones[0]);
        setShowMilestoneAction(true);
      } else {
        setShowDealSheet(true);
      }
    } else if (aiSuggestion.type === 'dispute') {
      if (chatMilestones.length > 0) {
        setSelectedMilestone(chatMilestones[0]);
        setShowDisputeAction(true);
      } else {
        toast({
          title: "No Active Milestones",
          description: "Create a milestone first before opening a dispute",
        });
      }
    }
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
        
        {isAITyping && (
          <AITypingIndicator sender={chatUser} />
        )}
        
        {showAiSuggestion && (
          <AiSuggestionCard
            title={aiSuggestion.title}
            description={aiSuggestion.description}
            actionText={aiSuggestion.actionText}
            type={aiSuggestion.type}
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
