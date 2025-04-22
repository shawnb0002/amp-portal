import { VehicleSubscription } from "./types";
import { getActiveSubscriptionForVehicle, SubscriptionVehicle } from "@/hooks/useGetSubscriptionVehicles";
import { Vehicle } from "@/hooks/useGetVehicles";
import { Subscription } from "@/hooks/useGetSubscriptions";
import { Plan } from "@/hooks/useGetPlans";

/**
 * Transforms raw data from various sources into a unified VehicleSubscription array
 */
export function transformSubscriptionData(
  vehicles: Vehicle[] | undefined,
  subscriptionsData: Subscription[] | undefined,
  plans: Plan[] | undefined,
  subscriptionVehicles: SubscriptionVehicle[] | undefined
): VehicleSubscription[] {
  if (!vehicles || !subscriptionsData || !plans || !subscriptionVehicles) return [];

  // Create entries for vehicles with subscriptions
  const result: VehicleSubscription[] = [];

  // Process each vehicle
  vehicles.forEach((vehicle) => {
    // Find the active subscription for this vehicle using the subscription_vehicles table
    const activeSubscriptionVehicle = getActiveSubscriptionForVehicle(subscriptionVehicles, vehicle.id);
    
    // Find the subscription data if there's an active subscription
    const subscription = activeSubscriptionVehicle 
      ? subscriptionsData.find(sub => sub.id === activeSubscriptionVehicle.subscription_id)
      : null;

    if (!subscription) {
      // Return a placeholder with empty subscription data if no subscription exists
      result.push({
        vehicle: {
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          licensePlate: vehicle.license_plate,
          year: vehicle.year,
          color: vehicle.color,
        },
        plan: "No plan",
        price: 0,
        status: "inactive",
        nextBillingDate: "",
        subscriptionId: "",
      });
      return;
    }

    // Find the plan for this subscription
    const plan = plans.find(
      (p) => String(p.id) === String(subscription.plan_id)
    );

    result.push({
      vehicle: {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        licensePlate: vehicle.license_plate,
        year: vehicle.year,
        color: vehicle.color,
      },
      plan: plan?.name || "No Subscription",
      price: plan?.price || 0,
      status: subscription.status,
      nextBillingDate: subscription.next_billing_date,
      subscriptionId: subscription.id,
    });
  });

  return result;
}
