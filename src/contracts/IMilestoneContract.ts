
/**
 * Interface for LUKSO Milestone Contract
 * Based on LSP7 Digital Asset standard
 */

// Contract interface for milestone management
export interface IMilestoneContract {
  // Contract identification
  address: string;
  owner: string;
  
  // Contract state
  milestones: Milestone[];
  totalValue: number;
  disputeTimeout: number; // in seconds
  
  // Contract methods
  createMilestone: (params: CreateMilestoneParams) => Promise<Milestone>;
  releaseFunds: (milestoneId: string) => Promise<boolean>;
  createDispute: (milestoneId: string, reason: string, evidence: File[]) => Promise<boolean>;
  resolveMilestone: (milestoneId: string, resolution: MilestoneResolution) => Promise<boolean>;
  getMilestone: (milestoneId: string) => Promise<Milestone | null>;
  getAllMilestones: () => Promise<Milestone[]>;
}

// Milestone data structure
export interface Milestone {
  id: string;
  title: string;
  description?: string;
  amount: string;
  status: MilestoneStatus;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  clientAddress: string;
  freelancerAddress: string;
  disputeReason?: string;
  disputeEvidence?: string[];
  resolution?: MilestoneResolution;
}

// Milestone status enum
export type MilestoneStatus = "pending" | "locked" | "released" | "disputed" | "refunded";

// Resolution data for disputes
export interface MilestoneResolution {
  winner: "client" | "freelancer" | "split";
  clientAmount?: string;
  freelancerAmount?: string;
  resolvedBy: string;
  resolvedAt: number;
  notes?: string;
}

// Parameters to create new milestone
export interface CreateMilestoneParams {
  title: string;
  description?: string;
  amount: number;
  freelancerAddress: string;
  allowAutoApproval?: boolean;
  deadline?: number; // timestamp
  validateWork?: boolean;
}
