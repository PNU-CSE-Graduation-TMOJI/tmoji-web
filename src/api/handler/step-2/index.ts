import z from "zod";

import type {
  GetServiceStatusRes,
  PatchAreaTextsReq,
  PostAreasReq,
  PostAreasRes,
} from "@/api/schema/step2";
import type { AreaDetail } from "@/api/schema/common";
import client from "@/api/core/core";
import { ApiError } from "@/api/core";
import {
  GetServiceStatusResSchema,
  PostAreasResSchema,
} from "@/api/schema/step2";
import { AreaDetailSchema } from "@/api/schema/common";

const step2Api = {
  KEYS: {
    all: ["step_2"] as const,
    postAreas: () => [...step2Api.KEYS.all, "post_areas"] as const,
    getServiceStatus: () =>
      [...step2Api.KEYS.all, "get_service_status"] as const,
    patchAreaText: () => [...step2Api.KEYS.all, "patch_area_text"] as const,
    deleteAreaText: () => [...step2Api.KEYS.all, "delete_area_text"] as const,
  },
  postAreas: async (request: PostAreasReq) => {
    try {
      const res = await client.post<PostAreasRes>(
        "/api/v1/step-2/areas",
        request,
      );
      PostAreasResSchema.parse(res);
      return res;
    } catch (error) {
      if (error instanceof ApiError) {
        alert("영역 생성에 실패하였습니다. 다시 시도해 주십시오.");
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
        `/api/v1/step-2/service/${serviceId}/status`,
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
  patchAreaText: async (
    serviceId: number,
    areaId: number,
    request: PatchAreaTextsReq,
  ) => {
    try {
      const res = await client.patch<AreaDetail>(
        `/api/v1/step-2/area/${serviceId}/${areaId}`,
        request,
      );
      AreaDetailSchema.parse(res);
      return res;
    } catch (error) {
      if (error instanceof ApiError) {
        alert("텍스트 수정에 실패하였습니다. 다시 시도해 주십시오.");
      }
      if (error instanceof z.ZodError) {
        console.error("type Error", error);
      }
      throw error;
    }
  },
  deleteAreaText: async (serviceId: number, areaId: number) => {
    try {
      const res = await client.delete<undefined>(
        `/api/v1/step-2/area/${serviceId}/${areaId}`,
      );
      return res;
    } catch (error) {
      if (error instanceof ApiError) {
        alert("텍스트 수정에 실패하였습니다. 다시 시도해 주십시오.");
      }
      if (error instanceof z.ZodError) {
        console.error("type Error", error);
      }
      throw error;
    }
  },
};

export default step2Api;
