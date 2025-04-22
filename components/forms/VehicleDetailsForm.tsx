import { VehicleDetailsFormProps } from "./vehicleDetails/types";
import { useVehicleForm } from "./vehicleDetails/useVehicleForm";
import { VehicleFormFields } from "./vehicleDetails/VehicleFormFields";

export type { VehicleFormData } from "./vehicleDetails/types";

export function VehicleDetailsForm({
  formData: propFormData,
  onChange,
}: VehicleDetailsFormProps) {
  const {
    formData,
    errors,
    plans,
    plansLoading,
    handleChange,
    handlePlanChange,
  } = useVehicleForm({
    initialData: propFormData,
    onChange,
  });

  return (
    <VehicleFormFields
      formData={formData}
      errors={errors}
      plans={plans}
      plansLoading={plansLoading}
      handleChange={handleChange}
      handlePlanChange={handlePlanChange}
    />
  );
}
