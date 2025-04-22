"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { vehiclesQueryKey } from "./useGetVehicles";

export type UpdateVehicleData = {
  id: string;
  make: string;
  model: string;
  year: string;
  color: string;
  license_plate: string;
};

export const updateVehicleKey = ["updateVehicle"];

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: updateVehicleKey,
    mutationFn: async (vehicleData: UpdateVehicleData) => {
      const { id, ...updateData } = vehicleData;
      
      const { data, error } = await supabase
        .from("vehicles")
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
      // Invalidate and refetch vehicles queries
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      
      // Invalidate specific user's vehicles
      queryClient.invalidateQueries({ 
        queryKey: vehiclesQueryKey(data.user_id) 
      });
      
      // Update the cache with the updated vehicle
      queryClient.setQueryData(["vehicle", data.id], data);
    },
  });
}
