export type FieldErrors = Record<string, string>;

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  fieldErrors?: FieldErrors;
}

export interface AuthResponse {
  accessToken: string;
  userId: string;
  email: string;
  role: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  tokenBalance: number;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  university?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  tokenBalance?: number;
  role: string;
  status: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string | null;
  price?: number;
}

export interface CreateSkillPayload {
  name: string;
  description?: string;
  price?: number;
}

export type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export interface Booking {
  id: string;
  buyerId: string;
  skillId: string;
  skillOwnerId: string;
  skillName: string;
  price: number;
  realizationAt: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
  description?: string;
}

export interface CreateBookingPayload {
  realizationAt: string;
}

export interface TutorSkillListing {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  university?: string | null;
  email: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  skillId: string;
  skillName: string;
  price: number;
  description?: string;
  rating?: number;
  reviewCount?: number;
}

export interface UserSkillSearchDto {
  userId: string;
  firstName: string;
  lastName: string;
  university?: string | null;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  skillId: string;
  skillName: string;
  skillDescription?: string | null;
  skillPrice: number;
  skillRating: number;
}

export interface ReviewDto {
  id: string;
  skillId: string;
  bookingId: string;
  reviewerId: string;
  skillOwnerId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}
