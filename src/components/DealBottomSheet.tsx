
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface DealBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, autoApprove: boolean) => void;
}

const DealBottomSheet: React.FC<DealBottomSheetProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [amount, setAmount] = useState(5);
  const [autoApprove, setAutoApprove] = useState(false);
  const estimatedGas = 0.002;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <Card className={`w-full max-w-md rounded-t-2xl p-4 animate-slide-up`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Book Milestone Deal</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Amount (LYX)</span>
            <span className="font-medium text-lukso-primary">{amount.toFixed(1)} LYX</span>
          </div>
          <Slider 
            value={[amount]} 
            min={1} 
            max={20} 
            step={0.1} 
            onValueChange={([val]) => setAmount(val)}
            className="lukso-gradient"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 LYX</span>
            <span>20 LYX</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 p-3 bg-lukso-primary/5 rounded-lg">
          <div className="flex flex-col">
            <Label htmlFor="auto-approve" className="text-sm">Allow auto-approval (LSP1)</Label>
            <span className="text-xs text-muted-foreground">Freelancer can release funds on completion</span>
          </div>
          <Switch 
            id="auto-approve"
            checked={autoApprove}
            onCheckedChange={setAutoApprove}
            className="data-[state=checked]:bg-lukso-primary"
          />
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          <div className="flex justify-between mb-1">
            <span>Deal Amount</span>
            <span>{amount.toFixed(1)} LYX</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Estimated Gas</span>
            <span>{estimatedGas} LYX</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{(amount + estimatedGas).toFixed(3)} LYX</span>
          </div>
        </div>

        <Button 
          onClick={() => onConfirm(amount, autoApprove)}
          className="w-full bg-lukso-primary hover:bg-lukso-secondary text-white"
        >
          Confirm & Sign with UP
        </Button>
      </Card>
    </div>
  );
};

export default DealBottomSheet;
