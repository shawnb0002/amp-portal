"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { VehicleWithSubscription } from "./types";

interface ConfirmTransferDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isTransferring: boolean;
  selectedVehicles: string[];
  vehiclesWithSubscriptions: VehicleWithSubscription[];
}

export function ConfirmTransferDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isTransferring,
  selectedVehicles,
  vehiclesWithSubscriptions,
}: ConfirmTransferDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Subscription Transfer</DialogTitle>
          <DialogDescription>
            Are you sure you want to transfer this subscription? This action
            will move the subscription from one vehicle to another.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {selectedVehicles.length === 2 && (
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <h4 className="text-sm font-medium mb-2">From:</h4>
                {(() => {
                  const vehicle = vehiclesWithSubscriptions.find(
                    (v) => v.id === selectedVehicles[0]
                  );
                  return vehicle ? (
                    <div>
                      <p className="font-medium">
                        {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.licensePlate}
                      </p>
                      <p className="text-sm mt-1">Plan: {vehicle.plan}</p>
                    </div>
                  ) : null;
                })()}
              </div>
              <div className="border rounded-md p-3">
                <h4 className="text-sm font-medium mb-2">To:</h4>
                {(() => {
                  const vehicle = vehiclesWithSubscriptions.find(
                    (v) => v.id === selectedVehicles[1]
                  );
                  return vehicle ? (
                    <div>
                      <p className="font-medium">
                        {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.licensePlate}
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isTransferring}>
            {isTransferring ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferring...
              </>
            ) : (
              "Confirm Transfer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
