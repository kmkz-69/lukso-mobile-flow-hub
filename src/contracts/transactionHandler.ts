
/**
 * Handlers for LUKSO blockchain transactions
 */

import { toast } from "@/hooks/use-toast";

// Transaction status
export type TransactionStatus = 
  | "pending"   // Transaction is being created/signed
  | "submitted" // Transaction has been submitted to the network
  | "confirmed" // Transaction has been confirmed (mined)
  | "failed"    // Transaction failed
  | "rejected"  // Transaction was rejected by the user

// Transaction receipt
export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  effectiveGasPrice: string;
  status: boolean; // true if successful
  events?: Record<string, any>;
}

// Transaction metadata
export interface TransactionMeta {
  title: string;
  description: string;
  type: "milestone" | "release" | "dispute" | "resolution" | "other";
  value?: string;
  to?: string;
  contractAddress?: string;
}

// Transaction object
export interface Transaction {
  id: string;
  hash?: string;
  status: TransactionStatus;
  meta: TransactionMeta;
  createdAt: number;
  updatedAt: number;
  receipt?: TransactionReceipt;
  error?: string;
}

// Transaction event callbacks
export interface TransactionCallbacks {
  onSubmitted?: (txHash: string) => void;
  onConfirmed?: (receipt: TransactionReceipt) => void;
  onFailed?: (error: Error) => void;
  onRejected?: () => void;
}

// Storage for pending transactions
const pendingTransactions = new Map<string, Transaction>();

// Submit transaction to LUKSO network
export const submitTransaction = async (
  method: () => Promise<any>,
  meta: TransactionMeta,
  callbacks?: TransactionCallbacks
): Promise<string> => {
  // Create transaction ID
  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  // Initialize transaction object
  const tx: Transaction = {
    id: txId,
    status: "pending",
    meta,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  // Store in pending transactions
  pendingTransactions.set(txId, tx);
  
  try {
    // Show pending toast
    toast({
      title: meta.title,
      description: `${meta.description} (Awaiting signature)`,
    });
    
    // Execute transaction method
    const result = await method();
    
    // Handle different response formats
    const txHash = typeof result === 'string' ? result : 
                  result?.hash ? result.hash : 
                  `mock_${Math.random().toString(36).substring(2, 15)}`;
    
    // Update transaction with hash
    tx.hash = txHash;
    tx.status = "submitted";
    tx.updatedAt = Date.now();
    pendingTransactions.set(txId, {...tx});
    
    // Notify of submission
    toast({
      title: meta.title,
      description: `${meta.description} (Submitted)`,
    });
    
    callbacks?.onSubmitted?.(txHash);
    
    // Simulate confirmation process
    await waitForConfirmation(txId, txHash);
    
    return txId;
  } catch (error: any) {
    console.error("Transaction error:", error);
    
    // Check if user rejected
    const isRejected = error.message?.includes("rejected") || 
                      error.message?.includes("denied") ||
                      error.message?.includes("cancelled") ||
                      error.code === 4001;
    
    // Update transaction status
    tx.status = isRejected ? "rejected" : "failed";
    tx.error = error.message || "Unknown error";
    tx.updatedAt = Date.now();
    pendingTransactions.set(txId, {...tx});
    
    // Show error toast
    toast({
      title: isRejected ? "Transaction Rejected" : "Transaction Failed",
      description: isRejected ? 
        "You rejected the transaction signature" : 
        `Error: ${error.message?.substring(0, 100) || "Unknown error"}`,
      variant: "destructive",
    });
    
    // Trigger appropriate callback
    if (isRejected) {
      callbacks?.onRejected?.();
    } else {
      callbacks?.onFailed?.(error);
    }
    
    return txId;
  }
};

// Wait for transaction confirmation
const waitForConfirmation = async (txId: string, txHash: string): Promise<TransactionReceipt> => {
  // Get transaction from storage
  const tx = pendingTransactions.get(txId);
  if (!tx) throw new Error("Transaction not found");
  
  try {
    // Simulate blockchain confirmation (would be replaced with actual blockchain polling)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock receipt
    const receipt: TransactionReceipt = {
      transactionHash: txHash,
      blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
      gasUsed: (Math.floor(Math.random() * 100000) + 50000).toString(),
      effectiveGasPrice: (Math.floor(Math.random() * 100) + 10).toString(),
      status: true,
      events: {}
    };
    
    // Update transaction with receipt
    tx.status = "confirmed";
    tx.receipt = receipt;
    tx.updatedAt = Date.now();
    pendingTransactions.set(txId, {...tx});
    
    // Show success toast
    toast({
      title: "Transaction Confirmed",
      description: `${tx.meta.description} has been confirmed`,
    });
    
    return receipt;
  } catch (error: any) {
    console.error("Confirmation error:", error);
    
    // Update transaction status
    tx.status = "failed";
    tx.error = error.message || "Failed to confirm transaction";
    tx.updatedAt = Date.now();
    pendingTransactions.set(txId, {...tx});
    
    // Show error toast
    toast({
      title: "Confirmation Failed",
      description: `Error: ${error.message?.substring(0, 100) || "Unknown error"}`,
      variant: "destructive",
    });
    
    throw error;
  }
};

// Get all pending transactions
export const getPendingTransactions = (): Transaction[] => {
  return Array.from(pendingTransactions.values())
    .filter(tx => tx.status === "pending" || tx.status === "submitted")
    .sort((a, b) => b.updatedAt - a.updatedAt);
};

// Get transaction by ID
export const getTransaction = (txId: string): Transaction | undefined => {
  return pendingTransactions.get(txId);
};

// Get all transactions
export const getAllTransactions = (): Transaction[] => {
  return Array.from(pendingTransactions.values())
    .sort((a, b) => b.updatedAt - a.updatedAt);
};