"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VehicleWithSubscription } from "./types";
import { Subscription } from "@/hooks/useGetSubscriptions";

interface VehicleSelectionTableProps {
  vehiclesWithSubscriptions: VehicleWithSubscription[];
  selectedVehicles: string[];
  onVehicleSelect: (vehicleId: string) => void;
  subscriptions?: Subscription[];
}

export function VehicleSelectionTable({
  vehiclesWithSubscriptions,
  selectedVehicles,
  onVehicleSelect,
  subscriptions,
}: VehicleSelectionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Plan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehiclesWithSubscriptions.length > 0 ? (
          vehiclesWithSubscriptions.map((vehicle, index) => (
            <TableRow key={index}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedVehicles.includes(vehicle.id)}
                  onChange={() => onVehicleSelect(vehicle.id)}
                  className="h-4 w-4"
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span>
                      {vehicle.make} {vehicle.model}
                    </span>
                    {vehicle.subscriptionId && (
                      <>
                        <Badge variant="outline" className="text-xs">
                          Has Subscription
                        </Badge>
                        {subscriptions &&
                          (() => {
                            const sub = subscriptions.find(
                              (s) => s.id === vehicle.subscriptionId
                            );
                            if (sub && sub.status === "transferred") {
                              return (
                                <Badge variant="secondary" className="text-xs">
                                  Transferred
                                </Badge>
                              );
                            } else if (sub && sub.status === "active") {
                              return (
                                <Badge variant="default" className="text-xs">
                                  Active
                                </Badge>
                              );
                            }
                            return null;
                          })()}
                      </>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {vehicle.licensePlate}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{vehicle.plan}</span>
                  {vehicle.price > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ${vehicle.price}/month
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-6">
              <p className="text-muted-foreground">No vehicles available</p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
