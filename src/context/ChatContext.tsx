
import React, { createContext, useContext, useState, ReactNode } from "react";

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
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);

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
    <ChatContext.Provider value={{ chats, messages, sendMessage, markAsRead, setChatStatus }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
