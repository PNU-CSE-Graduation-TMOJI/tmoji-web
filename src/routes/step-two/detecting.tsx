import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { BoundingBox } from "@/components/common/crop/ImageCropper";
import ImageCropper from "@/components/common/crop/ImageCropper";
import ContentWrapper from "@/components/ContentWrapper";
import c from "@/utils/c";
import sampleImageUrl from "@/assets/sample_image.jpg";
import TmojiList from "@/components/common/list/TmojiList";
import SquareIconButton from "@/components/common/button/SquareIconButton";
import NextIcon from "@/assets/icons/right-arrow.svg?react";

type DetectingSearch = {
  id: number;
};

const SAMPLE_BOUNDING_BOX: Array<BoundingBox> = [
  {
    x1: 41,
    x2: 259,
    y1: 244,
    y2: 289,
  },
  {
    x1: 36,
    x2: 90,
    y1: 224,
    y2: 244,
  },
  {
    x1: 91,
    x2: 135,
    y1: 223,
    y2: 244,
  },
  {
    x1: 41,
    x2: 259,
    y1: 340,
    y2: 380,
  },
];

const SAMPLE_TEXTS: Array<string> = [
  "中島公園駅",
  "南北線",
  "出入口",
  "Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example",
];

export const Route = createFileRoute("/step-two/detecting")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): DetectingSearch => {
    return {
      id: Number(search.id ?? 0),
    };
  },
});

function RouteComponent() {
  const [boundingBoxes, _] = useState<Array<BoundingBox>>(SAMPLE_BOUNDING_BOX);
  const [texts, setTexts] = useState<Array<string>>(SAMPLE_TEXTS);
  const [selected, setSelected] = useState<number>(0);

  return (
    <div className={c()}>
      <ContentWrapper
        title="감지된 텍스트를 확인해 주세요."
        subtitle="텍스트가 일치하는지 확인 후 필요 시 수정해 주세요."
      >
        <ImageCropper
          imgSrc={sampleImageUrl}
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
            selectedText={selected}
            onChange={(newTexts, newSelectedText) => {
              setTexts(newTexts);
              setSelected(newSelectedText);
            }}
          />
          <SquareIconButton
            onClick={() => {
              // navigate({
              //   to: "/step-two/bounding",
              //   search: { id: 0 },
              // });
              return;
            }}
          >
            <NextIcon width={40} height={40} />
          </SquareIconButton>
        </div>
      </ContentWrapper>
    </div>
  );
}
