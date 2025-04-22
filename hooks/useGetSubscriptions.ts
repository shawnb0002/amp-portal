"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  next_billing_date: string;
  // Note: vehicle_id is not present in the actual data
}

export const subscriptionsQueryKey = (userId?: string) =>
  userId ? ["subscriptions", userId] : ["subscriptions"];

export function useGetSubscriptions(userId?: string) {
  return useQuery({
    queryKey: subscriptionsQueryKey(userId),
    queryFn: async () => {
      let query = supabase.from("subscriptions").select("*");

      // If we have a userId, filter by user_id
      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error fetching subscriptions: ${error.message}`);
      }

      return (data || []) as Subscription[];
    },
  });
}
