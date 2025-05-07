
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, X, LockOpen, ArrowRight, AlertTriangle } from "lucide-react";
import { useDeal, Milestone } from '@/context/DealContext';

interface MilestoneActionSheetProps {
  isOpen: boolean;
  milestone: Milestone | null;
  chatId: string;
  onClose: () => void;
  onDisputeClick: (milestone: Milestone) => void;
}

const MilestoneActionSheet: React.FC<MilestoneActionSheetProps> = ({
  isOpen,
  milestone,
  chatId,
  onClose,
  onDisputeClick
}) => {
  const { completeMilestone, releaseFunds } = useDeal();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !milestone) return null;

  const handleCompleteMilestone = async () => {
    setLoading(true);
    await completeMilestone(chatId, milestone.id);
    setLoading(false);
    onClose();
  };

  const handleReleaseFunds = async () => {
    setLoading(true);
    await releaseFunds(chatId, milestone.id);
    setLoading(false);
    onClose();
  };
  
  const handleDisputeClick = () => {
    onClose();
    onDisputeClick(milestone);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <Card className={`w-full max-w-md rounded-t-2xl p-4 animate-slide-up`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Milestone: {milestone.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-6 p-4 bg-lukso-primary/10 rounded-lg">
          <div className="flex justify-between items-center">
            <span>Amount</span>
            <span className="font-bold text-lukso-primary">{milestone.amount} LYX</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span>Status</span>
            <span className={`font-medium ${
              milestone.status === 'completed' ? 'text-green-500' : 
              milestone.status === 'active' ? 'text-lukso-primary' : 
              milestone.status === 'disputed' ? 'text-red-500' :
              'text-muted-foreground'
            }`}>
              {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          {milestone.status === 'active' && (
            <>
              <Button 
                onClick={handleCompleteMilestone}
                disabled={loading}
                className="bg-lukso-primary hover:bg-lukso-secondary text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Completed
              </Button>
              
              <Button 
                onClick={handleDisputeClick}
                disabled={loading}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Dispute Milestone
              </Button>
            </>
          )}
          
          {milestone.status === 'completed' && (
            <>
              <Button 
                onClick={handleReleaseFunds}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Release Funds
              </Button>
              
              <Button 
                onClick={handleDisputeClick}
                disabled={loading}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Dispute Milestone
              </Button>
            </>
          )}
          
          {milestone.status === 'locked' && (
            <Button 
              disabled={true}
              className="bg-muted text-muted-foreground"
            >
              <LockOpen className="mr-2 h-4 w-4" />
              Unlock (Previous milestone not completed)
            </Button>
          )}
          
          {milestone.status === 'disputed' && (
            <Button 
              onClick={handleDisputeClick}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              View Dispute
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MilestoneActionSheet;
