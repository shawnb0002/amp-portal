// User related query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (userId: string) => [...userKeys.details(), userId] as const,
  withSubscriptions: () => [...userKeys.all, { include: "subscriptions" }] as const,
};

// Subscription related query keys
export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  lists: () => [...subscriptionKeys.all, "list"] as const,
  list: (filters: string) => [...subscriptionKeys.lists(), { filters }] as const,
  details: () => [...subscriptionKeys.all, "detail"] as const,
  detail: (subscriptionId: string) => [...subscriptionKeys.details(), subscriptionId] as const,
  byUser: (userId: string) => [...subscriptionKeys.all, { userId }] as const,
};

// Subscription vehicles related query keys
export const subscriptionVehiclesKeys = {
  all: ["subscription_vehicles"] as const,
  lists: () => [...subscriptionVehiclesKeys.all, "list"] as const,
  list: (filters: string) => [...subscriptionVehiclesKeys.lists(), { filters }] as const,
  details: () => [...subscriptionVehiclesKeys.all, "detail"] as const,
  detail: (id: string) => [...subscriptionVehiclesKeys.details(), id] as const,
  byUser: (userId: string) => [...subscriptionVehiclesKeys.all, { userId }] as const,
};

// Vehicle related query keys
export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  list: (filters: string) => [...vehicleKeys.lists(), { filters }] as const,
  details: () => [...vehicleKeys.all, "detail"] as const,
  detail: (vehicleId: string) => [...vehicleKeys.details(), vehicleId] as const,
  byUser: (userId: string) => [...vehicleKeys.all, { userId }] as const,
};

// Plan related query keys
export const planKeys = {
  all: ["plans"] as const,
  lists: () => [...planKeys.all, "list"] as const,
  list: (filters: string) => [...planKeys.lists(), { filters }] as const,
  details: () => [...planKeys.all, "detail"] as const,
  detail: (planId: string) => [...planKeys.details(), planId] as const,
};
