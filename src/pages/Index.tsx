
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ChatListItem from '@/components/ChatListItem';
import UniversalProfileIcon from '@/components/UniversalProfileIcon';
import ProjectBadge from '@/components/ProjectBadge';
import NewConversation from '@/components/NewConversation';
import { useChat } from '@/context/ChatContext';
import { useProfile } from '@/context/ProfileContext';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  
  const { chats } = useChat();
  const { profile, connectProfile } = useProfile();
  
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleChatClick = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const handleConnectUP = async () => {
    await connectProfile();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <UniversalProfileIcon 
              address={profile.address}
              name={profile.name}
              image={profile.image}
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
            onClick={handleConnectUP}
          >
            {profile.isConnected ? 'Connected' : 'Connect UP'}
          </Button>
        </div>
      </header>
      
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full py-2 pl-10 pr-4 rounded-md bg-secondary border border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Recent Chats</h3>
          <Badge variant="outline" className="bg-lukso-primary/10 text-lukso-primary">
            {chats.length} total
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
          
          {filteredChats.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              {searchQuery ? "No chats match your search" : "No recent chats"}
            </div>
          )}
        </div>
      </div>
      
      <div className="thumb-zone p-4">
        <Button 
          className="w-full bg-lukso-primary hover:bg-lukso-secondary text-white"
          onClick={() => setShowNewConversation(true)}
        >
          New Conversation
        </Button>
      </div>
      
      <NewConversation 
        isOpen={showNewConversation} 
        onClose={() => setShowNewConversation(false)} 
      />
    </div>
  );
};

export default Index;
