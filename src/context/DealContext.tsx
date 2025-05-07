
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { simulateContractCall } from "@/contracts/MilestoneContract";

export interface Milestone {
  id: string;
  title: string;
  amount: string;
  status: 'completed' | 'active' | 'locked' | 'disputed';
}

interface DealContextType {
  milestones: Record<string, Milestone[]>;
  createMilestone: (chatId: string, title: string, amount: number) => Promise<void>;
  completeMilestone: (chatId: string, milestoneId: string) => Promise<void>;
  releaseFunds: (chatId: string, milestoneId: string) => Promise<void>;
  createDispute: (chatId: string, milestoneId: string, reason: string) => Promise<void>;
  resolveDispute: (chatId: string, milestoneId: string, releaseToFreelancer: boolean) => Promise<void>;
}

const DealContext = createContext<DealContextType>({
  milestones: {},
  createMilestone: async () => {},
  completeMilestone: async () => {},
  releaseFunds: async () => {},
  createDispute: async () => {},
  resolveDispute: async () => {},
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
      // Simulate contract interaction
      simulateContractCall('createMilestone', [title, amount]).then(() => {
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
      });
    });
  };

  const completeMilestone = async (chatId: string, milestoneId: string): Promise<void> => {
    return new Promise((resolve) => {
      simulateContractCall('completeMilestone', [milestoneId]).then(() => {
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
      });
    });
  };

  const releaseFunds = async (chatId: string, milestoneId: string): Promise<void> => {
    return new Promise((resolve) => {
      simulateContractCall('releaseFunds', [milestoneId]).then(() => {
        toast({
          title: "Funds Released",
          description: "The funds have been released to the freelancer.",
        });
        
        resolve();
      });
    });
  };

  const createDispute = async (chatId: string, milestoneId: string, reason: string): Promise<void> => {
    return new Promise((resolve) => {
      // In a real implementation, this would designate an arbiter address
      const arbiterAddress = "0x1111222233334444555566667777888899990000";
      
      simulateContractCall('createDispute', [milestoneId, arbiterAddress]).then(() => {
        setMilestones(prev => {
          const chatMilestones = prev[chatId] || [];
          const updatedMilestones = chatMilestones.map(m => 
            m.id === milestoneId ? { ...m, status: 'disputed' as const } : m
          );
          
          return {
            ...prev,
            [chatId]: updatedMilestones
          };
        });
        
        toast({
          title: "Dispute Created",
          description: `Dispute created for milestone: ${reason}`,
          variant: "destructive"
        });
        
        resolve();
      });
    });
  };

  const resolveDispute = async (chatId: string, milestoneId: string, releaseToFreelancer: boolean): Promise<void> => {
    return new Promise((resolve) => {
      simulateContractCall('resolveDispute', [milestoneId, releaseToFreelancer]).then(() => {
        setMilestones(prev => {
          const chatMilestones = prev[chatId] || [];
          const updatedMilestones = chatMilestones.map(m => 
            m.id === milestoneId ? { ...m, status: releaseToFreelancer ? 'completed' as const : 'active' as const } : m
          );
          
          return {
            ...prev,
            [chatId]: updatedMilestones
          };
        });
        
        toast({
          title: "Dispute Resolved",
          description: releaseToFreelancer 
            ? "Funds have been released to the freelancer." 
            : "Funds have been returned to the client.",
        });
        
        resolve();
      });
    });
  };

  return (
    <DealContext.Provider value={{ 
      milestones, 
      createMilestone, 
      completeMilestone, 
      releaseFunds,
      createDispute,
      resolveDispute
    }}>
      {children}
    </DealContext.Provider>
  );
};

export const useDeal = () => useContext(DealContext);
