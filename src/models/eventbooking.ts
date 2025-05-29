import { z } from "zod";

export const EventBookingSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  eventId: z.string().min(1, "Event ID is required"),
  ticketCount: z.number().int().min(1, "At least one ticket is required"),
  ticketAmount: z.number().int(),
  // Accept current date from backend logic
  bookingDate: z.date({
    required_error: "Booking date is required",
    invalid_type_error: "Must be a valid Date object",
  }),

  // Accept time string like "14:30"
  bookingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),

  status: z.enum(["pending", "completed", "cancelled"]),
});

export type EventBooking = z.infer<typeof EventBookingSchema>;
