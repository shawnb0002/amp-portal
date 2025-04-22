"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateBilling } from "@/hooks/useUpdateBilling";
import { useGetBillingInfo } from "@/hooks/useGetBillingInfo";
import { PaymentFormData } from "./types";
import { validatePaymentForm } from "./validation";

interface UsePaymentFormProps {
  initialData?: PaymentFormData;
  userId?: string;
  onChange?: (data: PaymentFormData) => void;
  onSuccess?: () => void;
}

export function usePaymentForm({
  initialData,
  userId,
  onChange,
  onSuccess,
}: UsePaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>(
    initialData || {
      billingDate: "",
      name_on_card: "",
      card_number: "",
      expiration: "",
      cvc: "",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  // Only fetch billing info if userId is provided
  const { data: billingInfo, isLoading, error } = useGetBillingInfo(userId || "");
  const updateBillingMutation = useUpdateBilling();

  // Update form data when billing info is loaded (only if userId is provided)
  useEffect(() => {
    if (userId && billingInfo) {
      // Convert expiration date format from YYYY-MM-DD to YYYY/MM/DD for display
      const formattedExpiration = billingInfo.expiration
        ? billingInfo.expiration.replace(/-/g, "/")
        : "";

      const updatedData = {
        billingDate: "",
        name_on_card: billingInfo.name_on_card || "",
        card_number: billingInfo.card_number || "",
        expiration: formattedExpiration,
        cvc: billingInfo.cvc || "",
      };
      
      setFormData(updatedData);
      
      // If onChange is provided, call it with the updated data
      if (onChange) {
        onChange(updatedData);
      }
    }
  }, [billingInfo, userId, onChange]);

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

  const validateForm = () => {
    const newErrors = validatePaymentForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    // Only proceed with update if userId is provided
    if (userId) {
      try {
        // Convert expiration date format from YYYY/MM/DD to YYYY-MM-DD
        const formattedExpiration = formData.expiration.replace(/\//g, "-");

        await updateBillingMutation.mutateAsync({
          user_id: userId,
          name_on_card: formData.name_on_card,
          card_number: formData.card_number,
          expiration: formattedExpiration,
          cvc: formData.cvc,
        });

        toast({
          title: "Payment information updated",
          description: "Payment details have been successfully updated.",
          variant: "default",
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        toast({
          title: "Error updating payment information",
          description:
            error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    } else if (onSuccess) {
      // If no userId, just call onSuccess (for new customer flow)
      onSuccess();
    }
  };

  return {
    formData,
    errors,
    isLoading,
    error,
    isPending: updateBillingMutation.isPending,
    handleChange,
    handleSubmit,
  };
}
