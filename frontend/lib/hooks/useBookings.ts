"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  acceptBooking,
  bookSkill,
  cancelBooking,
  completeBooking,
  getUserBookings,
  rejectBooking,
} from "@/lib/api/bookings";
import type { Booking, CreateBookingPayload } from "@/lib/types";

export function useUserBookings() {
  return useQuery<Booking[]>({
    queryKey: queryKeys.bookings.me(),
    queryFn: getUserBookings,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<
    Booking,
    unknown,
    { skillId: string; payload: CreateBookingPayload }
  >({
    mutationFn: ({ skillId, payload }) => bookSkill(skillId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
}

export function useAcceptBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, unknown, string>({
    mutationFn: (bookingId) => acceptBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, unknown, string>({
    mutationFn: (bookingId) => rejectBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}

export function useCompleteBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, unknown, string>({
    mutationFn: (bookingId) => completeBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, unknown, string>({
    mutationFn: (bookingId) => cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
}
