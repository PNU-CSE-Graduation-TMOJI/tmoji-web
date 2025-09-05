import { z } from "zod";
import { ServiceStatusSchema } from "@/api/schema/common";

export const GetServiceStatusResSchema = z.object({
  isCompleted: z.boolean(),
  id: z.number(),
  status: ServiceStatusSchema,
  composedImageFilename: z.nullable(z.string()),
});
export type GetServiceStatusRes = z.infer<typeof GetServiceStatusResSchema>;
