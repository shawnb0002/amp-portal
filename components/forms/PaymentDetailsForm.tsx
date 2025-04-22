"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaymentDetailsFormProps } from "./paymentDetails/types";
import { usePaymentForm } from "./paymentDetails/usePaymentForm";

export type { PaymentFormData } from "./paymentDetails/types";

export function PaymentDetailsForm({
  formData: propFormData,
  onChange,
  userId,
  onSuccess,
  onCancel,
}: PaymentDetailsFormProps) {
  const {
    formData,
    errors,
    isLoading,
    error,
    isPending,
    handleChange,
    handleSubmit,
  } = usePaymentForm({
    initialData: propFormData,
    userId,
    onChange,
    onSuccess,
  });

  if (userId && error) {
    return (
      <div className="p-4 text-red-500">
        Error loading payment information: {error.message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {userId && isLoading && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Loading payment information...
          </p>
        </div>
      )}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="billingDate">Billing Date</Label>
        <Input
          type="date"
          id="billingDate"
          value={formData.billingDate}
          onChange={handleChange}
          className={errors.billingDate ? "border-red-500" : ""}
        />
        {errors.billingDate && (
          <p className="text-sm text-red-500">{errors.billingDate}</p>
        )}
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="name_on_card">Name on Card</Label>
        <Input
          type="text"
          id="name_on_card"
          placeholder="John Doe"
          value={formData.name_on_card}
          onChange={handleChange}
          className={errors.name_on_card ? "border-red-500" : ""}
        />
        {errors.name_on_card && (
          <p className="text-sm text-red-500">{errors.name_on_card}</p>
        )}
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="card_number">Card Number</Label>
        <Input
          type="text"
          id="card_number"
          placeholder="4242 4242 4242 4242"
          value={formData.card_number}
          onChange={handleChange}
          className={errors.card_number ? "border-red-500" : ""}
        />
        {errors.card_number && (
          <p className="text-sm text-red-500">{errors.card_number}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="expiration">Expiry Date</Label>
          <Input
            type="text"
            id="expiration"
            placeholder="YYYY/MM/DD"
            value={formData.expiration}
            onChange={handleChange}
            className={errors.expiration ? "border-red-500" : ""}
          />
          {errors.expiration && (
            <p className="text-sm text-red-500">{errors.expiration}</p>
          )}
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            type="text"
            id="cvc"
            placeholder="123"
            value={formData.cvc}
            onChange={handleChange}
            className={errors.cvc ? "border-red-500" : ""}
          />
          {errors.cvc && <p className="text-sm text-red-500">{errors.cvc}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
