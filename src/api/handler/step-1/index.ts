import z from "zod";
import type { PostServiceReq, PostServiceRes } from "@/api/schema/step1";
import { PostServiceResSchema } from "@/api/schema/step1";

import client from "@/api/core/core";
import { ApiError } from "@/api/core";

const step1Api = {
  KEYS: {
    all: ["step_1"] as const,
    postService: () => [...step1Api.KEYS.all, "post_Service"] as const,
  },
  postService: async (request: PostServiceReq) => {
    try {
      const res = await client.post<PostServiceRes>(
        "/api/v1/step-1/service",
        request,
      );
      PostServiceResSchema.parse(res);
      return res;
    } catch (error) {
      if (error instanceof ApiError) {
        alert("번역 서비스 시작에 실패하였습니다. 다시 시도해 주십시오.");
      }
      if (error instanceof z.ZodError) {
        console.error("type Error", error);
      }
      throw error;
    }
  },
};

export default step1Api;
