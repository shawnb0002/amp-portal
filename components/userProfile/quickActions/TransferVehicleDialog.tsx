"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Car, Loader2 } from "lucide-react";
import { VehicleSelectionTable } from "./VehicleSelectionTable";
import { SelectedVehiclesList } from "./SelectedVehiclesList";
import { VehicleWithSubscription } from "./types";
import { Subscription } from "@/hooks/useGetSubscriptions";

interface TransferVehicleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  vehiclesWithSubscriptions: VehicleWithSubscription[];
  selectedVehicles: string[];
  onVehicleSelect: (vehicleId: string) => void;
  onConfirmTransfer: () => void;
  isLoading: boolean;
  subscriptions?: Subscription[];
}

export function TransferVehicleDialog({
  isOpen,
  onOpenChange,
  vehiclesWithSubscriptions,
  selectedVehicles,
  onVehicleSelect,
  onConfirmTransfer,
  isLoading,
  subscriptions,
}: TransferVehicleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-auto flex flex-col py-4 px-3 gap-1 items-center justify-center"
        >
          <Car className="h-5 w-5 text-primary" />
          <span className="text-sm">Transfer Vehicle</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Transfer Vehicle Subscription</DialogTitle>
          <DialogDescription>
            Select two vehicles: first the source vehicle with the subscription
            you want to transfer, then the target vehicle that will receive the
            subscription.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 p-3 rounded-md mb-4 text-sm">
              <p className="font-medium mb-1">
                How to transfer a subscription:
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>
                  First, select a vehicle with an active subscription (indicated
                  by the &quot;Has Subscription&quot; badge)
                </li>
                <li>
                  Then, select the vehicle you want to transfer the subscription
                  to
                </li>
                <li>
                  Click the &quot;Transfer Subscription&quot; button to complete
                  the process
                </li>
              </ol>
            </div>
            
            <VehicleSelectionTable
              vehiclesWithSubscriptions={vehiclesWithSubscriptions}
              selectedVehicles={selectedVehicles}
              onVehicleSelect={onVehicleSelect}
              subscriptions={subscriptions}
            />

            <SelectedVehiclesList
              selectedVehicles={selectedVehicles}
              vehiclesWithSubscriptions={vehiclesWithSubscriptions}
            />
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={selectedVehicles.length !== 2}
            onClick={onConfirmTransfer}
          >
            Transfer Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
