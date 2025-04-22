"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { BillingInfo } from "@/types";

export type CreateBillingInfoData = {
  user_id: string;
  name_on_card: string;
  card_number: string;
  expiration: string;
  cvc: string;
};

// Define a constant for the mutation key for better reusability
export const createBillingInfoKey = ["createBillingInfo"];

export function useCreateBillingInfo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: createBillingInfoKey,
    mutationFn: async (billingData: CreateBillingInfoData) => {
      // Create a new billing info record
      const { data, error } = await supabase
        .from("billing_info")
        .insert(billingData)
        .select()
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as BillingInfo;
    },
    onSuccess: (data) => {
      // Invalidate and refetch billing info queries
      queryClient.invalidateQueries({ queryKey: ["billing_info"] });
      
      // Invalidate specific user's billing info
      queryClient.invalidateQueries({ 
        queryKey: ["billing_info", data.user_id] 
      });
      
      // Update the cache with the new billing info
      queryClient.setQueryData(["billing_info", data.user_id], data);
    },
  });
}
