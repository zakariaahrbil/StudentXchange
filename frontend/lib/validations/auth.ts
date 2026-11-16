import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(255, "First name must not exceed 255 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(255, "Last name must not exceed 255 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(255, "Email must not exceed 255 characters")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must not exceed 72 characters"),
  university: z
    .string()
    .trim()
    .max(255, "University name must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
