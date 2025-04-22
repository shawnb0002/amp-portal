"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorStateProps } from "./types";

export function ErrorState({ 
  errorMessage, 
  title = "Vehicle Subscriptions", 
  description = "Active membership plans" 
}: ErrorStateProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 text-center">
        <p className="text-destructive">
          Error loading subscriptions: {errorMessage}
        </p>
      </CardContent>
    </Card>
  );
}
