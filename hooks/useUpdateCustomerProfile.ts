"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/types";
import { userQueryKey } from "./useGetUser";

export type UpdateUserProfileData = Partial<User> & { id: string };

// Define a constant for the mutation key for better reusability
export const updateCustomerProfileKey = ["updateCustomerProfile"];

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: updateCustomerProfileKey,
    mutationFn: async (userData: UpdateUserProfileData) => {
      const { id, ...updateData } = userData;
      
      const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as User;
    },
    onSuccess: (data) => {
      // Invalidate and refetch users queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      // Invalidate the specific user query
      queryClient.invalidateQueries({ queryKey: userQueryKey(data.id) });
      
      // Directly update the cache with the new data
      queryClient.setQueryData(userQueryKey(data.id), data);
    },
  });
}
