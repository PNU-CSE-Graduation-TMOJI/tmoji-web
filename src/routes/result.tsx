import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import type { Service } from "@/api/schema/service";
import ContentWrapper from "@/components/ContentWrapper";
import c from "@/utils/c";
import step4Api from "@/api/handler/step-4";
import serviceApi from "@/api/handler/service";
import { IMAGE_URL_BASE } from "@/constansts";

type SearchParams = {
  id: number;
};

export const Route = createFileRoute("/result")({
  component: App,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      id: Number(search.id ?? 0),
    };
  },
});

function App() {
  const { id } = Route.useSearch();
  const queryClient = useQueryClient();

  // API
  const { data: statusData } = useQuery({
    queryKey: [...step4Api.KEYS.getServiceStatus(), id],
    queryFn: () => step4Api.getServiceStatus(id),
    refetchOnWindowFocus: false,
    refetchInterval: (query) => {
      const needRefetch =
        query.state.data && query.state.data.isCompleted ? false : 3000;
      return needRefetch;
    },
  });

  // state
  const [serviceData, setServiceData] = useState<Service>();

  // useEffect
  useEffect(() => {
    const getServiceData = async () => {
      const data = await queryClient.fetchQuery({
        queryKey: [...serviceApi.KEYS.getService(), id],
        queryFn: () => serviceApi.getService(id),
      });
      setServiceData(data);
    };

    if (statusData && statusData.isCompleted) {
      getServiceData();
    }
  }, [statusData]);

  if (!statusData || !serviceData)
    return (
      <div>
        <ContentWrapper
          title="합성 과정이 진행되고 있습니다."
          subtitle="잠시 기다려 주십시오."
        >
          <ClipLoader color={"#575757"} size={100} />
        </ContentWrapper>
      </div>
    );

  return (
    <div className={c()}>
      <ContentWrapper
        title={`${serviceData.mode === "MACHINE" ? "기계" : "AI"}번역이 완료되었습니다`}
        subtitle="완성된 이미지를 확인해 주세요."
      >
        <div className={c("max-w-[440px]", "overflow-x-auto")}>
          <img
            src={`${IMAGE_URL_BASE}/${statusData.composedImageFilename}`}
            className={c("h-[440px]", "object-contain", "rounded-[10px]")}
          />
        </div>
      </ContentWrapper>
    </div>
  );
}
