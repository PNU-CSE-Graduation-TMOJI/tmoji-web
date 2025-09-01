import { z } from "zod";

export const LanguageSchema = z.enum(["EN", "KO", "JP"]);
export type Language = z.infer<typeof LanguageSchema>;

export const ServiceModeSchema = z.enum(["MACHINE", "AI"]);
export type ServiceMode = z.infer<typeof ServiceModeSchema>;

export const ServiceStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);
export type ServiceStatus = z.infer<typeof ServiceStatusSchema>;

export const ServiceStepSchema = z.enum([
  "BOUNDING",
  "DETECTING",
  "TRANSLATING",
  "COMPOSING",
]);
export type ServiceStep = z.infer<typeof ServiceStepSchema>;

export const AreaSchema = z.object({
  x1: z.number(),
  x2: z.number(),
  y1: z.number(),
  y2: z.number(),
});
export type Area = z.infer<typeof AreaSchema>;

export const AreaDetailSchema = AreaSchema.extend({
  id: z.number(),
  createdAt: z.string(),
  serviceId: z.number(),
  originText: z.string(),
});
export type AreaDetail = z.infer<typeof AreaDetailSchema>;
