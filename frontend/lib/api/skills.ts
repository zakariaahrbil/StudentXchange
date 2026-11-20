import api from "../axios";
import type {
  Skill,
  CreateSkillPayload,
  UserSkillSearchDto,
  ReviewDto,
  CreateReviewPayload,
} from "@/lib/types";

export type {
  Skill,
  CreateSkillPayload,
  UserSkillSearchDto,
  ReviewDto,
  CreateReviewPayload,
};

export async function getSkills(query?: string): Promise<Skill[]> {
  const res = await api.get<Skill[]>("/api/skills", {
    params: query ? { query } : undefined,
  });
  return res.data;
}

export async function getMySkills(): Promise<Skill[]> {
  const res = await api.get<Skill[]>("/api/users/me/skills");
  return res.data;
}

export async function createSkill(payload: string | CreateSkillPayload): Promise<Skill> {
  const body =
    typeof payload === "string"
      ? { name: payload, price: 10 }
      : { price: 10, ...payload };
  const res = await api.post<Skill>("/api/users/me/skills", body);
  return res.data;
}

export async function updateSkill(
  skillId: string,
  payload: { name: string; description?: string; price?: number }
): Promise<Skill> {
  const res = await api.put<Skill>(`/api/users/me/skills/${skillId}`, payload);
  return res.data;
}

export async function deleteSkill(skillId: string): Promise<void> {
  await api.delete(`/api/users/me/skills/${skillId}`);
}

export async function searchUsersBySkill(skill?: string): Promise<UserSkillSearchDto[]> {
  const params = skill && skill.trim() !== "" ? { skill: skill.trim() } : undefined;
  const res = await api.get<UserSkillSearchDto[]>("/api/users/search", { params });
  return res.data;
}

export async function getSkillReviews(skillId: string): Promise<ReviewDto[]> {
  const res = await api.get<ReviewDto[]>(`/api/skills/${skillId}/reviews`);
  return res.data;
}

export async function createSkillReview(
  skillId: string,
  payload: CreateReviewPayload
): Promise<ReviewDto> {
  const res = await api.post<ReviewDto>(`/api/skills/${skillId}/reviews`, payload);
  return res.data;
}