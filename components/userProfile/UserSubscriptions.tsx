"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetVehicles } from "@/hooks/useGetVehicles";
import { useGetSubscriptions } from "@/hooks/useGetSubscriptions";
import { useGetPlans } from "@/hooks/useGetPlans";
import { useGetSubscriptionVehicles } from "@/hooks/useGetSubscriptionVehicles";
import { LoadingState } from "./subscriptions/LoadingState";
import { SubscriptionTable } from "./subscriptions/SubscriptionTable";
import { CancelSubscriptionDialog } from "./subscriptions/CancelSubscriptionDialog";
import { EditVehicleDialog } from "./subscriptions/EditVehicleDialog";
import { useSubscriptionHandlers } from "./subscriptions/useSubscriptionHandlers";
import { useTransformedSubscriptions } from "./subscriptions/useTransformedSubscriptions";
import { VehicleSubscription } from "./subscriptions/types";

interface UserSubscriptionsProps {
  userId: string;
}

export function UserSubscriptions({ userId }: UserSubscriptionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] = useState<string | null>(null);
  const [vehicleToEdit, setVehicleToEdit] = useState<VehicleSubscription | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    plan: "",
    planId: "",
    price: 0,
  });

  const { toast } = useToast();
  const { data: vehicles, isLoading: isLoadingVehicles } =
    useGetVehicles(userId);
  const { data: subscriptionsData, isLoading: isLoadingSubscriptions } =
    useGetSubscriptions(userId);
  const { data: plans, isLoading: isLoadingPlans } = useGetPlans();
  const {
    data: subscriptionVehicles,
    isLoading: isLoadingSubscriptionVehicles,
  } = useGetSubscriptionVehicles(userId);

  const {
    handleCancelClick,
    handleEditClick,
    handleUpdateVehicle,
    confirmCancellation,
  } = useSubscriptionHandlers({
    userId,
    plans,
    setIsDialogOpen,
    setSubscriptionToCancel,
    setIsEditDialogOpen,
    setVehicleToEdit,
    setEditFormData,
    toast,
    setIsSubmitting,
  });

  const vehicleSubscriptions = useTransformedSubscriptions(
    vehicles,
    subscriptionsData,
    plans,
    subscriptionVehicles
  );

  const isLoading =
    isLoadingVehicles ||
    isLoadingSubscriptions ||
    isLoadingPlans ||
    isLoadingSubscriptionVehicles;

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Vehicle Subscriptions</CardTitle>
          <CardDescription>Active membership plans</CardDescription>
        </div>
      </CardHeader>

      <CancelSubscriptionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={() => {
          setIsSubmitting(true);
          confirmCancellation(subscriptionToCancel);
        }}
        isLoading={isSubmitting}
      />

      <EditVehicleDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={() => {
          setIsSubmitting(true);
          handleUpdateVehicle(vehicleToEdit, editFormData);
        }}
        formData={editFormData}
        onFormChange={setEditFormData}
        isLoading={isSubmitting}
      />

      <CardContent className="p-0">
        <SubscriptionTable
          vehicleSubscriptions={vehicleSubscriptions}
          onEditClick={handleEditClick}
          onCancelClick={handleCancelClick}
        />
      </CardContent>
    </Card>
  );
}
