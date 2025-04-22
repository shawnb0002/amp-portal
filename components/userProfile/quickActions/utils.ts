import { VehicleWithSubscription } from "./types";
import { getActiveSubscriptionForVehicle, SubscriptionVehicle } from "@/hooks/useGetSubscriptionVehicles";
import { Vehicle } from "@/hooks/useGetVehicles";
import { Subscription } from "@/hooks/useGetSubscriptions";
import { Plan } from "@/hooks/useGetPlans";

export function combineVehicleAndSubscriptionData(
  vehicles: Vehicle[] | undefined,
  subscriptions: Subscription[] | undefined,
  plans: Plan[] | undefined,
  subscriptionVehicles: SubscriptionVehicle[] | undefined
): VehicleWithSubscription[] {
  if (!vehicles || !subscriptions || !plans || !subscriptionVehicles) return [];

  return vehicles.map((vehicle) => {
    // Find the active subscription for this vehicle using the subscription_vehicles table
    const activeSubscriptionVehicle = getActiveSubscriptionForVehicle(
      subscriptionVehicles,
      vehicle.id
    );

    // Find the subscription data if there's an active subscription
    const subscription = activeSubscriptionVehicle
      ? subscriptions.find(
          (sub) => sub.id === activeSubscriptionVehicle.subscription_id
        )
      : null;

    // Find plan for this subscription
    const plan =
      subscription &&
      plans.find((p) => String(p.id) === String(subscription.plan_id));

    return {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      licensePlate: vehicle.license_plate,
      year: vehicle.year,
      color: vehicle.color,
      plan: plan?.name || "No plan",
      price: plan?.price || 0,
      subscriptionId: subscription?.id || null,
    };
  });
}
