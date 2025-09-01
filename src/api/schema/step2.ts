import { z } from "zod";
import {
  AreaDetailSchema,
  AreaSchema,
  LanguageSchema,
  ServiceModeSchema,
  ServiceStatusSchema,
  ServiceStepSchema,
} from "@/api/schema/common";

export const PostAreasReqSchema = z.object({
  serviceId: z.number(),
  areas: z.array(AreaSchema),
});
export type PostAreasReq = z.infer<typeof PostAreasReqSchema>;

export const PostAreasResSchema = z.object({
  id: z.number(),
  originImageId: z.number(),
  mode: ServiceModeSchema,
  step: ServiceStepSchema,
  status: ServiceStatusSchema,
  originLanguage: LanguageSchema,
  createdAt: z.string(),
});
export type PostAreasRes = z.infer<typeof PostAreasResSchema>;

export const GetServiceStatusResSchema = z.object({
  isCompleted: z.boolean(),
  id: z.number(),
  status: ServiceStatusSchema,
  areas: z.nullable(z.array(AreaDetailSchema)),
});
export type GetServiceStatusRes = z.infer<typeof GetServiceStatusResSchema>;

export const PatchAreaTextsReqSchema = z.object({
  newOriginText: z.string(),
});
export type PatchAreaTextsReq = z.infer<typeof PatchAreaTextsReqSchema>;
