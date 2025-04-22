export interface VehicleWithSubscription {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
  year: string;
  color: string;
  plan: string;
  price: number;
  subscriptionId: string | null;
}
