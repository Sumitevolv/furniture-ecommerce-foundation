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
import { loginSchema, type LoginFormValues } from "@/utils/validation";
import { ApiError } from "@/types/api";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(values);
      toast.success("Welcome back");
      router.push("/account");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          autoComplete="current-password"
          {...register("password")}
          error={errors.password?.message}
        />
        {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
