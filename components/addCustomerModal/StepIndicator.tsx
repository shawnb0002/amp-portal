"use client";

import { Check } from "lucide-react";
import { STEPS } from "./types";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between mb-8">
      {STEPS.map((step) => (
        <div
          key={step.id}
          className={`flex items-center ${
            step.id !== STEPS.length ? "flex-1" : ""
          }`}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
              currentStep >= step.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted"
            }`}
          >
            {currentStep > step.id ? (
              <Check className="h-4 w-4" />
            ) : (
              step.id
            )}
          </div>
          <div
            className={`ml-2 text-sm font-medium ${
              currentStep >= step.id
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {step.name}
          </div>
          {step.id !== STEPS.length && (
            <div
              className={`h-0.5 flex-1 mx-4 ${
                currentStep > step.id ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
