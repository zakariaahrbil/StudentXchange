import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSkill, deleteSkill, getSkills, getMySkills, updateSkill } from "../api/skills";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateSkillPayload } from "@/lib/types";

export function useGetSkills(query?: string) {
  return useQuery({
    queryKey: queryKeys.skills.list(query),
    queryFn: () => getSkills(query),
  });
}

export function useGetMySkills() {
  return useQuery({
    queryKey: queryKeys.skills.my(),
    queryFn: getMySkills,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createSkill"],
    mutationFn: (payload: string | CreateSkillPayload) => createSkill(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tutors.all });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateSkill"],
    mutationFn: ({
      skillId,
      payload,
    }: {
      skillId: string;
      payload: { name: string; description?: string; price?: number };
    }) => updateSkill(skillId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tutors.all });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteSkill"],
    mutationFn: (skillId: string) => deleteSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tutors.all });
    },
  });
}
