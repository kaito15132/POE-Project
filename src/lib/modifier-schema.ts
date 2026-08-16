import { z } from "zod";

export const categories = ["Offensive", "Defensive", "Utility", "Recovery", "Resource", "Resistance", "Conversion", "Critical", "Penetration", "Other"] as const;
export const ratings = ["", "S", "A", "B", "C", "D", "F"] as const;

const optionalNumber = z.union([z.number(), z.nan(), z.null()]).transform((value) => value == null || Number.isNaN(value) ? null : value);

export const modifierInput = z.object({
  internalKey: z.string().trim().min(2).max(100).regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, and underscores"),
  aura: z.string().trim().min(1).max(80),
  displayText: z.string().trim().min(1).max(500),
  statDescription: z.string().trim().max(500).nullable().optional(),
  minRoll: optionalNumber.optional(), maxRoll: optionalNumber.optional(), weight: optionalNumber.optional(),
  category: z.enum(categories).default("Other"), notes: z.string().trim().max(1000).nullable().optional(),
  enabled: z.boolean().default(true), rating: z.enum(ratings).optional(),
}).refine((row) => row.minRoll == null || row.maxRoll == null || row.minRoll <= row.maxRoll, { message: "Minimum roll cannot exceed maximum roll" });

export type ModifierInput = z.infer<typeof modifierInput>;
