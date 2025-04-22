import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfileInfo } from "@/components/userProfile/UserProfileInfo";
import { UserQuickActions } from "@/components/userProfile/UserQuickActions";
import { UserSubscriptions } from "@/components/userProfile/UserSubscriptions";
import { UserActivity } from "@/components/userProfile/UserActivity";
import { supabase } from "@/lib/supabaseClient";
import type { Transaction, User } from "@/types";

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function UserProfile({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.userId;

  // Fetch user data from Supabase
  const { data: user, error: userError } = (await supabase
    .from("users")
    .select(`
      *,
      subscriptions:subscriptions(*)
    `)
    .eq("id", id)
    .single()) as { data: User | null; error: Error | null };

  // Fetch transactions for this user
  const { data: transactions, error: transactionsError } = (await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", id)) as { data: Transaction[] | null; error: Error | null };

  // Log errors for debugging (these could be handled more gracefully in production)
  if (userError) console.error("Error fetching user:", userError);
  if (transactionsError)
    console.error("Error fetching transactions:", transactionsError);

  // Handle if user not found
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The user you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button asChild>
          <Link href={"/dashboard"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild size="sm" className="gap-1">
          <Link href={"/dashboard"}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Component (includes personal info and edit functionality) */}
        <UserProfileInfo user={user} userId={id} />

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Actions Component */}
          <UserQuickActions />

          {/* Subscriptions Component */}
          <UserSubscriptions userId={id} />

          {/* Activity Component (Transactions & Notes) */}
          <UserActivity
            transactions={transactions || []}
            notes={user.notes || []}
          />
        </div>
      </div>
    </div>
  );
}
