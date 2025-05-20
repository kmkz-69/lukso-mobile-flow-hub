
/**
 * React hook for interacting with LUKSO smart contracts
 */

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { IMilestoneContract, Milestone, CreateMilestoneParams } from "@/contracts/IMilestoneContract";
import { loadMilestoneContract, deployMilestoneContract, DeploymentParams } from "@/contracts/deploymentUtils";
import { submitTransaction, TransactionMeta } from "@/contracts/transactionHandler";

export interface SmartContractState {
  contract: IMilestoneContract | null;
  milestones: Milestone[];
  loading: boolean;
  error: string | null;
  deployed: boolean;
  contractAddress: string | null;
}

export function useSmartContract(contractAddress?: string) {
  const [state, setState] = useState<SmartContractState>({
    contract: null,
    milestones: [],
    loading: Boolean(contractAddress),
    error: null,
    deployed: Boolean(contractAddress),
    contractAddress: contractAddress || null,
  });
  
  // Load contract when address is provided
  useEffect(() => {
    if (contractAddress) {
      loadContract(contractAddress);
    }
  }, [contractAddress]);
  
  // Load contract function
  const loadContract = async (address: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const contract = await loadMilestoneContract(address);
      
      if (!contract) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: "Failed to load contract",
          contract: null,
        }));
        return;
      }
      
      const milestones = await contract.getAllMilestones();
      
      setState({
        contract,
        milestones,
        loading: false,
        error: null,
        deployed: true,
        contractAddress: address,
      });
      
      console.log("Contract loaded successfully:", address);
      
    } catch (error: any) {
      console.error("Contract loading error:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to load contract",
        contract: null,
      }));
    }
  };
  
  // Deploy new contract
  const deployContract = async (params: DeploymentParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const address = await deployMilestoneContract(params);
      
      if (!address) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: "Failed to deploy contract",
        }));
        return null;
      }
      
      // Load the newly deployed contract
      await loadContract(address);
      
      return address;
    } catch (error: any) {
      console.error("Contract deployment error:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to deploy contract",
      }));
      return null;
    }
  };
  
  // Function to create a new milestone
  const createMilestone = useCallback(async (params: CreateMilestoneParams) => {
    if (!state.contract) {
      toast({
        title: "Error",
        description: "Contract not loaded",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const meta: TransactionMeta = {
        title: "Create Milestone",
        description: `Creating milestone: ${params.title}`,
        type: "milestone",
        value: `${params.amount} LYX`,
      };
      
      // Submit transaction
      await submitTransaction(
        () => state.contract!.createMilestone(params),
        meta
      );
      
      // Refresh milestones after creation
      const updatedMilestones = await state.contract.getAllMilestones();
      setState(prev => ({ ...prev, milestones: updatedMilestones }));
      
      // Find the newly created milestone (generally the last one)
      const newMilestone = updatedMilestones[updatedMilestones.length - 1];
      
      return newMilestone;
    } catch (error: any) {
      console.error("Error creating milestone:", error);
      
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Failed to create milestone" 
      }));
      
      throw error;
    }
  }, [state.contract]);
  
  // Function to release funds for a milestone
  const releaseFunds = useCallback(async (milestoneId: string) => {
    if (!state.contract) {
      toast({
        title: "Error",
        description: "Contract not loaded",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const milestone = await state.contract.getMilestone(milestoneId);
      if (!milestone) throw new Error("Milestone not found");
      
      const meta: TransactionMeta = {
        title: "Release Funds",
        description: `Releasing ${milestone.amount} for milestone: ${milestone.title}`,
        type: "release",
        value: milestone.amount,
        to: milestone.freelancerAddress,
        contractAddress: state.contractAddress || undefined,
      };
      
      // Submit transaction
      await submitTransaction(
        () => state.contract!.releaseFunds(milestoneId),
        meta
      );
      
      // Refresh milestones after release
      const updatedMilestones = await state.contract.getAllMilestones();
      setState(prev => ({ ...prev, milestones: updatedMilestones }));
      
      return true;
    } catch (error: any) {
      console.error("Error releasing funds:", error);
      
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Failed to release funds" 
      }));
      
      throw error;
    }
  }, [state.contract, state.contractAddress]);
  
  // Function to create a dispute for a milestone
  const createDispute = useCallback(async (milestoneId: string, reason: string, evidence: File[]) => {
    if (!state.contract) {
      toast({
        title: "Error",
        description: "Contract not loaded",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const milestone = await state.contract.getMilestone(milestoneId);
      if (!milestone) throw new Error("Milestone not found");
      
      const meta: TransactionMeta = {
        title: "Create Dispute",
        description: `Creating dispute for milestone: ${milestone.title}`,
        type: "dispute",
        contractAddress: state.contractAddress || undefined,
      };
      
      // Submit transaction
      await submitTransaction(
        () => state.contract!.createDispute(milestoneId, reason, evidence),
        meta
      );
      
      // Refresh milestones after dispute creation
      const updatedMilestones = await state.contract.getAllMilestones();
      setState(prev => ({ ...prev, milestones: updatedMilestones }));
      
      return true;
    } catch (error: any) {
      console.error("Error creating dispute:", error);
      
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Failed to create dispute" 
      }));
      
      throw error;
    }
  }, [state.contract, state.contractAddress]);
  
  // Return all the state and functions
  return {
    ...state,
    loadContract,
    deployContract,
    createMilestone,
    releaseFunds,
    createDispute,
  };
}
