import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plan } from "@/hooks/useGetPlans";
import { VehicleFormData } from "./types";

interface VehicleFormFieldsProps {
  formData: VehicleFormData;
  errors: Record<string, string>;
  plans: Plan[] | undefined;
  plansLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePlanChange: (value: string) => void;
}

export function VehicleFormFields({
  formData,
  errors,
  plans,
  plansLoading,
  handleChange,
  handlePlanChange,
}: VehicleFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="plan">Subscription Plan</Label>
        <Select
          value={formData.plan === "No plan" ? "" : formData.plan}
          onValueChange={handlePlanChange}
        >
          <SelectTrigger className={errors.plan ? "border-red-500" : ""}>
            <SelectValue placeholder="Select a plan" />
          </SelectTrigger>
          <SelectContent>
            {plansLoading ? (
              <SelectItem value="loading" disabled>
                Loading plans...
              </SelectItem>
            ) : (
              plans?.map((plan) => (
                <SelectItem key={plan.id} value={plan.name}>
                  {plan.name} (${plan.price}/month)
                </SelectItem>
              )) || (
                <>
                  <SelectItem value="Silver">
                    Silver Plan ($19.99/month)
                  </SelectItem>
                  <SelectItem value="Gold">Gold Plan ($29.99/month)</SelectItem>
                  <SelectItem value="Platinum">
                    Platinum Plan ($39.99/month)
                  </SelectItem>
                </>
              )
            )}
          </SelectContent>
        </Select>
        {errors.plan && <p className="text-sm text-red-500">{errors.plan}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="make">Make</Label>
          <Input
            type="text"
            id="make"
            placeholder="Toyota"
            value={formData.make}
            onChange={handleChange}
            className={errors.make ? "border-red-500" : ""}
          />
          {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="model">Model</Label>
          <Input
            type="text"
            id="model"
            placeholder="Camry"
            value={formData.model}
            onChange={handleChange}
            className={errors.model ? "border-red-500" : ""}
          />
          {errors.model && (
            <p className="text-sm text-red-500">{errors.model}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="year">Year</Label>
          <Input
            type="number"
            id="year"
            placeholder="2024"
            value={formData.year}
            onChange={handleChange}
            className={errors.year ? "border-red-500" : ""}
          />
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="color">Color</Label>
          <Input
            type="text"
            id="color"
            placeholder="Silver"
            value={formData.color}
            onChange={handleChange}
            className={errors.color ? "border-red-500" : ""}
          />
          {errors.color && (
            <p className="text-sm text-red-500">{errors.color}</p>
          )}
        </div>
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="licensePlate">License Plate</Label>
        <Input
          type="text"
          id="licensePlate"
          placeholder="ABC-1234"
          value={formData.licensePlate}
          onChange={handleChange}
          className={errors.licensePlate ? "border-red-500" : ""}
        />
        {errors.licensePlate && (
          <p className="text-sm text-red-500">{errors.licensePlate}</p>
        )}
      </div>
    </div>
  );
}
