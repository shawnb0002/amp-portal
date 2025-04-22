"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { BillingInfo } from "@/types";
import { userQueryKey } from "./useGetUser";
import { billingInfoQueryKey } from "./useGetBillingInfo";

export type UpdateBillingData = {
  user_id: string;
  name_on_card: string;
  card_number: string;
  expiration: string;
  cvc: string;
};

// Define a constant for the mutation key for better reusability
export const updateBillingKey = ["updateBilling"];

export function useUpdateBilling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateBillingKey,
    mutationFn: async (billingData: UpdateBillingData) => {
      const { user_id, ...updateData } = billingData;

      // First check if a billing record exists for this user
      const { data: existingData, error: fetchError } = await supabase
        .from("billing_info")
        .select("*")
        .eq("user_id", user_id)
        .maybeSingle();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      let result;

      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from("billing_info")
          .update({
            ...updateData,
          })
          .eq("user_id", user_id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from("billing_info")
          .insert({
            user_id,
            ...updateData,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        result = data;
      }

      return result as BillingInfo;
    },
    onSuccess: (data) => {
      // Invalidate and refetch billing info queries
      queryClient.invalidateQueries({ queryKey: ["billing_info"] });

      // Invalidate the specific billing info query
      queryClient.invalidateQueries({
        queryKey: billingInfoQueryKey(data.user_id),
      });

      // Invalidate the specific user query to refresh any user data that might include billing info
      queryClient.invalidateQueries({ queryKey: userQueryKey(data.user_id) });

      // Update the cache with the new data
      queryClient.setQueryData(billingInfoQueryKey(data.user_id), data);
    },
  });
}
