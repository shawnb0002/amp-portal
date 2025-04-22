"use client";

import { AddCustomerModal } from "@/components/addCustomerModal/AddCustomerModal";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Manage and assist customers with their accounts and subscriptions.
        </p>
      </div>
      <AddCustomerModal />
    </div>
  );
}
