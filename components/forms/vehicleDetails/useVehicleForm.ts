"use client";

import { useState } from "react";
import { useGetPlans } from "@/hooks/useGetPlans";
import { VehicleFormData } from "./types";
import { validateVehicleForm } from "./validation";

interface UseVehicleFormProps {
  initialData?: VehicleFormData;
  onChange?: (data: VehicleFormData) => void;
}

export function useVehicleForm({
  initialData,
  onChange,
}: UseVehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>(
    initialData || {
      make: "",
      model: "",
      year: "",
      color: "",
      licensePlate: "",
      plan: "",
      planId: "",
      price: 0,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: plans, isLoading: plansLoading } = useGetPlans();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updatedData = { ...formData, [id]: value };
    
    setFormData(updatedData);
    
    // If onChange is provided, call it with the updated data
    if (onChange) {
      onChange(updatedData);
    }

    // Clear error when user types
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handlePlanChange = (value: string) => {
    // Find the selected plan to get its price and ID
    const selectedPlan = plans?.find((plan) => plan.name === value);
    const price = selectedPlan?.price || 0;
    const planId = selectedPlan?.id || "";

    const updatedData = { ...formData, plan: value, planId, price };
    setFormData(updatedData);
    
    // If onChange is provided, call it with the updated data
    if (onChange) {
      onChange(updatedData);
    }

    // Clear error when user selects a plan
    if (errors.plan) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.plan;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = validateVehicleForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    plans,
    plansLoading,
    handleChange,
    handlePlanChange,
    validateForm,
  };
}
