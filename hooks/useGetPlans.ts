"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export interface Plan {
  id: string;
  name: string;
  price: number;
  description?: string;
  features?: string[];
}

export const plansQueryKey = () => ["plans"];

export function useGetPlans() {
  return useQuery({
    queryKey: plansQueryKey(),
    queryFn: async () => {
      const { data, error } = await supabase.from("plans").select("*");

      if (error) {
        throw new Error(`Error fetching plans: ${error.message}`);
      }

      return (data || []) as Plan[];
    },
  });
}
