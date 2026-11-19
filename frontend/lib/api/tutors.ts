import api from "@/lib/axios";
import type { Skill, TutorSkillListing } from "@/lib/types";

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

export async function searchTutors(query?: string): Promise<TutorSkillListing[]> {
  try {
    const res = await api.get<Skill[]>("/api/skills", {
      params: query ? { query } : undefined,
    });
    const backendSkills = res.data ?? [];

    const combined = [...MOCK_SERVICES];

    for (const skill of backendSkills) {
      if (!combined.some((t) => t.skillId === skill.id || t.skillName.toLowerCase() === skill.name.toLowerCase())) {
        combined.unshift({
          id: `serv-live-${skill.id}`,
          userId: `u-live-${skill.id}`,
          firstName: "Peer",
          lastName: "Provider",
          university: "Campus Partner",
          email: "peer.provider@campus.edu",
          phoneNumber: "+1 (555) 019-2834",
          avatarUrl: null,
          skillId: skill.id,
          skillName: skill.name,
          description: "Skill and peer service offered on campus for token exchange.",
          price: skill.price ?? 10,
          rating: 4.8,
          reviewCount: 12,
        });
      }
    }

    if (!query || query.trim() === "") {
      return combined;
    }

    const q = query.toLowerCase().trim();
    return combined.filter(
      (t) =>
        t.skillName.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        (t.university && t.university.toLowerCase().includes(q))
    );
  } catch {
    if (!query || query.trim() === "") {
      return MOCK_SERVICES;
    }
    const q = query.toLowerCase().trim();
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
