export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive" | "overdue" | "pending";
  subscriptions?: Array<{
    id: string;
    plan: string;
    price: number;
    status: "active" | "overdue" | "inactive";
    startDate: string;
    nextBillingDate: string;
    vehicle: {
      id: string;
      make: string;
      model: string;
      year: string;
      color: string;
      licensePlate: string;
    };
  }>;
  notes?: Array<{
    id: string;
    author: string;
    date: string;
    content: string;
  }>;
}

export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  time: string;
  description: string;
  type: "payment" | "subscription" | "refund" | "one-time";
  amount: number;
  status: "completed" | "pending" | "failed";
}

export interface BillingInfo {
  id: string;
  user_id: string;
  name_on_card: string;
  card_number: string;
  expiration: string;
  cvc: string;
}
