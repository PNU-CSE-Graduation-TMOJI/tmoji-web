import { z } from "zod";
import {
  AreaTranslatedSchema,
  LanguageSchema,
  ServiceStatusSchema,
} from "@/api/schema/common";

export const PostTranslateReqSchema = z.object({
  targetLanguage: LanguageSchema,
});
export type PostTranslateReq = z.infer<typeof PostTranslateReqSchema>;

export const GetServiceStatusResSchema = z.object({
  isCompleted: z.boolean(),
  id: z.number(),
  status: ServiceStatusSchema,
  areas: z.nullable(z.array(AreaTranslatedSchema)),
});
export type GetServiceStatusRes = z.infer<typeof GetServiceStatusResSchema>;

export const PatchAreaTextsReqSchema = z.object({
  newTranslatedText: z.string(),
});
export type PatchAreaTextsReq = z.infer<typeof PatchAreaTextsReqSchema>;
