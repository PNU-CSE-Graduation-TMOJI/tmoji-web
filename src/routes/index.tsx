import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import type { ChangeEvent } from "react";
import ContentWrapper from "@/components/ContentWrapper";
import c from "@/utils/c";
import SquareIconButton from "@/components/common/button/SquareIconButton";

import PlusIcon from "@/assets/icons/plus.svg?react";
import ResetIcon from "@/assets/icons/refresh.svg?react";
import NextIcon from "@/assets/icons/right-arrow.svg?react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={c()}>
      <ContentWrapper
        title="사진을 업로드해주세요"
        subtitle="사진을 업로드하면 번역 과정이 시작됩니다."
      >
        {!preview && !selectedFile ? (
          <>
            <label
              className={c(
                "w-[440px]",
                "h-[440px]",
                "border-[3px]",
                "border-tmoji-orange",
                "rounded-[25px]",
                "flex",
                "justify-center",
                "items-center",
                "cursor-pointer",
              )}
            >
              <input
                type="file"
                accept="image/*"
                className={c("hidden")}
                onChange={handleImageChange}
              />
              <SquareIconButton as="div">
                <PlusIcon width={40} height={40} />
              </SquareIconButton>
            </label>
          </>
        ) : preview && selectedFile ? (
          <>
            <SquareIconButton
              bg="GRAY"
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
              }}
            >
              <ResetIcon width={40} height={40} />
            </SquareIconButton>
            <div className={c("max-w-[440px]", "overflow-x-auto")}>
              <img
                src={preview}
                className={c("h-[440px]", "object-contain", "rounded-[10px]")}
              />
            </div>
            <SquareIconButton>
              <NextIcon width={40} height={40} />
            </SquareIconButton>
          </>
        ) : (
          <ClipLoader color={"#575757"} size={100} />
        )}
      </ContentWrapper>
    </div>
  );
}
