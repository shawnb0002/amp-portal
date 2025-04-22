"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { subscriptionsQueryKey } from "./useGetSubscriptions";
import { subscriptionVehiclesQueryKey } from "./useGetSubscriptionVehicles";

export type UpdateSubscriptionData = {
  id: string;
  plan_id: string;
  status: "active" | "overdue" | "inactive";
};

export const updateSubscriptionKey = ["updateSubscription"];

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: updateSubscriptionKey,
    mutationFn: async (subscriptionData: UpdateSubscriptionData) => {
      const { id, ...updateData } = subscriptionData;
      
      const { data, error } = await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch subscriptions queries
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      
      // Invalidate specific user's subscriptions
      queryClient.invalidateQueries({ 
        queryKey: subscriptionsQueryKey(data.user_id) 
      });
      
      // Update the cache with the updated subscription
      queryClient.setQueryData(["subscription", data.id], data);
      
      // Also update the user's status to active if they have an active subscription
      if (data.status === "active") {
        queryClient.invalidateQueries({ 
          queryKey: ["user", data.user_id] 
        });
      }
      
      // Invalidate subscription_vehicles queries to update the UI
      queryClient.invalidateQueries({ queryKey: ["subscription_vehicles"] });
      
      // Invalidate specific user's subscription_vehicles
      queryClient.invalidateQueries({ 
        queryKey: subscriptionVehiclesQueryKey(data.user_id) 
      });
    },
  });
}
