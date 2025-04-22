"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/types";
import { userKeys } from "@/lib/queryKeys";

export function useGetUsers(initialData?: User[]) {
  return useQuery({
    queryKey: userKeys.withSubscriptions(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select(`
          *,
          subscriptions:subscriptions(*)
        `);

      if (error) {
        throw new Error(error.message);
      }
      
      return data as User[];
    },
    initialData,
  });
}
