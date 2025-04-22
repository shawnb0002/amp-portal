"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export type CreateVehicleData = {
  user_id: string;
  make: string;
  model: string;
  year: string;
  color: string;
  license_plate: string;
};

// Define a constant for the mutation key for better reusability
export const createVehicleKey = ["createVehicle"];

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: createVehicleKey,
    mutationFn: async (vehicleData: CreateVehicleData) => {
      // Create a new vehicle record
      const { data, error } = await supabase
        .from("vehicles")
        .insert(vehicleData)
        .select()
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch vehicles queries
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      
      // Invalidate specific user's vehicles
      queryClient.invalidateQueries({ 
        queryKey: ["vehicles", data.user_id] 
      });
      
      // Update the cache with the new vehicle
      queryClient.setQueryData(["vehicle", data.id], data);
    },
  });
}
