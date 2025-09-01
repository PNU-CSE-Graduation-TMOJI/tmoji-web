import z from "zod";
import type { Image } from "@/api/schema/image";
import { ImageSchema } from "@/api/schema/image";
import api from "@/api/core/core";

const imageApi = {
  postImage: async (formData: FormData) => {
    try {
      const res = await api.post<Image>("/api/v1/image", formData);
      ImageSchema.parse(res);
      return res;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error);
      }
    }
  },
};
export default imageApi;
