"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema, type RegisterFormValues } from "@/utils/validation";
import { ApiError } from "@/types/api";

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await registerUser(values);
      toast.success("Welcome to Fauteuil & Co.");
      router.push("/account");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Unable to create your account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" autoComplete="given-name" {...register("firstName")} error={errors.firstName?.message} />
          {errors.firstName && <p className="text-xs text-danger">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" autoComplete="family-name" {...register("lastName")} error={errors.lastName?.message} />
          {errors.lastName && <p className="text-xs text-danger">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
        {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />
        {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        {errors.confirmPassword && <p className="text-xs text-danger">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
        Create account
      </Button>
    </form>
  );
}
