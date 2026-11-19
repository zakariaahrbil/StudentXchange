import api from "@/lib/axios";
import type { Skill, TutorSkillListing } from "@/lib/types";

const MOCK_TUTORS: TutorSkillListing[] = [
  {
    id: "tut-1",
    userId: "u-101",
    firstName: "Sarah",
    lastName: "Chen",
    university: "Stanford University",
    email: "sarah.chen@stanford.edu",
    phoneNumber: "+1 (650) 412-8890",
    avatarUrl: null,
    skillId: "sk-1",
    skillName: "React & Next.js Architecture",
    price: 15,
  },
  {
    id: "tut-2",
    userId: "u-102",
    firstName: "Marcus",
    lastName: "Aurelius",
    university: "MIT",
    email: "marcus.a@mit.edu",
    phoneNumber: "+1 (617) 890-3321",
    avatarUrl: null,
    skillId: "sk-2",
    skillName: "Calculus II & Linear Algebra",
    price: 12,
  },
  {
    id: "tut-3",
    userId: "u-103",
    firstName: "Amira",
    lastName: "El-Sayed",
    university: "UC Berkeley",
    email: "amira.sayed@berkeley.edu",
    phoneNumber: "+1 (510) 332-9014",
    avatarUrl: null,
    skillId: "sk-3",
    skillName: "UI/UX & Design Systems with Figma",
    price: 10,
  },
  {
    id: "tut-4",
    userId: "u-104",
    firstName: "Lucas",
    lastName: "Vance",
    university: "Columbia University",
    email: "lucas.vance@columbia.edu",
    phoneNumber: "+1 (212) 554-7781",
    avatarUrl: null,
    skillId: "sk-4",
    skillName: "Python & Data Structures",
    price: 20,
  },
  {
    id: "tut-5",
    userId: "u-105",
    firstName: "Elena",
    lastName: "Rostova",
    university: "Oxford University",
    email: "elena.rostova@oxford.ac.uk",
    phoneNumber: "+44 7911 123456",
    avatarUrl: null,
    skillId: "sk-5",
    skillName: "Organic Chemistry & Bio-mechanics",
    price: 18,
  },
  {
    id: "tut-6",
    userId: "u-106",
    firstName: "David",
    lastName: "Miller",
    university: "University of Toronto",
    email: "david.m@utoronto.ca",
    phoneNumber: "+1 (416) 778-9902",
    avatarUrl: null,
    skillId: "sk-6",
    skillName: "Machine Learning with PyTorch",
    price: 25,
  },
];

export async function searchTutors(query?: string): Promise<TutorSkillListing[]> {
  try {
    // Optionally fetch backend skills to enrich or supplement
    const res = await api.get<Skill[]>("/api/skills", {
      params: query ? { query } : undefined,
    });
    const backendSkills = res.data ?? [];

    // Combine backend skills with mock tutor profiles if available
    const combined = [...MOCK_TUTORS];

    for (const skill of backendSkills) {
      if (!combined.some((t) => t.skillId === skill.id || t.skillName.toLowerCase() === skill.name.toLowerCase())) {
        combined.unshift({
          id: `tut-live-${skill.id}`,
          userId: `u-live-${skill.id}`,
          firstName: "Peer",
          lastName: "Tutor",
          university: "Campus Partner",
          email: "peer.tutor@campus.edu",
          phoneNumber: "+1 (555) 019-2834",
          avatarUrl: null,
          skillId: skill.id,
          skillName: skill.name,
          price: skill.price ?? 10,
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
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        (t.university && t.university.toLowerCase().includes(q))
    );
  } catch {
    // Fallback gracefully to MOCK_TUTORS if backend is offline or unauthenticated
    if (!query || query.trim() === "") {
      return MOCK_TUTORS;
    }
    const q = query.toLowerCase().trim();
    return MOCK_TUTORS.filter(
      (t) =>
        t.skillName.toLowerCase().includes(q) ||
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        (t.university && t.university.toLowerCase().includes(q))
    );
  }
}
