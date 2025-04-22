"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTransferSubscription } from "@/hooks/useTransferSubscription";
import { VehicleWithSubscription } from "./types";
import { Subscription } from "@/hooks/useGetSubscriptions";

interface UseVehicleTransferProps {
  vehiclesWithSubscriptions: VehicleWithSubscription[];
  subscriptions: Subscription[] | undefined;
}

interface UseVehicleTransferReturn {
  selectedVehicles: string[];
  handleVehicleSelect: (vehicleId: string) => void;
  handleConfirmTransfer: () => void;
  handleTransferSubmit: () => void;
  isTransferring: boolean;
  resetSelection: () => void;
}

export function useVehicleTransfer({
  vehiclesWithSubscriptions,
  subscriptions,
}: UseVehicleTransferProps): UseVehicleTransferReturn {
  const { toast } = useToast();
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const { mutate: transferSubscription, isPending: isTransferring } =
    useTransferSubscription();

  const handleVehicleSelect = (vehicleId: string) => {
    const selectedVehicle = vehiclesWithSubscriptions.find(
      (v) => v.id === vehicleId
    );

    setSelectedVehicles((prev) => {
      // If already selected, remove it
      if (prev.includes(vehicleId)) {
        return prev.filter((id) => id !== vehicleId);
      }

      // If this is the first selection, ensure it has a subscription
      if (prev.length === 0) {
        // Check if the vehicle has a subscription
        if (!selectedVehicle?.subscriptionId) {
          toast({
            title: "Invalid Selection",
            description:
              "The first selected vehicle must have an active subscription to transfer.",
            variant: "destructive",
          });
          return prev;
        }
      }

      // If we already have 2 selections, replace the oldest one
      if (prev.length >= 2) {
        return [prev[1], vehicleId];
      }

      // Otherwise add it to the selections
      return [...prev, vehicleId];
    });
  };

  const handleConfirmTransfer = () => {
    // This function will be called to open the confirmation dialog
    // The actual implementation will be in the component
  };

  const handleTransferSubmit = () => {
    // Validate that the first vehicle has a subscription
    const sourceVehicle = vehiclesWithSubscriptions.find(
      (v) => v.id === selectedVehicles[0]
    );
    const targetVehicle = vehiclesWithSubscriptions.find(
      (v) => v.id === selectedVehicles[1]
    );

    if (!sourceVehicle?.subscriptionId) {
      toast({
        title: "Transfer Failed",
        description:
          "The source vehicle does not have an active subscription to transfer.",
        variant: "destructive",
      });
      return;
    }

    // Find the subscription for the source vehicle
    const sourceSubscription = subscriptions?.find(
      (sub) => sub.id === sourceVehicle.subscriptionId
    );

    if (!sourceSubscription) {
      toast({
        title: "Transfer Failed",
        description: "Could not find the source subscription details.",
        variant: "destructive",
      });
      return;
    }

    // Call the mutation to transfer the subscription
    transferSubscription(
      {
        fromVehicleId: sourceVehicle.id,
        toVehicleId: targetVehicle?.id || "",
        subscriptionId: sourceVehicle.subscriptionId,
      },
      {
        onSuccess: () => {
          // Show success toast
          toast({
            title: "Subscription Transferred",
            description: `Successfully transferred subscription from ${sourceVehicle.make} ${sourceVehicle.model} to ${targetVehicle?.make} ${targetVehicle?.model}.`,
          });

          // Reset selections
          setSelectedVehicles([]);
        },
        onError: (error) => {
          toast({
            title: "Transfer Failed",
            description:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
            variant: "destructive",
          });
        },
      }
    );
  };

  const resetSelection = () => {
    setSelectedVehicles([]);
  };

  return {
    selectedVehicles,
    handleVehicleSelect,
    handleConfirmTransfer,
    handleTransferSubmit,
    isTransferring,
    resetSelection,
  };
}
