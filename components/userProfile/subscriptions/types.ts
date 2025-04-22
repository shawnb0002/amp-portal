
import { VehicleFormData } from "@/components/forms/VehicleDetailsForm";

// Vehicle subscription interface
export interface VehicleSubscription {
  vehicle: {
    id: string;
    make: string;
    model: string;
    licensePlate: string;
    year: string;
    color: string;
  };
  plan: string;
  price: number;
  status: string;
  nextBillingDate: string;
  subscriptionId: string;
}

// Component props interfaces
export interface UserSubscriptionsProps {
  userId: string;
}

export interface LoadingStateProps {
  title?: string;
  description?: string;
}

export interface ErrorStateProps {
  errorMessage: string;
  title?: string;
  description?: string;
}

export interface SubscriptionTableRowProps {
  subscription: VehicleSubscription;
  onEditClick: (subscription: VehicleSubscription) => void;
  onCancelClick: (subscriptionId: string) => void;
}

export interface SubscriptionTableProps {
  vehicleSubscriptions: VehicleSubscription[];
  onEditClick: (subscription: VehicleSubscription) => void;
  onCancelClick: (subscriptionId: string) => void;
}

export interface CancelSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export interface EditVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: VehicleFormData;
  onFormChange: (data: VehicleFormData) => void;
  isLoading: boolean;
}
