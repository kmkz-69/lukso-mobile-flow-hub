
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AiSuggestionCardProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  type: 'deal' | 'escrow' | 'dispute';
}

const AiSuggestionCard: React.FC<AiSuggestionCardProps> = ({
  title,
  description,
  actionText,
  onAction,
  type
}) => {
  return (
    <Card className={`
      p-4 mx-auto my-4 max-w-[85%] border
      ${type === 'deal' ? 'border-lukso-primary/30 bg-lukso-primary/5' :
        type === 'escrow' ? 'border-lukso-vivid/30 bg-lukso-vivid/5' : 
        'border-red-500/30 bg-red-500/5'}
    `}>
      <div className="flex flex-col space-y-3">
        <div className="flex items-start">
          <div className={`
            rounded-full w-8 h-8 flex items-center justify-center mr-2
            ${type === 'deal' ? 'bg-lukso-primary/20' :
              type === 'escrow' ? 'bg-lukso-vivid/20' : 
              'bg-red-500/20'}
          `}>
            <span className="text-sm font-bold">AI</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold mb-1">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button 
          onClick={onAction} 
          size="sm"
          className={`
            w-full
            ${type === 'deal' ? 'bg-lukso-primary hover:bg-lukso-secondary' :
              type === 'escrow' ? 'bg-lukso-vivid hover:bg-lukso-secondary' : 
              'bg-red-500 hover:bg-red-600'}
            text-white
          `}
        >
          {actionText}
        </Button>
      </div>
    </Card>
  );
};

export default AiSuggestionCard;
