import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { BoundingBox } from "@/components/common/crop/ImageCropper";
import ContentWrapper from "@/components/ContentWrapper";
import c from "@/utils/c";

import ListSelect from "@/components/common/select/ListSelect";
import ResetIcon from "@/assets/icons/refresh.svg?react";
import NextIcon from "@/assets/icons/right-arrow.svg?react";
import sampleImageUrl from "@/assets/sample_image.jpg";
import SquareIconButton from "@/components/common/button/SquareIconButton";
import ImageCropper from "@/components/common/crop/ImageCropper";

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
  const [boundingBoxes, setBoundingBoxes] = useState<Array<BoundingBox>>([
    {
      x1: 0,
      x2: 100,
      y1: 0,
      y2: 100,
    },
  ]);
  const [selected, setSelected] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(boundingBoxes);
  }, [boundingBoxes]);

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
          imgSrc={sampleImageUrl}
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
              navigate({
                to: "/step-two/detecting",
                search: { id: 0 },
              });
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
