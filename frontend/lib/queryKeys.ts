export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },
  skills: {
    all: ["skills"] as const,
    list: (query?: string) => [...queryKeys.skills.all, "list", query ?? ""] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    me: () => [...queryKeys.bookings.all, "me"] as const,
  },
} as const;