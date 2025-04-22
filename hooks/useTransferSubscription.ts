"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { subscriptionsQueryKey } from "./useGetSubscriptions";
import { subscriptionVehiclesQueryKey } from "./useGetSubscriptionVehicles";

export interface TransferSubscriptionParams {
  fromVehicleId: string;
  toVehicleId: string;
  subscriptionId: string;
}

// Define a constant for the mutation key for better reusability
export const transferSubscriptionKey = ["transferSubscription"];

export function useTransferSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: transferSubscriptionKey,
    mutationFn: async (params: TransferSubscriptionParams) => {
      const { subscriptionId, fromVehicleId, toVehicleId } = params;
      const now = new Date().toISOString();

      // First, get the subscription we want to transfer
      const { data: sourceSubscription, error: getSubError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("id", subscriptionId)
        .single();

      if (getSubError) {
        throw new Error(`Error getting source subscription: ${getSubError.message}`);
      }

      if (!sourceSubscription) {
        throw new Error(`Source subscription not found: ${subscriptionId}`);
      }

      // Verify the vehicles exist
      const { data: sourceVehicle, error: sourceVehicleError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", fromVehicleId)
        .single();
        
      if (sourceVehicleError) {
        throw new Error(`Error getting source vehicle: ${sourceVehicleError.message}`);
      }
      
      const { data: targetVehicle, error: targetVehicleError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", toVehicleId)
        .single();
        
      if (targetVehicleError) {
        throw new Error(`Error getting target vehicle: ${targetVehicleError.message}`);
      }

      // Find the current subscription_vehicles record for the source vehicle
      const { data: sourceSubscriptionVehicle, error: sourceSubVehicleError } = await supabase
        .from("subscription_vehicles")
        .select("*")
        .eq("subscription_id", subscriptionId)
        .eq("vehicle_id", fromVehicleId)
        .is("unassigned_at", null)
        .single();
        
      if (sourceSubVehicleError && sourceSubVehicleError.code !== "PGRST116") { // PGRST116 is "no rows returned"
        throw new Error(`Error getting source subscription_vehicle: ${sourceSubVehicleError.message}`);
      }
      
      if (!sourceSubscriptionVehicle) {
        throw new Error(`No active subscription found for vehicle: ${fromVehicleId}`);
      }

      // Check if the target vehicle already has an active subscription
      const { data: targetActiveSubscriptions, error: targetActiveSubError } = await supabase
        .from("subscription_vehicles")
        .select("*, subscriptions(*)")
        .eq("vehicle_id", toVehicleId)
        .is("unassigned_at", null);
        
      if (targetActiveSubError) {
        throw new Error(`Error checking target vehicle subscriptions: ${targetActiveSubError.message}`);
      }

      // Start a transaction to ensure all operations succeed or fail together
      // First, mark the source subscription_vehicle as unassigned
      const { error: updateSourceError } = await supabase
        .from("subscription_vehicles")
        .update({
          unassigned_at: now
        })
        .eq("id", sourceSubscriptionVehicle.id);
        
      if (updateSourceError) {
        throw new Error(`Error updating source subscription_vehicle: ${updateSourceError.message}`);
      }

      // If the target vehicle has active subscriptions, unassign them
      if (targetActiveSubscriptions && targetActiveSubscriptions.length > 0) {
        const targetSubVehicleIds = targetActiveSubscriptions.map(sv => sv.id);
        
        const { error: unassignTargetError } = await supabase
          .from("subscription_vehicles")
          .update({
            unassigned_at: now
          })
          .in("id", targetSubVehicleIds);
          
        if (unassignTargetError) {
          throw new Error(`Error unassigning target subscriptions: ${unassignTargetError.message}`);
        }
        
        // Mark any active subscriptions as transferred
        const targetSubscriptionIds = targetActiveSubscriptions
          .filter(sv => sv.subscriptions && sv.subscriptions.status === "active")
          .map(sv => sv.subscriptions.id);
          
        if (targetSubscriptionIds.length > 0) {
          const { error: updateTargetSubsError } = await supabase
            .from("subscriptions")
            .update({
              status: "transferred",
              is_transferred: true
            })
            .in("id", targetSubscriptionIds);
            
          if (updateTargetSubsError) {
            throw new Error(`Error updating target subscriptions: ${updateTargetSubsError.message}`);
          }
        }
      }

      // Create a new subscription_vehicles record for the target vehicle
      const { data: newSubscriptionVehicle, error: createError } = await supabase
        .from("subscription_vehicles")
        .insert({
          subscription_id: subscriptionId,
          vehicle_id: toVehicleId,
          assigned_at: now,
          unassigned_at: null
        })
        .select()
        .single();
        
      if (createError) {
        throw new Error(`Error creating new subscription_vehicle: ${createError.message}`);
      }

      // Ensure the subscription is marked as active
      const { data: updatedSubscription, error: updateSubError } = await supabase
        .from("subscriptions")
        .update({
          status: "active",
          is_transferred: false
        })
        .eq("id", subscriptionId)
        .select()
        .single();
        
      if (updateSubError) {
        throw new Error(`Error updating subscription status: ${updateSubError.message}`);
      }

      // Return the updated data
      return {
        fromSubscription: sourceSubscription,
        toSubscription: updatedSubscription,
        fromVehicle: sourceVehicle,
        toVehicle: targetVehicle,
        subscriptionVehicle: newSubscriptionVehicle
      };
    },
    onSuccess: (data) => {
      // Invalidate and refetch subscriptions queries to update the UI
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });

      // If we have user-specific subscription queries, invalidate those too
      if (data.fromSubscription?.user_id) {
        queryClient.invalidateQueries({
          queryKey: subscriptionsQueryKey(data.fromSubscription.user_id),
        });
      }
      
      // Also invalidate vehicle queries
      if (data.fromVehicle?.user_id) {
        queryClient.invalidateQueries({
          queryKey: ["vehicles", data.fromVehicle.user_id],
        });
      }
      
      // Invalidate subscription_vehicles queries to update the UI
      queryClient.invalidateQueries({ queryKey: ["subscription_vehicles"] });
      
      // If we have user-specific subscription_vehicles queries, invalidate those too
      if (data.fromSubscription?.user_id) {
        queryClient.invalidateQueries({
          queryKey: subscriptionVehiclesQueryKey(data.fromSubscription.user_id),
        });
      }
      
      // Also invalidate for the target vehicle's user if different
      if (data.toVehicle?.user_id && data.toVehicle.user_id !== data.fromVehicle?.user_id) {
        queryClient.invalidateQueries({
          queryKey: subscriptionVehiclesQueryKey(data.toVehicle.user_id),
        });
      }
    },
  });
}
