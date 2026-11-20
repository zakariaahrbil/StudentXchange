import { searchUsersBySkill } from "@/lib/api/skills";
import type { TutorSkillListing, UserSkillSearchDto } from "@/lib/types";

function mapUserSkillDtoToListing(dto: UserSkillSearchDto): TutorSkillListing {
  const firstName = dto.firstName || "Campus";
  const lastName = dto.lastName || "Peer";
  const hasRating = typeof dto.skillRating === "number" && dto.skillRating > 0;

  return {
    id: `listing-${dto.userId}-${dto.skillId}`,
    userId: dto.userId,
    firstName,
    lastName,
    university: dto.university || "Campus Partner",
    email: null, // Public user search does not expose direct email for privacy; revealed on booking
    phoneNumber: dto.phoneNumber || null,
    avatarUrl: dto.avatarUrl || null,
    skillId: dto.skillId,
    skillName: dto.skillName,
    price: dto.skillPrice ?? 10,
    description: dto.skillDescription || "Peer service and skill exchange offered on campus.",
    rating: hasRating ? dto.skillRating : undefined,
    reviewCount: undefined,
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
