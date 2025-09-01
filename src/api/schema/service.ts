import { z } from "zod";
import {
  LanguageSchema,
  ServiceModeSchema,
  ServiceStatusSchema,
  ServiceStepSchema,
} from "@/api/schema/common";
import { ImageSchema } from "@/api/schema/image";

export const ServiceSchema = z.object({
  id: z.number(),
  originImageId: z.number(),
  composedImageId: z.nullable(z.number()),
  mode: ServiceModeSchema,
  step: ServiceStepSchema,
  status: ServiceStatusSchema,
  originLanguage: LanguageSchema,
  targetLanguage: z.nullable(LanguageSchema),
  createdAt: z.string(),
  originImage: ImageSchema,
  composedImage: z.nullable(ImageSchema),
});

export type Service = z.infer<typeof ServiceSchema>;
