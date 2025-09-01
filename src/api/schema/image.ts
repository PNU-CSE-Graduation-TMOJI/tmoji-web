import { z } from "zod";

export const ImageSchema = z.object({
  id: z.number(),
  filename: z.string(),
  createdAt: z.string(),
});

export type Image = z.infer<typeof ImageSchema>;
