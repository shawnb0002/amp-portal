"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status?: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = 
    status === "active" 
      ? "default" 
      : status === "overdue" 
        ? "destructive" 
        : "secondary";
  
  return (
    <Badge variant={variant}>
      {status || "unknown"}
    </Badge>
  );
}
