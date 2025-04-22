"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/types";
import { userKeys } from "@/lib/queryKeys";

export type CreateCustomerData = {
  name: string;
  email: string;
  phone: string;
};

// Define a constant for the mutation key for better reusability
export const createCustomerKey = ["createCustomer"];

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: createCustomerKey,
    mutationFn: async (customerData: CreateCustomerData) => {
      // Create a new customer record
      const { data, error } = await supabase
        .from("users")
        .insert({
          ...customerData,
          join_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
          status: "inactive" // Initial status
        })
        .select()
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as User;
    },
    onSuccess: (data) => {
      // Invalidate and refetch users queries
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      
      // Also update the cache with the new user
      queryClient.setQueryData(userKeys.detail(data.id), data);
    },
  });
}
