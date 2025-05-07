import React, { createContext, useContext, useState, ReactNode } from "react";
import AIService from "@/services/AIService";

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  name: string;
  address: string;
  lastMessage: string;
  lastMessageTime: string;
  status: string;
  isUnread: boolean;
  profileImage: string;
}

interface ChatContextType {
  chats: Chat[];
  messages: Record<string, Message[]>;
  sendMessage: (chatId: string, content: string) => void;
  markAsRead: (chatId: string) => void;
  setChatStatus: (chatId: string, status: string) => void;
  getAIResponse: (chatId: string) => Promise<void>;
  isAITyping: boolean;
}

// Mock data
const initialChats = [
  {
    id: '1',
    name: 'Alice Designer',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    lastMessage: "I've finished the mockups for the landing page",
    lastMessageTime: '10:45 AM',
    status: 'Milestone 1 Paid ✅',
    isUnread: true,
    profileImage: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Bob Developer',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    lastMessage: 'Can you review the code I pushed?',
    lastMessageTime: 'Yesterday',
    status: 'In Progress',
    isUnread: false,
    profileImage: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Carol Project Manager',
    address: '0x7890abcdef1234567890abcdef1234567890abcd',
    lastMessage: "Let's discuss the timeline for Phase 2",
    lastMessageTime: 'Monday',
    status: '',
    isUnread: false,
    profileImage: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '4',
    name: 'Dave Marketer',
    address: '0xdef1234567890abcdef1234567890abcdef123456',
    lastMessage: 'The analytics from the campaign look promising',
    lastMessageTime: 'Last week',
    status: 'Contract Signed',
    isUnread: false,
    profileImage: 'https://i.pravatar.cc/150?img=4'
  }
];

const initialMessages = {
  "1": [
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
  ]
};

const ChatContext = createContext<ChatContextType>({
  chats: [],
  messages: {},
  sendMessage: () => {},
  markAsRead: () => {},
  setChatStatus: () => {},
  getAIResponse: async () => {},
  isAITyping: false
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [isAITyping, setIsAITyping] = useState<boolean>(false);

  const sendMessage = (chatId: string, content: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'me',
      timestamp: 'Just now'
    };
    
    // Add message to the chat
    setMessages(prev => {
      const chatMessages = prev[chatId] || [];
      return {
        ...prev,
        [chatId]: [...chatMessages, newMessage]
      };
    });
    
    // Update last message in chat list
    setChats(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              lastMessage: content,
              lastMessageTime: 'Just now'
            } 
          : chat
      )
    );
  };

  const getAIResponse = async (chatId: string) => {
    const chatMessages = messages[chatId] || [];
    if (chatMessages.length === 0) return;
    
    setIsAITyping(true);
    
    // Extract the last 5 messages for context
    const recentMessages = chatMessages.slice(-5).map(msg => ({
      role: msg.sender === 'me' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));
    
    try {
      const response = await AIService.generateResponse(recentMessages);
      
      // Add AI response as a message from the other person
      const aiMessage = {
        id: `msg-ai-${Date.now()}`,
        content: response || "I'm not sure how to respond to that.",
        sender: chatId, // Use the chatId as the sender for the AI response
        timestamp: 'Just now'
      };
      
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), aiMessage]
      }));
      
      // Update the last message in the chat list
      setChats(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? { 
                ...chat, 
                lastMessage: response || "I'm not sure how to respond to that.",
                lastMessageTime: 'Just now'
              } 
            : chat
        )
      );
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setIsAITyping(false);
    }
  };

  const markAsRead = (chatId: string) => {
    setChats(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, isUnread: false } 
          : chat
      )
    );
  };

  const setChatStatus = (chatId: string, status: string) => {
    setChats(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, status } 
          : chat
      )
    );
  };

  return (
    <ChatContext.Provider value={{ chats, messages, sendMessage, markAsRead, setChatStatus, getAIResponse, isAITyping }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
