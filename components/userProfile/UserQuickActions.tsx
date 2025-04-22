"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useGetVehicles } from "@/hooks/useGetVehicles";
import { useGetSubscriptions } from "@/hooks/useGetSubscriptions";
import { useGetPlans } from "@/hooks/useGetPlans";
import { useGetSubscriptionVehicles } from "@/hooks/useGetSubscriptionVehicles";
import { PaymentDialog } from "./quickActions/PaymentDialog";
import { TransferVehicleDialog } from "./quickActions/TransferVehicleDialog";
import { ConfirmTransferDialog } from "./quickActions/ConfirmTransferDialog";
import { useVehicleTransfer } from "./quickActions/useVehicleTransfer";
import { combineVehicleAndSubscriptionData } from "./quickActions/utils";

export function UserQuickActions() {
  const params = useParams();
  const userId = typeof params?.userId === "string" ? params.userId : "";
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTransferVehicleModalOpen, setIsTransferVehicleModalOpen] = useState(false);
  const [isConfirmTransferModalOpen, setIsConfirmTransferModalOpen] = useState(false);

  // Fetch data
  const { data: vehicles, isLoading: isLoadingVehicles } = useGetVehicles(userId);
  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useGetSubscriptions(userId);
  const { data: plans, isLoading: isLoadingPlans } = useGetPlans();
  const { data: subscriptionVehicles, isLoading: isLoadingSubscriptionVehicles } = 
    useGetSubscriptionVehicles(userId);

  // Combine vehicle and subscription data
  const vehiclesWithSubscriptions = combineVehicleAndSubscriptionData(
    vehicles,
    subscriptions,
    plans,
    subscriptionVehicles
  );

  const isLoading =
    isLoadingVehicles ||
    isLoadingSubscriptions ||
    isLoadingPlans ||
    isLoadingSubscriptionVehicles;

  // Use the custom hook for vehicle transfer functionality
  const {
    selectedVehicles,
    handleVehicleSelect,
    handleTransferSubmit,
    isTransferring,
    resetSelection
  } = useVehicleTransfer({
    vehiclesWithSubscriptions,
    subscriptions
  });

  const handleConfirmTransfer = () => {
    setIsConfirmTransferModalOpen(true);
  };

  const handleTransferComplete = () => {
    // Close modals and reset selection
    setIsConfirmTransferModalOpen(false);
    setIsTransferVehicleModalOpen(false);
    resetSelection();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common customer service tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {/* Payment Dialog */}
          <PaymentDialog
            userId={userId}
            isOpen={isPaymentModalOpen}
            onOpenChange={setIsPaymentModalOpen}
          />

          {/* Transfer Vehicle Dialog */}
          <TransferVehicleDialog
            isOpen={isTransferVehicleModalOpen}
            onOpenChange={setIsTransferVehicleModalOpen}
            vehiclesWithSubscriptions={vehiclesWithSubscriptions}
            selectedVehicles={selectedVehicles}
            onVehicleSelect={handleVehicleSelect}
            onConfirmTransfer={handleConfirmTransfer}
            isLoading={isLoading}
            subscriptions={subscriptions}
          />

          {/* Confirm Transfer Dialog */}
          <ConfirmTransferDialog
            isOpen={isConfirmTransferModalOpen}
            onOpenChange={setIsConfirmTransferModalOpen}
            onConfirm={() => {
              handleTransferSubmit();
              handleTransferComplete();
            }}
            isTransferring={isTransferring}
            selectedVehicles={selectedVehicles}
            vehiclesWithSubscriptions={vehiclesWithSubscriptions}
          />
        </div>
      </CardContent>
    </Card>
  );
}
