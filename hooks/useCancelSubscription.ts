"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { subscriptionsQueryKey } from "./useGetSubscriptions";
import { subscriptionVehiclesQueryKey } from "./useGetSubscriptionVehicles";

export interface CancelSubscriptionParams {
  subscriptionId: string;
}

export const cancelSubscriptionKey = ["cancelSubscription"];

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: cancelSubscriptionKey,
    mutationFn: async (params: CancelSubscriptionParams) => {
      const { subscriptionId } = params;
      const now = new Date().toISOString(); // Current timestamp for unassigned_at

      // Update the subscription status to "inactive"
      const { data: updatedSubscription, error } = await supabase
        .from("subscriptions")
        .update({
          status: "inactive"
        })
        .eq("id", subscriptionId)
        .select()
        .single();

      if (error) {
        throw new Error(`Error canceling subscription: ${error.message}`);
      }

      // Update the subscription_vehicles record to set unassigned_at
      const { error: svError } = await supabase
        .from("subscription_vehicles")
        .update({
          unassigned_at: now
        })
        .eq("subscription_id", subscriptionId)
        .is("unassigned_at", null);

      if (svError) {
        throw new Error(`Error updating subscription_vehicle: ${svError.message}`);
      }

      return updatedSubscription;
    },
    onSuccess: (data) => {
      // Invalidate and refetch subscriptions queries to update the UI
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });

      // If we have user-specific subscription queries, invalidate those too
      if (data.user_id) {
        queryClient.invalidateQueries({
          queryKey: subscriptionsQueryKey(data.user_id),
        });
      }
      
      // Invalidate subscription_vehicles queries to update the UI
      queryClient.invalidateQueries({ queryKey: ["subscription_vehicles"] });
      
      // If we have user-specific subscription_vehicles queries, invalidate those too
      if (data.user_id) {
        queryClient.invalidateQueries({
          queryKey: subscriptionVehiclesQueryKey(data.user_id),
        });
      }
    },
  });
}
