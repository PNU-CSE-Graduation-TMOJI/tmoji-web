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
import ListSelect from "@/components/common/select/ListSelect";

type Step = "IMAGE-UPLOAD" | "SELECT-SERVICE" | "SELECT-LANGUAGE";
type TranslateMode = "MACHINE" | "AI";
type Language = "KO" | "EN" | "JP";

const languageOptions: Record<Language, string> = {
  KO: "한국어",
  EN: "English",
  JP: "日本語",
};

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [step, setStep] = useState<Step>("IMAGE-UPLOAD");

  // Step - IMAGE-UPLOAD
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

  // Step - SELECT-SERVICE
  const [translateMode, setTranslateMode] = useState<TranslateMode>("MACHINE");

  // Step - SELECT-LANGUAGE
  const [language, setLanguage] = useState<Language | null>(null);

  switch (step) {
    case "IMAGE-UPLOAD":
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
                    className={c(
                      "h-[440px]",
                      "object-contain",
                      "rounded-[10px]",
                    )}
                  />
                </div>
                <SquareIconButton
                  onClick={() => {
                    setStep("SELECT-SERVICE");
                  }}
                >
                  <NextIcon width={40} height={40} />
                </SquareIconButton>
              </>
            ) : (
              <ClipLoader color={"#575757"} size={100} />
            )}
          </ContentWrapper>
        </div>
      );
    case "SELECT-SERVICE":
      return (
        <div className={c()}>
          <ContentWrapper
            title="번역 서비스를 선택해 주세요"
            subtitle="원본 이미지의 텍스트 스타일을 유지하여 합성하시려면 'AI 이미지 번역'을 선택해 주세요."
          >
            <div className={c("flex", "gap-9")}>
              <button
                className={c(
                  "w-[440px]",
                  "h-[440px]",
                  "border-[1px]",
                  "border-white",
                  "bg-tmoji-grey",
                  "rounded-3xl",
                  "text-white",
                  "font-extrabold",
                  "text-[64px]",
                )}
                onClick={() => {
                  setTranslateMode("MACHINE");
                  setStep("SELECT-LANGUAGE");
                }}
              >
                기계 번역
              </button>
              <button
                className={c(
                  "w-[440px]",
                  "h-[440px]",
                  "bg-tmoji-orange-linear",
                  "rounded-3xl",
                  "text-white",
                  "font-extrabold",
                  "text-[64px]",
                )}
                onClick={() => {
                  setTranslateMode("AI");
                  setStep("SELECT-LANGUAGE");
                }}
              >
                AI 이미지 번역
              </button>
            </div>
          </ContentWrapper>
        </div>
      );
    case "SELECT-LANGUAGE":
      return (
        <div className={c()}>
          <ContentWrapper
            title="원본 이미지의 언어를 선택해 주세요"
            subtitle="번역할 원본 텍스트의 언어를 선택해 주세요."
          >
            <div className={c("w-[100px]")} />
            <ListSelect
              options={languageOptions}
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            />
            <SquareIconButton>
              <NextIcon width={40} height={40} />
            </SquareIconButton>
          </ContentWrapper>
        </div>
      );
    default:
      return <></>;
  }
}
