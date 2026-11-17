import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSkill, deleteSkill, getSkills } from "../api/skills";

export function useGetSkills(query?: string) {
  return useQuery({
    queryKey: ["skills", query ?? ""],
    queryFn: () => getSkills(query),
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createSkill"],
    mutationFn: (name: string) => createSkill(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteSkill"],
    mutationFn: (skillId: string) => deleteSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
}
