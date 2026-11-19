"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getSkillReviews, createSkillReview } from "@/lib/api/skills";
import type { ReviewDto, CreateReviewPayload } from "@/lib/types";

export function useSkillReviews(skillId: string) {
  return useQuery<ReviewDto[]>({
    queryKey: queryKeys.reviews.bySkill(skillId),
    queryFn: () => getSkillReviews(skillId),
    enabled: Boolean(skillId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      skillId,
      payload,
    }: {
      skillId: string;
      payload: CreateReviewPayload;
    }) => createSkillReview(skillId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.bySkill(variables.skillId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tutors.all,
      });
    },
  });
}
