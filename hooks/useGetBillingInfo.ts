"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { BillingInfo } from "@/types";

export const billingInfoQueryKey = (userId: string) => ["billingInfo", userId];

export function useGetBillingInfo(userId: string) {
  return useQuery({
    queryKey: billingInfoQueryKey(userId),
    queryFn: async () => {
      // We should always have a user id but if we do not skip the query if we dont have a userId
      if (!userId) {
        return null;
      }
      
      const { data, error } = await supabase
        .from("billing_info")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as BillingInfo | null;
    },
    // Only run the query if we have a userId
    enabled: !!userId,
  });
}
