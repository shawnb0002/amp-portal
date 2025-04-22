export type VehicleFormData = {
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  plan: string;
  planId: string;
  price: number;
};

export interface VehicleDetailsFormProps {
  formData: VehicleFormData;
  onChange: (data: VehicleFormData) => void;
}
