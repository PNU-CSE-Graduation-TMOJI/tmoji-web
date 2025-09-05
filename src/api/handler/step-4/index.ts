import z from "zod";

import type { GetServiceStatusRes } from "@/api/schema/step4";
import { GetServiceStatusResSchema } from "@/api/schema/step4";
import client from "@/api/core/core";
import { ApiError } from "@/api/core";

const step4Api = {
  KEYS: {
    all: ["step_4"] as const,
    postCompose: () => [...step4Api.KEYS.all, "post_compose"] as const,
    getServiceStatus: () =>
      [...step4Api.KEYS.all, "get_service_status"] as const,
  },
  postCompose: async (serviceId: number) => {
    try {
      const res = await client.post<undefined>(
        `/api/v1/step-4/service/${serviceId}/compose`,
      );
      return res;
    } catch (error) {
      if (error instanceof ApiError) {
        alert("합성 진행에 실패하였습니다. 다시 시도해 주십시오.");
      }
      if (error instanceof z.ZodError) {
        console.error("type Error", error);
      }
      throw error;
    }
  },
  getServiceStatus: async (serviceId: number) => {
    try {
      const res = await client.get<GetServiceStatusRes>(
        `/api/v1/step-4/service/${serviceId}/status`,
      );
      GetServiceStatusResSchema.parse(res);
      return res;
    } catch (error) {
      if (error instanceof ApiError) {
        alert("서비스 정보 조회에 실패하였습니다. 다시 시도해 주십시오.");
      }
      if (error instanceof z.ZodError) {
        console.error("type Error", error);
      }
      throw error;
    }
  },
};

export default step4Api;
