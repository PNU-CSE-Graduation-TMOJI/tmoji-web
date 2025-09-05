import z from "zod";

import type {
  GetServiceStatusRes,
  PatchAreaTextsReq,
  PostTranslateReq,
} from "@/api/schema/step3";
import type { AreaDetail } from "@/api/schema/common";
import client from "@/api/core/core";
import { ApiError } from "@/api/core";
import {
  GetServiceStatusResSchema,
  PostAreasResSchema,
} from "@/api/schema/step2";
import { AreaDetailSchema } from "@/api/schema/common";

const step3Api = {
  KEYS: {
    all: ["step_3"] as const,
    postTranslate: () => [...step3Api.KEYS.all, "post_translate"] as const,
    getServiceStatus: () =>
      [...step3Api.KEYS.all, "get_service_status"] as const,
    patchAreaText: () => [...step3Api.KEYS.all, "patch_area_text"] as const,
    deleteAreaText: () => [...step3Api.KEYS.all, "delete_area_text"] as const,
  },
  postTranslate: async (serviceId: number, request: PostTranslateReq) => {
    try {
      const res = await client.post<undefined>(
        `/api/v1/step-3/service/${serviceId}/translate`,
        request,
      );
      PostAreasResSchema.parse(res);
      return res;
    } catch (error) {
      if (error instanceof ApiError) {
        alert("번역 진행에 실패하였습니다. 다시 시도해 주십시오.");
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
        `/api/v1/step-3/service/${serviceId}/status`,
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
        `/api/v1/step-3/area/${serviceId}/${areaId}`,
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
        `/api/v1/step-3/area/${serviceId}/${areaId}`,
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

export default step3Api;
