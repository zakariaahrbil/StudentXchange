import api from "../axios";
import type { Skill } from "@/lib/types";

export type { Skill };

export async function getSkills(query?: string): Promise<Skill[]> {
    const res = await api.get<Skill[]>("/api/skills", {
        params: query ? { query } : undefined,
    });
    return res.data;
}

export async function createSkill(name: string):Promise<Skill> {
    const res = await api.post<Skill>("/api/users/me/skills", { name });
    return res.data;
}

export async function deleteSkill(skillId: string): Promise<void> {
    await api.delete(`/api/users/me/skills/${skillId}`);
}