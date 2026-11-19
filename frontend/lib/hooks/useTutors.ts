"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { searchTutors } from "@/lib/api/tutors";
import type { TutorSkillListing } from "@/lib/types";

export function useTutors(query?: string) {
  return useQuery<TutorSkillListing[]>({
    queryKey: queryKeys.tutors.list(query),
    queryFn: () => searchTutors(query),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
