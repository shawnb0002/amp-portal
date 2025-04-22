"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SubscriptionTableRowProps } from "./types";

export function SubscriptionTableRow({ 
  subscription, 
  onEditClick, 
  onCancelClick 
}: SubscriptionTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>
            {subscription.vehicle.make} {subscription.vehicle.model}
          </span>
          <span className="text-xs text-muted-foreground">
            {subscription.vehicle.licensePlate}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{subscription.plan}</span>
          <span className="text-xs text-muted-foreground">
            ${subscription.price}/month
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={
            subscription.status === "active"
              ? "default"
              : subscription.status === "overdue"
              ? "destructive"
              : "secondary"
          }
          className="capitalize"
        >
          {subscription.status}
        </Badge>
      </TableCell>
      <TableCell>{subscription.nextBillingDate}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditClick(subscription)}>
              Edit vehicle
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => onCancelClick(subscription.subscriptionId)}
            >
              Cancel subscription
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
