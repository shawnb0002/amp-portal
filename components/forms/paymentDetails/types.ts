export type PaymentFormData = {
  billingDate: string;
  name_on_card: string;
  card_number: string;
  expiration: string;
  cvc: string;
};

export interface PaymentDetailsFormProps {
  formData?: PaymentFormData;
  onChange?: (data: PaymentFormData) => void;
  userId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}
