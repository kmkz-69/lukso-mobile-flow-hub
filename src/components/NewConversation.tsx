
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Search, UserPlus } from "lucide-react";
import { useChat, Chat } from '@/context/ChatContext';
import { useNavigate } from 'react-router-dom';

interface NewConversationProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewConversation: React.FC<NewConversationProps> = ({
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock user search results
  const mockUsers = [
    {
      id: 'new-1',
      name: 'Emma Visual Artist',
      address: '0x98765432109876543210987654321098765432aa',
      profileImage: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 'new-2',
      name: 'Frank Engineer',
      address: '0x76543210987654321098765432109876543210bb',
      profileImage: 'https://i.pravatar.cc/150?img=6'
    },
    {
      id: 'new-3',
      name: 'Grace UX Designer',
      address: '0x54321098765432109876543210987654321098cc',
      profileImage: 'https://i.pravatar.cc/150?img=7'
    }
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { chats } = useChat();

  const startNewConversation = (user: any) => {
    // In a real application, we would create a new chat in the backend
    // For now, just navigate to a mock chat
    const newChatId = `new-${Date.now()}`;
    onClose();
    navigate(`/chat/${user.id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <Card className={`w-full max-w-md rounded-t-2xl p-4 animate-slide-up`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">New Conversation</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search by name or UP address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card 
                key={user.id} 
                className="p-3 flex items-center hover:bg-lukso-primary/5 cursor-pointer transition-colors"
                onClick={() => startNewConversation(user)}
              >
                <div className="h-10 w-10 rounded-full bg-lukso-primary/20 mr-3 overflow-hidden">
                  <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.address}</p>
                </div>
                <Button size="sm" variant="ghost" className="ml-2">
                  <UserPlus className="h-4 w-4 text-lukso-primary" />
                </Button>
              </Card>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {searchQuery ? "No users found" : "Start typing to search for users"}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NewConversation;
