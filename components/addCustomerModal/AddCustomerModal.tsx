"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomerDetailsForm } from "@/components/forms/CustomerDetailsForm";
import { VehicleDetailsForm } from "@/components/forms/VehicleDetailsForm";
import { PaymentDetailsForm } from "@/components/forms/PaymentDetailsForm";
import { StepIndicator } from "./StepIndicator";
import { FormNavigation } from "./FormNavigation";
import { useAddCustomerForm } from "./useAddCustomerForm";

export function AddCustomerModal() {
  const [open, setOpen] = useState(false);
  
  const {
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
    handleSubmit
  } = useAddCustomerForm(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Customer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <StepIndicator currentStep={currentStep} />

          <div className="min-h-[300px]">
            {currentStep === 1 && (
              <CustomerDetailsForm 
                formData={customerData} 
                onChange={setCustomerData} 
              />
            )}
            {currentStep === 2 && (
              <VehicleDetailsForm 
                formData={vehicleData} 
                onChange={setVehicleData} 
              />
            )}
            {currentStep === 3 && (
              <PaymentDetailsForm 
                formData={paymentData} 
                onChange={setPaymentData}
                onSuccess={handleSubmit}
              />
            )}
          </div>

          <FormNavigation
            currentStep={currentStep}
            isSubmitting={isSubmitting}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
