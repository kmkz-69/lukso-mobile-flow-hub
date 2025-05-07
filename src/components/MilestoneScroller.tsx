
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Check, Clock, Lock } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  amount: string;
  status: 'completed' | 'active' | 'locked';
}

interface MilestoneScrollerProps {
  milestones: Milestone[];
  onMilestoneClick?: (milestone: Milestone) => void;
}

const MilestoneScroller: React.FC<MilestoneScrollerProps> = ({ 
  milestones,
  onMilestoneClick 
}) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-4 p-4">
        {milestones.map((milestone) => (
          <div 
            key={milestone.id}
            className={`
              flex flex-col space-y-1 p-3 rounded-md w-44 cursor-pointer squish-button
              ${milestone.status === 'completed' ? 'bg-green-500/10 border border-green-500/20' : 
                milestone.status === 'active' ? 'bg-lukso-primary/10 border border-lukso-primary/20' : 
                'bg-gray-500/10 border border-gray-500/20'}
            `}
            onClick={() => onMilestoneClick?.(milestone)}
          >
            <div className="flex justify-between items-center">
              <Badge 
                variant="outline" 
                className={`
                  text-xs px-2
                  ${milestone.status === 'completed' ? 'bg-green-500/20 text-green-500' : 
                    milestone.status === 'active' ? 'bg-lukso-primary/20 text-lukso-primary' : 
                    'bg-gray-500/20 text-gray-400'}
                `}
              >
                {milestone.status === 'completed' ? (
                  <><Check className="w-3 h-3 mr-1" /> Complete</>
                ) : milestone.status === 'active' ? (
                  <><Clock className="w-3 h-3 mr-1" /> Active</>
                ) : (
                  <><Lock className="w-3 h-3 mr-1" /> Locked</>
                )}
              </Badge>
            </div>
            <h4 className="text-sm font-medium truncate">{milestone.title}</h4>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground">Value:</span>
              <span className="text-xs font-medium">{milestone.amount} LYX</span>
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default MilestoneScroller;
