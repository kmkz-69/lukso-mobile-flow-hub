
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Milestone {
  id: string;
  title: string;
  amount: string;
  status: 'completed' | 'active' | 'locked';
}

interface DealContextType {
  milestones: Record<string, Milestone[]>;
  createMilestone: (chatId: string, title: string, amount: number) => Promise<void>;
  completeMilestone: (chatId: string, milestoneId: string) => Promise<void>;
  releaseFunds: (chatId: string, milestoneId: string) => Promise<void>;
}

const DealContext = createContext<DealContextType>({
  milestones: {},
  createMilestone: async () => {},
  completeMilestone: async () => {},
  releaseFunds: async () => {},
});

export const DealProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({
    "1": [
      { id: '1', title: 'Design Mockups', amount: '5.0', status: 'completed' },
      { id: '2', title: 'Frontend Implementation', amount: '7.5', status: 'active' },
      { id: '3', title: 'Backend Integration', amount: '10.0', status: 'locked' },
    ]
  });

  const createMilestone = async (chatId: string, title: string, amount: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMilestone: Milestone = {
          id: `milestone-${Date.now()}`,
          title,
          amount: amount.toFixed(1),
          status: 'active'
        };
        
        setMilestones(prev => {
          const chatMilestones = prev[chatId] || [];
          return {
            ...prev,
            [chatId]: [...chatMilestones, newMilestone]
          };
        });
        
        toast({
          title: "Milestone Created",
          description: `${title} milestone for ${amount.toFixed(1)} LYX has been created.`,
        });
        
        resolve();
      }, 1500);
    });
  };

  const completeMilestone = async (chatId: string, milestoneId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMilestones(prev => {
          const chatMilestones = prev[chatId] || [];
          const updatedMilestones = chatMilestones.map(m => 
            m.id === milestoneId ? { ...m, status: 'completed' as const } : m
          );
          
          return {
            ...prev,
            [chatId]: updatedMilestones
          };
        });
        
        toast({
          title: "Milestone Completed",
          description: "The milestone has been marked as completed.",
        });
        
        resolve();
      }, 1000);
    });
  };

  const releaseFunds = async (chatId: string, milestoneId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would trigger a blockchain transaction
        toast({
          title: "Funds Released",
          description: "The funds have been released to the freelancer.",
        });
        
        resolve();
      }, 1500);
    });
  };

  return (
    <DealContext.Provider value={{ milestones, createMilestone, completeMilestone, releaseFunds }}>
      {children}
    </DealContext.Provider>
  );
};

export const useDeal = () => useContext(DealContext);
