import { CustomerFormData } from "@/components/forms/CustomerDetailsForm";
import { VehicleFormData } from "@/components/forms/VehicleDetailsForm";
import { PaymentFormData } from "@/components/forms/PaymentDetailsForm";

export interface AddCustomerFormData {
  customerData: CustomerFormData;
  vehicleData: VehicleFormData;
  paymentData: PaymentFormData;
}

export const STEPS = [
  { id: 1, name: "Customer Details" },
  { id: 2, name: "Vehicle Details" },
  { id: 3, name: "Payment Details" },
];
