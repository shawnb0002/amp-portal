"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { PaymentDetailsForm } from "@/components/forms/PaymentDetailsForm";

interface PaymentDialogProps {
  userId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDialog({
  userId,
  isOpen,
  onOpenChange,
}: PaymentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-auto flex flex-col py-4 px-3 gap-1 items-center justify-center"
        >
          <CreditCard className="h-5 w-5 text-primary" />
          <span className="text-sm">Update Payment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Payment Information</DialogTitle>
          <DialogDescription>
            Update the customer&apos;s payment details below.
          </DialogDescription>
        </DialogHeader>
        <PaymentDetailsForm
          userId={userId}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
