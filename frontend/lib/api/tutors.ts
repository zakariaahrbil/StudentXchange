import { searchUsersBySkill } from "@/lib/api/skills";
import type { TutorSkillListing, UserSkillSearchDto } from "@/lib/types";

function mapUserSkillDtoToListing(dto: UserSkillSearchDto): TutorSkillListing {
  const firstName = dto.firstName || "Campus";
  const lastName = dto.lastName || "Peer";
  return {
    id: `listing-${dto.userId}-${dto.skillId}`,
    userId: dto.userId,
    firstName,
    lastName,
    university: dto.university || "Campus Partner",
    email: `${firstName.toLowerCase().replace(/\s+/g, "")}.${lastName.toLowerCase().replace(/\s+/g, "")}@campus.edu`,
    phoneNumber: dto.phoneNumber || null,
    avatarUrl: dto.avatarUrl || null,
    skillId: dto.skillId,
    skillName: dto.skillName,
    price: dto.skillPrice ?? 10,
    description: dto.skillDescription || "Peer service and skill exchange offered on campus.",
    rating: dto.skillRating > 0 ? dto.skillRating : 5.0,
    reviewCount: dto.skillRating > 0 ? 12 : 0,
  };
}

export async function searchTutors(query?: string): Promise<TutorSkillListing[]> {
  const trimmed = query?.trim() ?? "";

  try {
    const searchDtos = await searchUsersBySkill(trimmed || undefined);
    return searchDtos.map(mapUserSkillDtoToListing);
  } catch (err) {
    console.error("Failed to load skills from backend:", err);
    return [];
  }
}
