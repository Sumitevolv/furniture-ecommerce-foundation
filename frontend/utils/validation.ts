import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const addressSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  line1: z.string().trim().min(1, "Address is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  postalCode: z.string().trim().min(3, "Postal code is required"),
  country: z.string().trim().min(1, "Country is required"),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().trim().optional(),
  comment: z.string().trim().min(10, "Please write at least 10 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;
export type ReviewFormValues = z.infer<typeof reviewSchema>;
