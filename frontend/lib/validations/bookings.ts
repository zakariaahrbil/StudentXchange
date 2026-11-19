import { z } from "zod";
import type { CreateBookingPayload } from "@/lib/types";

export const bookingFormSchema = z.object({
  skillId: z.string().min(1, "Skill is required"),
  realizationAt: z
    .string()
    .min(1, "Please choose a session date and time")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date.getTime() > Date.now();
    }, "Session date and time must be in the future"),
  description: z
    .string()
    .min(5, "Please describe what specific help you need (min 5 characters)")
    .max(2000, "Description cannot exceed 2000 characters"),
});

export type BookingFormInput = z.infer<typeof bookingFormSchema>;

export function toCreateBookingPayload(input: BookingFormInput): CreateBookingPayload {
  return {
    realizationAt: new Date(input.realizationAt).toISOString(),
    description: input.description?.trim() || undefined,
  };
}
