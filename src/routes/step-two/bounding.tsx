import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import type { Area } from "@/api/schema/common";
import ContentWrapper from "@/components/ContentWrapper";
import c from "@/utils/c";

import ListSelect from "@/components/common/select/ListSelect";
import ResetIcon from "@/assets/icons/refresh.svg?react";
import NextIcon from "@/assets/icons/right-arrow.svg?react";
import SquareIconButton from "@/components/common/button/SquareIconButton";
import ImageCropper from "@/components/common/crop/ImageCropper";
import serviceApi from "@/api/handler/service";
import { IMAGE_URL_BASE } from "@/constansts";
import step2Api from "@/api/handler/step-2";

type SearchParams = {
  id: number;
};

export const Route = createFileRoute("/step-two/bounding")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      id: Number(search.id ?? 0),
    };
  },
});

function RouteComponent() {
  const { id } = Route.useSearch();

  const navigate = useNavigate();

  // API
  const { data: serviceData } = useQuery({
    queryKey: [...serviceApi.KEYS.getService(), id],
    queryFn: () => serviceApi.getService(id),
  });

  const { mutate } = useMutation({
    mutationKey: [...step2Api.KEYS.postAreas(), id],
    mutationFn: () =>
      step2Api.postAreas({
        serviceId: id,
        areas: boundingBoxes.map((area) => ({
          x1: Math.round(area.x1),
          x2: Math.round(area.x2),
          y1: Math.round(area.y1),
          y2: Math.round(area.y2),
        })),
      }),
    onSuccess: (data) => {
      navigate({
        to: "/step-two/detecting",
        search: { id: data.id },
      });
    },
    onError: () => {
      navigate({ to: "/" });
    },
  });

  // State
  const [boundingBoxes, setBoundingBoxes] = useState<Array<Area>>([
    {
      x1: 0,
      x2: 100,
      y1: 0,
      y2: 100,
    },
  ]);
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    console.log(boundingBoxes);
  }, [boundingBoxes]);

  if (!serviceData)
    return (
      <div>
        <ContentWrapper>
          <ClipLoader color={"#575757"} size={100} />
        </ContentWrapper>
      </div>
    );

  return (
    <div className={c()}>
      <ContentWrapper
        title="텍스트 영역을 지정해 주세요"
        subtitle="번역할 대상 텍스트가 잘리지 않도록 드래그 하여 영역 크기를 알맞게 조정해 주세요."
      >
        <div className={c("flex", "flex-col", "gap-3")}>
          <ListSelect
            size="sm"
            options={Array.from({ length: boundingBoxes.length }).reduce<
              Record<string, string>
            >((acc, _, index) => {
              acc[index.toString()] = `영역 ${index + 1}`;
              return acc;
            }, {})}
            value={selected.toString()}
            onChange={(e) => setSelected(parseInt(e.target.value))}
          />
          <div
            className={c(
              "p-2",
              "flex",
              "flex-col",
              "bg-tmoji-grey/30",
              "rounded-[5px]",
              "border-[1px]",
              "border-white",
              "w-[280px]",
            )}
          >
            <button
              className={c(
                "py-[16px]",
                "rounded-[5px]",
                "w-full",
                "text-[24px]",
                "font-medium",
                "hover:bg-tmoji-dark-grey",
              )}
              onClick={() => {
                setBoundingBoxes([
                  ...boundingBoxes,
                  {
                    x1: 0,
                    x2: 100,
                    y1: 0,
                    y2: 100,
                  },
                ]);
                setSelected(boundingBoxes.length);
              }}
            >
              +
            </button>
          </div>
        </div>
        <ImageCropper
          imgSrc={`${IMAGE_URL_BASE}/${serviceData.originImage.filename}`}
          boundingBoxes={boundingBoxes}
          selectedIndex={selected}
          onChange={(newBoundingBoxes) => {
            setBoundingBoxes(newBoundingBoxes);
          }}
        />
        <div
          className={c(
            "flex",
            "flex-col",
            "gap-3",
            "w-[282px]",
            "items-center",
          )}
        >
          <SquareIconButton
            onClick={() => {
              mutate();
            }}
          >
            <NextIcon width={40} height={40} />
          </SquareIconButton>
          <SquareIconButton
            bg="GRAY"
            onClick={() => {
              setBoundingBoxes([
                {
                  x1: 0,
                  x2: 100,
                  y1: 0,
                  y2: 100,
                },
              ]);
              setSelected(0);
            }}
          >
            <ResetIcon width={40} height={40} />
          </SquareIconButton>
        </div>
      </ContentWrapper>
    </div>
  );
}
