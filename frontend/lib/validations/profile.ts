import { z } from "zod";

export const profilePhoneSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/,
      "Please enter a valid phone number (e.g. +1 555-0199 or 0612345678)"
    )
    .optional()
    .or(z.literal("")),
});

export type ProfilePhoneInput = z.infer<typeof profilePhoneSchema>;
