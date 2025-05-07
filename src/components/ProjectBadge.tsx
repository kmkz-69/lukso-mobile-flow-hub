
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ProjectBadgeProps {
  id: string;
  title: string;
}

const ProjectBadge: React.FC<ProjectBadgeProps> = ({ id, title }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge 
          variant="outline" 
          className="cursor-pointer lukso-gradient text-white font-medium py-1 px-3"
        >
          {id}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 glass-card">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Project Details (LSP8 Metadata)</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-muted-foreground">Project ID:</div>
            <div>{id}</div>
            <div className="text-muted-foreground">Title:</div>
            <div>{title}</div>
            <div className="text-muted-foreground">Token Standard:</div>
            <div>LSP8 (Identifiable Digital Asset)</div>
            <div className="text-muted-foreground">Blockchain:</div>
            <div>LUKSO</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ProjectBadge;
