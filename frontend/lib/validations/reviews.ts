import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Please select at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string()
    .trim()
    .min(1, "Please provide a feedback comment describing your session")
    .max(2000, "Review comment cannot exceed 2000 characters"),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
