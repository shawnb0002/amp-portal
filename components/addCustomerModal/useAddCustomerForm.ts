"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCreateCustomer } from "@/hooks/useCreateCustomer";
import { useCreateVehicle } from "@/hooks/useCreateVehicle";
import { useCreateSubscription } from "@/hooks/useCreateSubscription";
import { useCreateBillingInfo } from "@/hooks/useCreateBillingInfo";
import { useUpdateCustomerProfile } from "@/hooks/useUpdateCustomerProfile";
import { CustomerFormData } from "@/components/forms/CustomerDetailsForm";
import { VehicleFormData } from "@/components/forms/VehicleDetailsForm";
import { PaymentFormData } from "@/components/forms/PaymentDetailsForm";
import { validateCurrentStep } from "./validation";
import { AddCustomerFormData, STEPS } from "./types";

export function useAddCustomerForm(onSuccess: () => void) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  // Form data state
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
  });
  
  const [vehicleData, setVehicleData] = useState<VehicleFormData>({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    plan: "",
    planId: "",
    price: 0,
  });
  
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    billingDate: new Date().toISOString().split('T')[0],
    name_on_card: "",
    card_number: "",
    expiration: "",
    cvc: "",
  });
  
  // Mutations
  const createCustomerMutation = useCreateCustomer();
  const createVehicleMutation = useCreateVehicle();
  const createSubscriptionMutation = useCreateSubscription();
  const createBillingInfoMutation = useCreateBillingInfo();
  const updateCustomerProfileMutation = useUpdateCustomerProfile();
  
  // Loading state
  const isSubmitting = 
    createCustomerMutation.isPending || 
    createVehicleMutation.isPending || 
    createSubscriptionMutation.isPending ||
    createBillingInfoMutation.isPending ||
    updateCustomerProfileMutation.isPending;

  const formData: AddCustomerFormData = {
    customerData,
    vehicleData,
    paymentData
  };

  const validateStep = (): boolean => {
    const { isValid } = validateCurrentStep(currentStep, formData);
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
    
    return isValid;
  };

  const handleNext = () => {
    if (validateStep() && currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetForm = () => {
    setCustomerData({
      name: "",
      email: "",
      phone: "",
    });
    
    setVehicleData({
      make: "",
      model: "",
      year: "",
      color: "",
      licensePlate: "",
      plan: "",
      planId: "",
      price: 0,
    });
    
    setPaymentData({
      billingDate: new Date().toISOString().split('T')[0],
      name_on_card: "",
      card_number: "",
      expiration: "",
      cvc: "",
    });
    
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    // Validate the current step before submitting
    if (!validateStep()) {
      return;
    }
    
    try {
      // Check if email exists before submitting
      const emailCheckResponse = await fetch(`/api/check-email?email=${encodeURIComponent(customerData.email)}`);
      const { exists } = await emailCheckResponse.json();
      
      if (exists) {
        toast({
          title: "Email already exists",
          description: "A customer with this email address already exists.",
          variant: "destructive",
        });
        return;
      }
      
      // Step 1: Create customer
      const customer = await createCustomerMutation.mutateAsync(customerData);
      
      // Step 2: Create vehicle
      const vehicle = await createVehicleMutation.mutateAsync({
        user_id: customer.id,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        color: vehicleData.color,
        license_plate: vehicleData.licensePlate,
      });
      
      // Step 3: Create subscription
      await createSubscriptionMutation.mutateAsync({
        user_id: customer.id,
        vehicle_id: vehicle.id,
        plan_id: vehicleData.planId,
        start_date: new Date().toISOString().split('T')[0],
        next_billing_date: paymentData.billingDate || new Date().toISOString().split('T')[0],
      });
      
      // Update customer status to active
      await updateCustomerProfileMutation.mutateAsync({
        id: customer.id,
        status: "active"
      });
      
      // Step 4: Update billing info if payment details were provided
      if (paymentData.name_on_card && paymentData.card_number) {
        // Format expiration date from YYYY/MM/DD to YYYY-MM-DD if needed
        const formattedExpiration = paymentData.expiration.includes('/') 
          ? paymentData.expiration.replace(/\//g, '-')
          : paymentData.expiration;
          
        await createBillingInfoMutation.mutateAsync({
          user_id: customer.id,
          name_on_card: paymentData.name_on_card,
          card_number: paymentData.card_number,
          expiration: formattedExpiration,
          cvc: paymentData.cvc,
        });
      }
      
      toast({
        title: "Customer added successfully",
        description: `${customerData.name} has been added with a ${vehicleData.plan} subscription.`,
      });
      
      // Reset form and call onSuccess
      resetForm();
      onSuccess();
    } catch (error) {
      toast({
        title: "Error adding customer",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    currentStep,
    customerData,
    vehicleData,
    paymentData,
    isSubmitting,
    setCustomerData,
    setVehicleData,
    setPaymentData,
    handleNext,
    handleBack,
    handleSubmit,
    resetForm
  };
}
