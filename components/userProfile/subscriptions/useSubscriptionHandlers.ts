import { useToast } from "@/components/ui/use-toast";
import { useCancelSubscription } from "@/hooks/useCancelSubscription";
import { useUpdateVehicle } from "@/hooks/useUpdateVehicle";
import { useUpdateSubscription } from "@/hooks/useUpdateSubscription";
import { useCreateSubscription } from "@/hooks/useCreateSubscription";
import { VehicleFormData } from "@/components/forms/vehicleDetails/types";
import { VehicleSubscription } from "./types";
import { Plan } from "@/hooks/useGetPlans";

interface SubscriptionHandlersProps {
  userId: string;
  plans: Plan[] | undefined;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSubscriptionToCancel: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setVehicleToEdit: React.Dispatch<React.SetStateAction<VehicleSubscription | null>>;
  setEditFormData: React.Dispatch<React.SetStateAction<VehicleFormData>>;
  toast: ReturnType<typeof useToast>["toast"];
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useSubscriptionHandlers({
  userId,
  plans,
  setIsDialogOpen,
  setSubscriptionToCancel,
  setIsEditDialogOpen,
  setVehicleToEdit,
  setEditFormData,
  toast,
  setIsSubmitting,
}: SubscriptionHandlersProps) {
  const { mutate: cancelSubscription } = useCancelSubscription();
  const { mutate: updateVehicle } = useUpdateVehicle();
  const { mutate: updateSubscription } = useUpdateSubscription();
  const { mutate: createSubscription } = useCreateSubscription();

  const handleCancelClick = (subscriptionId: string) => {
    setSubscriptionToCancel(subscriptionId);
    setIsDialogOpen(true);
  };

  const handleEditClick = (vehicle: VehicleSubscription) => {
    setVehicleToEdit(vehicle);
    const selectedPlan = plans?.find((plan) => plan.name === vehicle.plan);
    setEditFormData({
      make: vehicle.vehicle.make,
      model: vehicle.vehicle.model,
      year: vehicle.vehicle.year,
      color: vehicle.vehicle.color,
      licensePlate: vehicle.vehicle.licensePlate,
      plan: vehicle.plan,
      planId: selectedPlan?.id || "",
      price: vehicle.price,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateVehicle = (vehicleToEdit: VehicleSubscription | null, editFormData: VehicleFormData) => {
    if (!vehicleToEdit) return;

    const selectedPlan = plans?.find((plan) => plan.name === editFormData.plan);
    const plan_id = selectedPlan?.id;

    if (!plan_id) {
      toast({
        title: "Error",
        description: "Selected plan not found",
        variant: "destructive",
      });
      return;
    }

    updateVehicle(
      {
        id: vehicleToEdit.vehicle.id,
        make: editFormData.make,
        model: editFormData.model,
        year: editFormData.year,
        color: editFormData.color,
        license_plate: editFormData.licensePlate,
      },
      {
        onSuccess: () => {
          if (vehicleToEdit.subscriptionId) {
            updateSubscription(
              {
                id: vehicleToEdit.subscriptionId,
                plan_id: plan_id,
                status: "active",
              },
              {
                onSuccess: () => {
                  toast({
                    title: "Success",
                    description: "Vehicle and subscription updated successfully.",
                  });
                  setIsEditDialogOpen(false);
                  setVehicleToEdit(null);
                  if (setIsSubmitting) setIsSubmitting(false);
                },
                onError: (error) => {
                  toast({
                    title: "Error",
                    description: `Failed to update subscription: ${error.message}`,
                    variant: "destructive",
                  });
                  if (setIsSubmitting) setIsSubmitting(false);
                },
              }
            );
          } else {
            createSubscription(
              {
                user_id: userId,
                vehicle_id: vehicleToEdit.vehicle.id,
                plan_id: plan_id,
                status: "active",
              },
              {
                onSuccess: () => {
                  toast({
                    title: "Success",
                    description: "Vehicle updated and subscription created successfully.",
                  });
                  setIsEditDialogOpen(false);
                  setVehicleToEdit(null);
                  if (setIsSubmitting) setIsSubmitting(false);
                },
                onError: (error) => {
                  toast({
                    title: "Error",
                    description: `Failed to create subscription: ${error.message}`,
                    variant: "destructive",
                  });
                  if (setIsSubmitting) setIsSubmitting(false);
                },
              }
            );
          }
        },
        onError: (error) => {
          toast({
            title: "Error",
          description: `Failed to update vehicle: ${error.message}`,
          variant: "destructive",
        });
        if (setIsSubmitting) setIsSubmitting(false);
        },
      }
    );
  };

  const confirmCancellation = (subscriptionToCancel: string | null) => {
    if (!subscriptionToCancel) return;

    cancelSubscription(
      { subscriptionId: subscriptionToCancel },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Subscription canceled successfully.",
          });
          setIsDialogOpen(false);
          setSubscriptionToCancel(null);
          if (setIsSubmitting) setIsSubmitting(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to cancel subscription: ${error.message}`,
            variant: "destructive",
          });
          if (setIsSubmitting) setIsSubmitting(false);
        },
      }
    );
  };

  return {
    handleCancelClick,
    handleEditClick,
    handleUpdateVehicle,
    confirmCancellation,
  };
}
