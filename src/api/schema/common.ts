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
