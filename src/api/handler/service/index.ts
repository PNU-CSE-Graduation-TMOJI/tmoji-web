import z from "zod";
import type { Service } from "@/api/schema/service";
import client from "@/api/core/core";
import { ApiError } from "@/api/core";
import { ServiceSchema } from "@/api/schema/service";

const serviceApi = {
  KEYS: {
    all: ["service"] as const,
    getService: () => [...serviceApi.KEYS.all, "get_service"] as const,
  },
  getService: async (serviceId: number) => {
    try {
      const res = await client.get<Service>(`/api/v1/service/${serviceId}`);
      ServiceSchema.parse(res);
      return res;
    } catch (error) {
      if (error instanceof ApiError) {
        alert("서비스 조회에 실패하였습니다. 다시 시도해주십시오.");
      }
      if (error instanceof z.ZodError) {
        console.error("type Error", error);
      }
      throw error;
    }
  },
};

export default serviceApi;
