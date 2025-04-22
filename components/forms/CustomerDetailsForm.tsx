import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCheckEmailExists } from "@/hooks/useCheckEmailExists";

export type CustomerFormData = {
  name: string;
  email: string;
  phone: string;
};

interface CustomerDetailsFormProps {
  formData: CustomerFormData;
  onChange: (data: CustomerFormData) => void;
}

export function CustomerDetailsForm({ formData, onChange }: CustomerDetailsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [debouncedEmail, setDebouncedEmail] = useState(formData.email);
  
  // Check if email exists
  const { data: emailExists, isLoading: checkingEmail } = useCheckEmailExists(debouncedEmail);
  
  // Debounce email check to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.email) {
        setDebouncedEmail(formData.email);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [formData.email]);
  
  // Set error if email exists
  useEffect(() => {
    if (emailExists && debouncedEmail) {
      setErrors(prev => ({
        ...prev,
        email: "This email is already in use"
      }));
    }
  }, [emailExists, debouncedEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updatedData = { ...formData, [id]: value };
    onChange(updatedData);

    // Clear error when user types
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          type="text" 
          id="name" 
          placeholder="John Doe" 
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input 
            type="email" 
            id="email" 
            placeholder="john@example.com" 
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {checkingEmail && formData.email && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
              Checking...
            </div>
          )}
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          type="tel" 
          id="phone" 
          placeholder="(555) 555-5555" 
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>
    </div>
  );
}
