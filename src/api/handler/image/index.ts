import z from "zod";
import type { Image } from "@/api/schema/image";
import { ImageSchema } from "@/api/schema/image";
import client from "@/api/core/core";
import { ApiError } from "@/api/core";

const imageApi = {
  KEYS: {
    all: ["image"] as const,
    post: () => [...imageApi.KEYS.all, "post"] as const,
  },
  postImage: async (formData: FormData) => {
    try {
      const res = await client.post<Image>("/api/v1/image", formData);
      ImageSchema.parse(res);
      return res;
    } catch (error) {
      if (error instanceof ApiError) {
        alert("사진 업로드에 실패하였습니다. 다시 시도해주십시오.");
      }
      if (error instanceof z.ZodError) {
        console.error("type Error", error);
      }
      throw error;
    }
  },
};

export default imageApi;
