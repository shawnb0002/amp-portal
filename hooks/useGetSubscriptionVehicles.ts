"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export interface SubscriptionVehicle {
  id: string;
  subscription_id: string;
  vehicle_id: string;
  assigned_at: string;
  unassigned_at: string | null;
}

export const subscriptionVehiclesQueryKey = (userId?: string) =>
  userId ? ["subscription_vehicles", userId] : ["subscription_vehicles"];

export function useGetSubscriptionVehicles(userId?: string) {
  return useQuery({
    queryKey: subscriptionVehiclesQueryKey(userId),
    queryFn: async () => {
      // First, get all subscriptions for the user to get their IDs
      let subscriptionsQuery = supabase.from("subscriptions").select("id");
      
      if (userId) {
        subscriptionsQuery = subscriptionsQuery.eq("user_id", userId);
      }
      
      const { data: subscriptions, error: subscriptionsError } = await subscriptionsQuery;
      
      if (subscriptionsError) {
        throw new Error(`Error fetching subscriptions: ${subscriptionsError.message}`);
      }
      
      if (!subscriptions || subscriptions.length === 0) {
        return [] as SubscriptionVehicle[];
      }
      
      // Get all subscription_vehicles records for these subscriptions
      const subscriptionIds = subscriptions.map(sub => sub.id);
      
      const { data, error } = await supabase
        .from("subscription_vehicles")
        .select("*")
        .in("subscription_id", subscriptionIds);
      
      if (error) {
        throw new Error(`Error fetching subscription_vehicles: ${error.message}`);
      }
      
      return (data || []) as SubscriptionVehicle[];
    },
  });
}

// Helper function to get the active subscription for a vehicle
export function getActiveSubscriptionForVehicle(
  subscriptionVehicles: SubscriptionVehicle[] | undefined,
  vehicleId: string
): SubscriptionVehicle | undefined {
  if (!subscriptionVehicles) return undefined;
  
  return subscriptionVehicles.find(
    sv => sv.vehicle_id === vehicleId && sv.unassigned_at === null
  );
}

// Helper function to get the vehicle for a subscription
export function getVehicleForSubscription(
  subscriptionVehicles: SubscriptionVehicle[] | undefined,
  subscriptionId: string
): string | undefined {
  if (!subscriptionVehicles) return undefined;
  
  const activeRecord = subscriptionVehicles.find(
    sv => sv.subscription_id === subscriptionId && sv.unassigned_at === null
  );
  
  return activeRecord?.vehicle_id;
}
