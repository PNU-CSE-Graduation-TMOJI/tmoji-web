import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type {
  RowMode,
  TranslateLanguage,
} from "@/components/common/list/TmojiList";
import type { Area } from "@/api/schema/common";
import ImageCropper from "@/components/common/crop/ImageCropper";
import ContentWrapper from "@/components/ContentWrapper";
import c from "@/utils/c";
import sampleImageUrl from "@/assets/sample_image.jpg";
import TmojiList from "@/components/common/list/TmojiList";
import SquareIconButton from "@/components/common/button/SquareIconButton";
import NextIcon from "@/assets/icons/right-arrow.svg?react";

type SearchParams = {
  id: number;
};

const SAMPLE_BOUNDING_BOX: Array<Area> = [
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

const SAMPLE_ORIGIN_TEXTS: Array<string> = [
  "中島公園駅",
  "出入口",
  "南北線",
  "Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example",
];

const SAMPLE_TEXTS: Array<string> = [
  "나카지마공원역",
  "출입구",
  "남북선",
  "Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example Long Text Example",
];

const SAMPLE_TRANSLATE_LANGUAGE: TranslateLanguage = {
  origin: "JP",
  target: "KO",
};

export const Route = createFileRoute("/step-three/translating")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      id: Number(search.id ?? 0),
    };
  },
});

function RouteComponent() {
  const [boundingBoxes, setBoundingBoxes] =
    useState<Array<Area>>(SAMPLE_BOUNDING_BOX);
  const [texts, setTexts] = useState<Array<string>>(SAMPLE_TEXTS);
  const [selected, setSelected] = useState<number>(0);
  const [rowMode, setRowMode] = useState<RowMode>("NORMAL");
  const navigate = useNavigate();

  return (
    <div className={c()}>
      <ContentWrapper
        title="번역 결과를 확인해 주세요"
        subtitle="번역이 올바른지 확인 후 필요 시 수정해 주세요."
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
            type="TRANSLATE"
            texts={texts}
            originTexts={SAMPLE_ORIGIN_TEXTS}
            translateLanguage={SAMPLE_TRANSLATE_LANGUAGE}
            selectedIndex={selected}
            onChange={(newTexts, newSelectedText) => {
              setTexts(newTexts);
              setSelected(newSelectedText);
            }}
            onRowModeChange={(newRowMode) => {
              setRowMode(newRowMode);
            }}
            onDelete={(deletedIndex) => {
              const newBoundingBoxes = [...boundingBoxes];
              newBoundingBoxes.splice(deletedIndex, 1);
              setBoundingBoxes(newBoundingBoxes);
            }}
          />
          {rowMode === "NORMAL" ? (
            <SquareIconButton
              onClick={() => {
                navigate({
                  to: "/result",
                  search: { id: 0 },
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
