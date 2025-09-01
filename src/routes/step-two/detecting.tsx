import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import type { RowMode } from "@/components/common/list/TmojiList";
import type { Area } from "@/api/schema/common";
import type { Service } from "@/api/schema/service";
import ImageCropper from "@/components/common/crop/ImageCropper";
import ContentWrapper from "@/components/ContentWrapper";
import c from "@/utils/c";
import TmojiList from "@/components/common/list/TmojiList";
import SquareIconButton from "@/components/common/button/SquareIconButton";
import NextIcon from "@/assets/icons/right-arrow.svg?react";
import step2Api from "@/api/handler/step-2";
import serviceApi from "@/api/handler/service";
import { IMAGE_URL_BASE } from "@/constansts";

type SearchParams = {
  id: number;
};

export const Route = createFileRoute("/step-two/detecting")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      id: Number(search.id ?? 0),
    };
  },
});

function RouteComponent() {
  const { id } = Route.useSearch();
  const queryClient = useQueryClient();

  // API
  const { data: statusData } = useQuery({
    queryKey: [...step2Api.KEYS.getServiceStatus(), id],
    queryFn: () => step2Api.getServiceStatus(id),
    refetchOnWindowFocus: false,
    refetchInterval: (query) => {
      const needRefetch =
        query.state.data && query.state.data.isCompleted ? false : 3000;
      return needRefetch;
    },
  });

  const { mutate: mutatePatchText } = useMutation({
    mutationKey: [...step2Api.KEYS.patchAreaText(), id],
    mutationFn: (variables: {
      serviceId: number;
      areaId: number;
      newText: string;
    }) =>
      step2Api.patchAreaText(variables.serviceId, variables.areaId, {
        newOriginText: variables.newText,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...step2Api.KEYS.getServiceStatus(), id],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: [...step2Api.KEYS.getServiceStatus(), id],
      });
    },
  });

  const { mutate: mutateDeleteText } = useMutation({
    mutationKey: [...step2Api.KEYS.deleteAreaText(), id],
    mutationFn: (variables: { serviceId: number; areaId: number }) =>
      step2Api.deleteAreaText(variables.serviceId, variables.areaId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...step2Api.KEYS.getServiceStatus(), id],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: [...step2Api.KEYS.getServiceStatus(), id],
      });
    },
  });

  // State
  const [serviceData, setServiceData] = useState<Service>();
  const [boundingBoxes, setBoundingBoxes] = useState<Array<Area>>();
  const [texts, setTexts] = useState<Array<string>>();
  const [selected, setSelected] = useState<number>(0);
  const [rowMode, setRowMode] = useState<RowMode>("NORMAL");
  const navigate = useNavigate();

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
      if (!statusData.areas) {
        alert("OCR 결과값을 가져오는데 실패하였습니다.");
        navigate({ to: "/" });
        return;
      }

      getServiceData();
      setBoundingBoxes(
        statusData.areas.map((area) => ({
          x1: area.x1,
          x2: area.x2,
          y1: area.y1,
          y2: area.y2,
        })),
      );
      setTexts(statusData.areas.map((area) => area.originText));
    }
  }, [statusData]);

  useEffect(() => {
    console.log(serviceData);
  }, [serviceData]);

  if (!statusData || !serviceData || !boundingBoxes || !texts)
    return (
      <div>
        <ContentWrapper
          title="OCR 과정이 진행되고 있습니다."
          subtitle="잠시 기다려 주십시오."
        >
          <ClipLoader color={"#575757"} size={100} />
        </ContentWrapper>
      </div>
    );

  return (
    <div className={c()}>
      <ContentWrapper
        title="감지된 텍스트를 확인해 주세요."
        subtitle="텍스트가 일치하는지 확인 후 필요 시 수정해 주세요."
      >
        <ImageCropper
          imgSrc={`${IMAGE_URL_BASE}/${serviceData.originImage.filename}`}
          boundingBoxes={boundingBoxes}
          selectedIndex={selected}
        />
        <div
          className={c(
            "flex",
            "flex-col",
            "gap-4",
            "items-center",
            "pb-4",
            "h-[400px]",
          )}
        >
          <TmojiList
            texts={texts}
            selectedIndex={selected}
            onChange={(newTexts, newSelectedText) => {
              if (texts.length === newTexts.length) {
                newTexts.forEach((newText, idx) => {
                  if (
                    statusData.areas &&
                    statusData.areas[idx].originText !== newText
                  )
                    mutatePatchText({
                      serviceId: id,
                      areaId: statusData.areas[idx].id,
                      newText,
                    });
                });
              }
              setTexts(newTexts);
              setSelected(newSelectedText);
            }}
            onRowModeChange={(newRowMode) => {
              setRowMode(newRowMode);
            }}
            onDelete={(deletedIndex) => {
              if (statusData.areas) {
                mutateDeleteText({
                  serviceId: id,
                  areaId: statusData.areas[deletedIndex].id,
                });
                const newBoundingBoxes = [...boundingBoxes];
                newBoundingBoxes.splice(deletedIndex, 1);
                setBoundingBoxes(newBoundingBoxes);
              }
            }}
          />
          {rowMode === "NORMAL" ? (
            <SquareIconButton
              onClick={() => {
                navigate({
                  to: "/step-two/language",
                  search: { id },
                });
                return;
              }}
            >
              <NextIcon width={40} height={40} />
            </SquareIconButton>
          ) : (
            <></>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
}
