import { useMemo } from "react";
import { transformSubscriptionData } from "./utils";
import { Vehicle } from "@/hooks/useGetVehicles";
import { Subscription } from "@/hooks/useGetSubscriptions";
import { Plan } from "@/hooks/useGetPlans";
import { SubscriptionVehicle } from "@/hooks/useGetSubscriptionVehicles";

export function useTransformedSubscriptions(
  vehicles: Vehicle[] | undefined,
  subscriptionsData: Subscription[] | undefined,
  plans: Plan[] | undefined,
  subscriptionVehicles: SubscriptionVehicle[] | undefined
) {
  return useMemo(
    () =>
      transformSubscriptionData(
        vehicles,
        subscriptionsData,
        plans,
        subscriptionVehicles
      ),
    [vehicles, subscriptionsData, plans, subscriptionVehicles]
  );
}
