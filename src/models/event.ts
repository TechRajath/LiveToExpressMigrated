import { z } from "zod";

// Language Enum (can be extended)
export const EVENT_LANGUAGES = {
  ENGLISH: "English",
  HINDI: "Hindi",
  KANNADA: "Kannada",
  TAMIL: "Tamil",
  OTHER: "Other",
} as const;

export const EVENT_STATUSES = [
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
] as const;

export const events = z
  .object({
    // Basic Info
    title: z.string().min(3).describe("Indexed - name/title"),
    description: z.string().min(10),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
      .describe("Indexed - date"),
    //day: z.string(),
    time: z.string(),
    category: z.string().min(2).describe("Indexed - category"),

    artistDetails: z.array(
      z.object({
        username: z.string().min(2),
        bio: z.string().optional(),
        avatar: z.string().url().optional(),
      })
    ),

    // Ticketing
    totalTickets: z.number().int().positive(),
    ticketsSold: z.number().int().nonnegative().default(0),
    remainingTickets: z.number().int().nonnegative().optional(),
    price: z.number().positive(),

    // Participants
    totalMembers: z.number().int().nonnegative().optional(),
    ageGroup: z.string(),
    idealFor: z.string().optional(),
    groupSize: z.number().int().positive().optional(),

    // Multimedia
    images: z
      .array(
        z.object({
          url: z.string().url(),
          alt: z.string().optional(),
        })
      )
      .min(1),

    // Optional Properties
    petFriendly: z.enum(["yes", "no"]).default("no"),
    languages: z.array(
      z.enum(Object.values(EVENT_LANGUAGES) as [string, ...string[]])
    ),

    // Meta
    userId: z.string().min(1, "Creator ID is required"),
    status: z
      .enum(EVENT_STATUSES)
      .default("upcoming")
      .describe("Indexed - status"),
  })
  .superRefine((data, ctx) => {
    const calcRemaining = data.totalTickets - (data.ticketsSold ?? 0);
    if (
      data.remainingTickets !== undefined &&
      data.remainingTickets !== calcRemaining
    ) {
      ctx.addIssue({
        code: "custom",
        message: `remainingTickets must be totalTickets - ticketsSold (${calcRemaining})`,
        path: ["remainingTickets"],
      });
    }
  });
export type eventInput = z.infer<typeof events>;
