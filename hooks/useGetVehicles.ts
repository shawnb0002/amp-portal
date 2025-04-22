"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  license_plate: string;
  year: string;
  color: string;
  user_id: string;
}

export const vehiclesQueryKey = (userId?: string) =>
  userId ? ["vehicles", userId] : ["vehicles"];

export function useGetVehicles(userId: string) {
  return useQuery({
    queryKey: vehiclesQueryKey(userId),
    queryFn: async () => {
      let query = supabase.from("vehicles").select("*");

      // If we have a userId, filter by user_id
      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error fetching vehicles: ${error.message}`);
      }

      return (data || []) as Vehicle[];
    },
  });
}
