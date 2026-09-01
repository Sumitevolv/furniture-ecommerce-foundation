"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addressSchema, type AddressFormValues } from "@/utils/validation";

interface AddressFormProps {
  defaultValues?: Partial<AddressFormValues>;
  onSubmit: (values: AddressFormValues) => void;
  formId: string;
}

/**
 * Exposes its submit via a form `id` so the parent checkout page can trigger
 * it from an external "Continue" button, keeping the multi-section layout
 * (address -> summary -> pay) in one page without nested forms.
 */
export function AddressForm({ defaultValues, onSubmit, formId }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" autoComplete="name" {...register("fullName")} error={errors.fullName?.message} />
        {errors.fullName && <p className="text-xs text-danger">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} error={errors.phone?.message} />
        {errors.phone && <p className="text-xs text-danger">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="line1">Address line 1</Label>
        <Input id="line1" autoComplete="address-line1" {...register("line1")} error={errors.line1?.message} />
        {errors.line1 && <p className="text-xs text-danger">{errors.line1.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="line2">Address line 2 (optional)</Label>
        <Input id="line2" autoComplete="address-line2" {...register("line2")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" autoComplete="address-level2" {...register("city")} error={errors.city?.message} />
          {errors.city && <p className="text-xs text-danger">{errors.city.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" autoComplete="address-level1" {...register("state")} error={errors.state?.message} />
          {errors.state && <p className="text-xs text-danger">{errors.state.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal code</Label>
          <Input id="postalCode" autoComplete="postal-code" {...register("postalCode")} error={errors.postalCode?.message} />
          {errors.postalCode && <p className="text-xs text-danger">{errors.postalCode.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" autoComplete="country-name" {...register("country")} error={errors.country?.message} />
          {errors.country && <p className="text-xs text-danger">{errors.country.message}</p>}
        </div>
      </div>
    </form>
  );
}
