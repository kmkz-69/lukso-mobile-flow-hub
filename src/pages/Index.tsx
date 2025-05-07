
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ChatListItem from '@/components/ChatListItem';
import UniversalProfileIcon from '@/components/UniversalProfileIcon';
import ProjectBadge from '@/components/ProjectBadge';

// Mock data
const mockChats = [
  {
    id: '1',
    name: 'Alice Designer',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    lastMessage: 'I've finished the mockups for the landing page',
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
    lastMessage: 'Let's discuss the timeline for Phase 2',
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

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredChats = mockChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleChatClick = (id: string) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <UniversalProfileIcon 
              address="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
              name="Your Profile"
              image="https://i.pravatar.cc/150?img=5"
            />
            <div className="flex flex-col">
              <h2 className="text-sm font-medium">LUKSO Flow Hub</h2>
              <div className="flex items-center">
                <ProjectBadge id="LSP8-721" title="LUKSO Mobile Flow Hub" />
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-lukso-primary/10 text-lukso-primary border-none"
          >
            Connect UP
          </Button>
        </div>
      </header>
      
      <div className="p-4">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full p-2 rounded-md bg-secondary border border-border mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Recent Chats</h3>
          <Badge variant="outline" className="bg-lukso-primary/10 text-lukso-primary">
            {mockChats.length} total
          </Badge>
        </div>
        
        <div className="space-y-2 mb-20">
          {filteredChats.map(chat => (
            <ChatListItem 
              key={chat.id}
              id={chat.id}
              name={chat.name}
              address={chat.address}
              lastMessage={chat.lastMessage}
              lastMessageTime={chat.lastMessageTime}
              status={chat.status}
              isUnread={chat.isUnread}
              profileImage={chat.profileImage}
              onClick={() => handleChatClick(chat.id)}
            />
          ))}
        </div>
      </div>
      
      <div className="thumb-zone p-4">
        <Button 
          className="w-full bg-lukso-primary hover:bg-lukso-secondary text-white"
        >
          New Conversation
        </Button>
      </div>
    </div>
  );
};

export default Index;
