import { PaymentFormData } from "./types";

export const validatePaymentForm = (formData: PaymentFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Convert all form values to strings to ensure trim() works
  const nameOnCard = String(formData.name_on_card || "");
  const cardNumber = String(formData.card_number || "");
  const expiration = String(formData.expiration || "");
  const cvc = String(formData.cvc || "");

  if (!nameOnCard.trim()) {
    errors.name_on_card = "Name on card is required";
  }

  if (!cardNumber.trim()) {
    errors.card_number = "Card number is required";
  } else if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ""))) {
    errors.card_number = "Invalid card number";
  }

  if (!expiration.trim()) {
    errors.expiration = "Expiration date is required";
  } else if (!/^\d{4}\/\d{2}\/\d{2}$/.test(expiration)) {
    errors.expiration = "Invalid format (YYYY/MM/DD)";
  }

  if (!cvc.trim()) {
    errors.cvc = "CVC is required";
  } else if (!/^\d{3,4}$/.test(cvc)) {
    errors.cvc = "Invalid CVC";
  }

  return errors;
};
