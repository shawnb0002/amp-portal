"use client";

import { Button } from "@/components/ui/button";
import { STEPS } from "./types";

interface FormNavigationProps {
  currentStep: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function FormNavigation({
  currentStep,
  isSubmitting,
  onBack,
  onNext,
  onSubmit,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1 || isSubmitting}
      >
        Back
      </Button>
      {currentStep !== STEPS.length ? (
        <Button onClick={onNext} disabled={isSubmitting}>
          Continue
        </Button>
      ) : (
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      )}
    </div>
  );
}
