import { getSkills, searchUsersBySkill } from "@/lib/api/skills";
import type { TutorSkillListing, UserSkillSearchDto } from "@/lib/types";

const MOCK_SERVICES: TutorSkillListing[] = [
  {
    id: "serv-1",
    userId: "u-101",
    firstName: "Sarah",
    lastName: "Chen",
    university: "Stanford University",
    email: "sarah.chen@stanford.edu",
    phoneNumber: "+1 (650) 412-8890",
    avatarUrl: null,
    skillId: "sk-1",
    skillName: "React & Next.js Architecture",
    description: "Code reviews, debugging complex Next.js full-stack issues, and component architecture guidance.",
    price: 15,
    rating: 4.9,
    reviewCount: 28,
  },
  {
    id: "serv-2",
    userId: "u-102",
    firstName: "Alex",
    lastName: "Petrov",
    university: "Campus Maintenance & Housing",
    email: "alex.petrov@campus.edu",
    phoneNumber: "+1 (617) 890-3321",
    avatarUrl: null,
    skillId: "sk-2",
    skillName: "Plumbing & Leak Repairs",
    description: "Hands-on diagnostic check on sink/bathroom leaks, pipe fittings, drain clearing, and fixture adjustments.",
    price: 18,
    rating: 4.9,
    reviewCount: 19,
  },
  {
    id: "serv-3",
    userId: "u-103",
    firstName: "Amira",
    lastName: "El-Sayed",
    university: "UC Berkeley",
    email: "amira.sayed@berkeley.edu",
    phoneNumber: "+1 (510) 332-9014",
    avatarUrl: null,
    skillId: "sk-3",
    skillName: "UI/UX & Figma Design Systems",
    description: "Interactive wireframing, component auto-layout, prototype walkthroughs, and visual hierarchy feedback.",
    price: 12,
    rating: 5.0,
    reviewCount: 34,
  },
  {
    id: "serv-4",
    userId: "u-104",
    firstName: "Lucas",
    lastName: "Vance",
    university: "Columbia University",
    email: "lucas.vance@columbia.edu",
    phoneNumber: "+1 (212) 554-7781",
    avatarUrl: null,
    skillId: "sk-4",
    skillName: "Apartment Moving & Furniture Assembly",
    description: "Assistance with heavy lifting, moving boxes, loading vehicles, and assembling IKEA furniture quickly.",
    price: 16,
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: "serv-5",
    userId: "u-105",
    firstName: "Elena",
    lastName: "Rostova",
    university: "Oxford University",
    email: "elena.rostova@oxford.ac.uk",
    phoneNumber: "+44 7911 123456",
    avatarUrl: null,
    skillId: "sk-5",
    skillName: "Calculus II & Differential Equations",
    description: "Step-by-step problem walkthroughs for Taylor series, integration by parts, and exam preparation.",
    price: 14,
    rating: 4.9,
    reviewCount: 22,
  },
  {
    id: "serv-6",
    userId: "u-106",
    firstName: "David",
    lastName: "Miller",
    university: "University of Toronto",
    email: "david.m@utoronto.ca",
    phoneNumber: "+1 (416) 778-9902",
    avatarUrl: null,
    skillId: "sk-6",
    skillName: "Python & Data Structures",
    description: "LeetCode interview prep, recursion trees, graph algorithms, and algorithmic complexity analysis.",
    price: 20,
    rating: 4.7,
    reviewCount: 18,
  },
];

function mapUserSkillDtoToListing(dto: UserSkillSearchDto): TutorSkillListing {
  const firstName = dto.firstName || "Campus";
  const lastName = dto.lastName || "Peer";
  return {
    id: `listing-${dto.userId}-${dto.skillId}`,
    userId: dto.userId,
    firstName,
    lastName,
    university: dto.university || "Campus Partner",
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@campus.edu`,
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
    // ── Call live backend GET /api/users/search (now accepts optional skill query)
    const searchDtos = await searchUsersBySkill(trimmed || undefined);
    let liveListings: TutorSkillListing[] = searchDtos.map(mapUserSkillDtoToListing);

    // Fallback if no user listings exist yet on empty query
    if (liveListings.length === 0 && trimmed === "") {
      try {
        const backendSkills = await getSkills();
        liveListings = backendSkills.map((skill) => ({
          id: `serv-live-${skill.id}`,
          userId: `u-live-${skill.id}`,
          firstName: "Campus",
          lastName: "Peer",
          university: "Campus Partner",
          email: "peer.provider@campus.edu",
          phoneNumber: "+1 (555) 019-2834",
          avatarUrl: null,
          skillId: skill.id,
          skillName: skill.name,
          price: skill.price ?? 10,
          description: skill.description || "Skill and peer service offered on campus for token exchange.",
          rating: 5.0,
          reviewCount: 0,
        }));
      } catch {
        // ignore secondary fallback error
      }
    }

    // Merge with sample peer offerings, prioritizing live backend results
    const combined = [...liveListings];
    for (const mock of MOCK_SERVICES) {
      const alreadyIncluded = combined.some(
        (item) => item.skillName.toLowerCase() === mock.skillName.toLowerCase()
      );
      if (!alreadyIncluded) {
        combined.push(mock);
      }
    }

    if (!trimmed) {
      return combined;
    }

    const q = trimmed.toLowerCase();
    return combined.filter(
      (t) =>
        t.skillName.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        (t.university && t.university.toLowerCase().includes(q))
    );
  } catch {
    // Graceful offline fallback to mock services
    if (!trimmed) {
      return MOCK_SERVICES;
    }
    const q = trimmed.toLowerCase();
    return MOCK_SERVICES.filter(
      (t) =>
        t.skillName.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        (t.university && t.university.toLowerCase().includes(q))
    );
  }
}
