export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: string;
  subscriptions?: Array<{
    vehicle: {
      make: string;
      model: string;
      licensePlate: string;
    };
    plan: string;
    price: number;
    status: string;
    nextBillingDate: string;
  }>;
  notes?: Array<{
    author: string;
    date: string;
    content: string;
  }>;
}

export interface UserProfileInfoProps {
  user: User; // Initial SSR data
  userId?: string; // Optional userId for client-side fetching
}
