"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const emailExistsQueryKey = (email: string) => ["emailExists", email];

export function useCheckEmailExists(email: string, enabled = true) {
  return useQuery({
    queryKey: emailExistsQueryKey(email),
    queryFn: async () => {
      if (!email) return false;
      
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();
        
      if (error) {
        throw new Error(error.message);
      }
      
      return !!data; // Return true if data exists, false otherwise
    },
    enabled: enabled && !!email, // Only run the query if email is provided and enabled is true
  });
}
