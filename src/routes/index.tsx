import { createFileRoute } from "@tanstack/react-router";
import ContentWrapper from "@/components/ContentWrapper";
import c from "@/utils/c";

import PlusIcon from "@/assets/icons/plus.svg?react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className={c()}>
      <ContentWrapper
        title="사진을 업로드해주세요"
        subtitle="사진을 업로드하면 번역 과정이 시작됩니다."
      >
        <label>
          <button
            className={c(
              "w-[440px]",
              "h-[440px]",
              "border-[3px]",
              "border-tmoji-orange",
              "rounded-[25px]",
              "flex",
              "justify-center",
              "items-center",
            )}
          >
            <div
              className={c(
                "w-[100px]",
                "h-[100px]",
                "rounded-[25px]",
                "bg-tmoji-orange-linear",
                "flex",
                "items-center",
                "justify-center",
              )}
            >
              <PlusIcon width={40} height={40} />
            </div>
          </button>
        </label>
      </ContentWrapper>
    </div>
  );
}
