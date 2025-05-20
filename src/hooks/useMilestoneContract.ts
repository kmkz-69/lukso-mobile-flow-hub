
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

// Simulated milestone contract state
interface MilestoneContractState {
  milestones: {
    id: string;
    title: string;
    amount: string;
    status: "pending" | "locked" | "released" | "disputed";
  }[];
  loading: boolean;
  error: string | null;
}

export function useMilestoneContract(projectId: string) {
  const [contractState, setContractState] = useState<MilestoneContractState>({
    milestones: [
      { id: "m1", title: "Design", amount: "5 LYX", status: "released" },
      { id: "m2", title: "Development", amount: "10 LYX", status: "locked" },
      { id: "m3", title: "Testing", amount: "3 LYX", status: "pending" },
    ],
    loading: false,
    error: null,
  });

  // Function to create a new milestone
  const createMilestone = async (data: any) => {
    setContractState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add new milestone to state
      const newMilestone = {
        id: `m${Date.now()}`,
        title: data.title,
        amount: `${data.amount} LYX`,
        status: "locked" as const
      };
      
      setContractState(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone],
        loading: false
      }));
      
      // Show success toast
      toast({
        title: "Milestone Created",
        description: `${data.amount} LYX locked in escrow for "${data.title}"`,
      });
      
      return newMilestone;
    } catch (error) {
      console.error("Contract error:", error);
      setContractState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Failed to create milestone" 
      }));
      
      toast({
        title: "Transaction Failed",
        description: "Could not create milestone. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  // Function to release funds for a milestone
  const releaseFunds = async (milestoneId: string) => {
    setContractState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update milestone status in state
      setContractState(prev => ({
        ...prev,
        milestones: prev.milestones.map(m => 
          m.id === milestoneId ? { ...m, status: "released" as const } : m
        ),
        loading: false
      }));
      
      // Show success toast
      const milestone = contractState.milestones.find(m => m.id === milestoneId);
      toast({
        title: "Funds Released",
        description: `${milestone?.amount} has been sent to the recipient`,
      });
      
      return true;
    } catch (error) {
      console.error("Contract error:", error);
      setContractState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Failed to release funds" 
      }));
      
      toast({
        title: "Transaction Failed",
        description: "Could not release funds. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  // Function to create a dispute for a milestone
  const createDispute = async (milestoneId: string, reason: string, evidence: File[]) => {
    setContractState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update milestone status in state
      setContractState(prev => ({
        ...prev,
        milestones: prev.milestones.map(m => 
          m.id === milestoneId ? { ...m, status: "disputed" as const } : m
        ),
        loading: false
      }));
      
      // Show success toast
      toast({
        title: "Dispute Created",
        description: "The milestone has been marked as disputed",
        variant: "destructive",
      });
      
      // Trigger vibration if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
      return true;
    } catch (error) {
      console.error("Contract error:", error);
      setContractState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Failed to create dispute" 
      }));
      
      toast({
        title: "Transaction Failed",
        description: "Could not create dispute. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return {
    milestones: contractState.milestones,
    loading: contractState.loading,
    error: contractState.error,
    createMilestone,
    releaseFunds,
    createDispute
  };
}