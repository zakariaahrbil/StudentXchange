import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Please select at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string()
    .max(500, "Review comment cannot exceed 500 characters")
    .optional(),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
