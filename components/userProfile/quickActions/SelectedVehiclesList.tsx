"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { VehicleWithSubscription } from "./types";

interface SelectedVehiclesListProps {
  selectedVehicles: string[];
  vehiclesWithSubscriptions: VehicleWithSubscription[];
}

export function SelectedVehiclesList({
  selectedVehicles,
  vehiclesWithSubscriptions,
}: SelectedVehiclesListProps) {
  if (selectedVehicles.length === 0) {
    return null;
  }

  return (
    <div className="pt-2">
      <h4 className="text-sm font-medium mb-2">Selected Vehicles:</h4>
      <div className="space-y-2">
        {selectedVehicles.map((id, index) => {
          const vehicle = vehiclesWithSubscriptions.find((v) => v.id === id);
          return vehicle ? (
            <div key={id} className="flex items-center gap-2">
              <Badge variant={index === 0 ? "default" : "secondary"}>
                {index === 0 ? "From" : "To"}
              </Badge>
              <span>
                {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
              </span>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
