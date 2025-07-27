import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ContentWrapper from "@/components/ContentWrapper";
import c from "@/utils/c";
import sampleImageUrl from "@/assets/sample_result_image.png";

type TranslateMode = "MACHINE" | "AI";

export const Route = createFileRoute("/result")({
  component: App,
});

function App() {
  // Step - SELECT-SERVICE
  const [translateMode, setTranslateMode] = useState<TranslateMode>("AI");

  return (
    <div className={c()}>
      <ContentWrapper
        title={`${translateMode === "MACHINE" ? "기계" : "AI"}번역이 완료되었습니다`}
        subtitle="완성된 이미지를 확인해 주세요."
      >
        <div className={c("max-w-[440px]", "overflow-x-auto")}>
          <img
            src={sampleImageUrl}
            className={c("h-[440px]", "object-contain", "rounded-[10px]")}
          />
        </div>
      </ContentWrapper>
    </div>
  );
}
