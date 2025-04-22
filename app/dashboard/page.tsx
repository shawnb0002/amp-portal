import { Dashboard } from "@/components/dashboard/Dashboard";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/types";

export default async function DashboardPage() {
  const { data: users, error } = await supabase
    .from("users")
    .select(`
      *,
      subscriptions:subscriptions(*)
    `);

  // Handle error
  if (error) {
    console.error("Error fetching users:", error);
    // Could return an error UI component here
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Error loading users
          </h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return <Dashboard initialUsers={users as User[]} />;
}
