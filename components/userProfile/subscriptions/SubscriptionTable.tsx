"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubscriptionTableProps } from "./types";
import { SubscriptionTableRow } from "./SubscriptionTableRow";

export function SubscriptionTable({ 
  vehicleSubscriptions, 
  onEditClick, 
  onCancelClick 
}: SubscriptionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vehicle</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Next Billing</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicleSubscriptions.length > 0 ? (
          vehicleSubscriptions.map((subscription, index) => (
            <SubscriptionTableRow
              key={index}
              subscription={subscription}
              onEditClick={onEditClick}
              onCancelClick={onCancelClick}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6">
              <p className="text-muted-foreground">
                No subscriptions available
              </p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
