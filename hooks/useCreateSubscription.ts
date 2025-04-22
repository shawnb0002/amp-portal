"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

// Define query keys
export const subscriptionVehiclesKey = (userId?: string) =>
  userId ? ["subscription_vehicles", userId] : ["subscription_vehicles"];

export const subscriptionQueryKey = (userId?: string) => 
  userId ? ["subscriptions", userId] : ["subscriptions"];

export const singleSubscriptionQueryKey = (subscriptionId: string) =>
  ["subscription", subscriptionId];

export const userQueryKey = (userId: string) =>
  ["user", userId];

export type CreateSubscriptionData = {
  user_id: string;
  plan_id: string;
  status?: "active" | "overdue" | "inactive";
  start_date?: string;
  next_billing_date?: string;
  vehicle_id?: string; // Not stored in subscriptions table, but needed for subscription_vehicles
};

// Define a constant for the mutation key for better reusability
export const createSubscriptionKey = ["createSubscription"];

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: createSubscriptionKey,
    mutationFn: async (subscriptionData: CreateSubscriptionData) => {
      const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
      const now = new Date().toISOString(); // Current timestamp for assigned_at

      // Extract vehicle_id and prepare data for subscriptions table
      const { vehicle_id, ...subscriptionFields } = subscriptionData;

      // Set default values if not provided
      const dataToInsert = {
        ...subscriptionFields,
        status: subscriptionData.status || "active",
        start_date: subscriptionData.start_date || today,
        next_billing_date: subscriptionData.next_billing_date || today, // In a real app, this would be calculated based on billing cycle
      };

      // Create a new subscription record
      const { data, error } = await supabase
        .from("subscriptions")
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Create a record in the subscription_vehicles table to associate the subscription with the vehicle
      const { error: svError } = await supabase
        .from("subscription_vehicles")
        .insert({
          subscription_id: data.id,
          vehicle_id: vehicle_id,
          assigned_at: now,
          unassigned_at: null,
        });

      if (svError) {
        throw new Error(
          `Error creating subscription_vehicle: ${svError.message}`
        );
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate all subscriptions queries
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKey() });

      // Invalidate specific user's subscriptions
      queryClient.invalidateQueries({
        queryKey: subscriptionQueryKey(data.user_id),
      });

      // Update the cache with the new subscription
      queryClient.setQueryData(singleSubscriptionQueryKey(data.id), data);

      // Also update the user's status to active if they have an active subscription
      if (data.status === "active") {
        queryClient.invalidateQueries({
          queryKey: userQueryKey(data.user_id),
        });
      }

      // Invalidate subscription_vehicles queries to update the UI
      queryClient.invalidateQueries({ queryKey: subscriptionVehiclesKey() });

      // Invalidate specific user's subscription_vehicles
      queryClient.invalidateQueries({
        queryKey: subscriptionVehiclesKey(data.user_id),
      });
    },
  });
}
