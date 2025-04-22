"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/types";

export const userQueryKey = (userId: string) => ["user", userId];

export function useGetUser(userId: string) {
  return useQuery({
    queryKey: userQueryKey(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as User;
    },
  });
}
