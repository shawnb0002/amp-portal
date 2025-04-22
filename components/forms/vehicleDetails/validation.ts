import { VehicleFormData } from "./types";

export const validateVehicleForm = (formData: VehicleFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.plan) {
    errors.plan = "Subscription plan is required";
  }

  if (!formData.make.trim()) {
    errors.make = "Make is required";
  }

  if (!formData.model.trim()) {
    errors.model = "Model is required";
  }

  if (!formData.year.trim()) {
    errors.year = "Year is required";
  } else if (!/^\d{4}$/.test(formData.year)) {
    errors.year = "Year must be a 4-digit number";
  }

  if (!formData.color.trim()) {
    errors.color = "Color is required";
  }

  if (!formData.licensePlate.trim()) {
    errors.licensePlate = "License plate is required";
  }

  return errors;
};
