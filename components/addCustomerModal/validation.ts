import { AddCustomerFormData } from "./types";

export function validateCustomerData(customerData: AddCustomerFormData["customerData"]) {
  const errors: Record<string, string> = {};
  
  if (!customerData.name.trim()) {
    errors.name = "Name is required";
  }
  
  if (!customerData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
    errors.email = "Invalid email format";
  }
  
  if (!customerData.phone.trim()) {
    errors.phone = "Phone number is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateVehicleData(vehicleData: AddCustomerFormData["vehicleData"]) {
  const errors: Record<string, string> = {};
  
  if (!vehicleData.make.trim()) {
    errors.make = "Make is required";
  }
  
  if (!vehicleData.model.trim()) {
    errors.model = "Model is required";
  }
  
  if (!vehicleData.year.trim()) {
    errors.year = "Year is required";
  }
  
  if (!vehicleData.licensePlate.trim()) {
    errors.licensePlate = "License plate is required";
  }
  
  if (!vehicleData.plan) {
    errors.plan = "Subscription plan is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateCurrentStep(
  currentStep: number, 
  formData: AddCustomerFormData
) {
  if (currentStep === 1) {
    return validateCustomerData(formData.customerData);
  } else if (currentStep === 2) {
    return validateVehicleData(formData.vehicleData);
  }
  
  return { isValid: true, errors: {} };
}
