import { z } from "zod";
import {
  LanguageSchema,
  ServiceModeSchema,
  ServiceStatusSchema,
  ServiceStepSchema,
} from "@/api/schema/common";

export const PostServiceReqSchema = z.object({
  filename: z.string(),
  originLanguage: LanguageSchema,
  serviceMode: ServiceModeSchema,
});
export type PostServiceReq = z.infer<typeof PostServiceReqSchema>;

export const PostServiceResSchema = z.object({
  id: z.number(),
  originImageId: z.number(),
  mode: ServiceModeSchema,
  step: ServiceStepSchema,
  status: ServiceStatusSchema,
  originLanguage: LanguageSchema,
  createdAt: z.string(),
});
export type PostServiceRes = z.infer<typeof PostServiceResSchema>;
