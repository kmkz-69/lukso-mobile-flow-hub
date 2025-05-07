
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, AlertTriangle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useDeal, Milestone } from '@/context/DealContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DisputeActionSheetProps {
  isOpen: boolean;
  milestone: Milestone | null;
  chatId: string;
  onClose: () => void;
}

const DisputeActionSheet: React.FC<DisputeActionSheetProps> = ({
  isOpen,
  milestone,
  chatId,
  onClose
}) => {
  const { createDispute, resolveDispute } = useDeal();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [resolution, setResolution] = useState<'freelancer' | 'client'>('freelancer');
  const [step, setStep] = useState<'create' | 'resolve'>('create');
  
  if (!isOpen || !milestone) return null;
  
  const isDisputed = milestone.status === 'disputed';
  
  const handleCreateDispute = async () => {
    if (!reason.trim()) return;
    
    setLoading(true);
    await createDispute(chatId, milestone.id, reason);
    setLoading(false);
    setReason('');
    onClose();
  };
  
  const handleResolveDispute = async () => {
    setLoading(true);
    await resolveDispute(chatId, milestone.id, resolution === 'freelancer');
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <Card className={`w-full max-w-md rounded-t-2xl p-4 animate-slide-up`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            {isDisputed ? "Resolve Dispute" : "Create Dispute"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex justify-between items-center">
            <span>Milestone</span>
            <span className="font-bold">{milestone.title}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span>Amount</span>
            <span className="font-bold">{milestone.amount} LYX</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span>Status</span>
            <span className={`font-medium ${
              milestone.status === 'disputed' ? 'text-red-500' : 
              milestone.status === 'completed' ? 'text-green-500' : 
              milestone.status === 'active' ? 'text-lukso-primary' : 'text-muted-foreground'
            }`}>
              {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
            </span>
          </div>
        </div>

        {isDisputed ? (
          // Resolve dispute view
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              As an arbiter, you need to decide how to resolve this dispute:
            </div>
            
            <RadioGroup value={resolution} onValueChange={(v) => setResolution(v as 'freelancer' | 'client')}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-lukso-primary/20 bg-lukso-primary/5">
                <RadioGroupItem value="freelancer" id="freelancer" />
                <Label htmlFor="freelancer" className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                  Release funds to freelancer
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-red-500/20 bg-red-500/5 mt-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client" className="flex items-center">
                  <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                  Return funds to client
                </Label>
              </div>
            </RadioGroup>
            
            <Button 
              onClick={handleResolveDispute}
              disabled={loading}
              className="w-full bg-lukso-primary hover:bg-lukso-secondary text-white"
            >
              Resolve Dispute
            </Button>
          </div>
        ) : (
          // Create dispute view
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              Please provide a reason for the dispute:
            </div>
            
            <Textarea 
              placeholder="Explain why you're disputing this milestone..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="text-xs text-muted-foreground">
              Creating a dispute will involve a third-party arbiter who will review both sides and make a final decision.
            </div>
            
            <Button 
              onClick={handleCreateDispute}
              disabled={loading || !reason.trim()}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Submit Dispute
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DisputeActionSheet;
