import api from "@/lib/axios";
import type { Booking, CreateBookingPayload } from "@/lib/types";

export async function bookSkill(
  skillId: string,
  payload: CreateBookingPayload
): Promise<Booking> {
  const res = await api.post<Booking>(`/api/skills/${skillId}/book`, payload);
  return res.data;
}

export async function getUserBookings(): Promise<Booking[]> {
  const res = await api.get<Booking[]>("/api/users/me/bookings");
  return res.data;
}

export async function acceptBooking(bookingId: string): Promise<Booking> {
  const res = await api.patch<Booking>(`/api/bookings/${bookingId}/accept`);
  return res.data;
}

export async function rejectBooking(bookingId: string): Promise<Booking> {
  const res = await api.patch<Booking>(`/api/bookings/${bookingId}/reject`);
  return res.data;
}

export async function completeBooking(bookingId: string): Promise<Booking> {
  const res = await api.patch<Booking>(`/api/bookings/${bookingId}/complete`);
  return res.data;
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  const res = await api.patch<Booking>(`/api/bookings/${bookingId}/cancel`);
  return res.data;
}
