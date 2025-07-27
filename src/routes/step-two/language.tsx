import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import SquareIconButton from "@/components/common/button/SquareIconButton";
import ListSelect from "@/components/common/select/ListSelect";
import ContentWrapper from "@/components/ContentWrapper";
import c from "@/utils/c";

import NextIcon from "@/assets/icons/right-arrow.svg?react";

type SearchParams = {
  id: number;
};

type Language = "KO" | "EN" | "JP";

const languageOptions: Record<Language, string> = {
  KO: "한국어",
  EN: "English",
  JP: "日本語",
};

export const Route = createFileRoute("/step-two/language")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      id: Number(search.id ?? 0),
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const [originLanguage] = useState<Language>("JP");
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const filteredLanguageOptions = useMemo(() => {
    return Object.fromEntries(
      Object.entries(languageOptions).filter(([key]) => key !== originLanguage),
    ) as Partial<Record<Language, string>>;
  }, [originLanguage]);

  return (
    <div className={c()}>
      <ContentWrapper
        title="목표 언어를 선택해 주세요"
        subtitle="원본 언어의 텍스트를 목표 언어로 번역합니다."
      >
        <div className={c("w-[100px]")} />
        <div className={c("flex", "flex-col", "gap-3")}>
          <div
            className={c(
              "p-2",
              "flex",
              "flex-col",
              "bg-tmoji-grey/30",
              "rounded-[5px]",
              "border-[1px]",
              "border-white",
              "w-[320px]",
            )}
          >
            <button
              className={c(
                "py-[24px]",
                "rounded-[5px]",
                "w-full",
                "text-[32px]",
                "font-medium",
              )}
            >
              원본 - {languageOptions[originLanguage]}
            </button>
          </div>
          <ListSelect
            options={filteredLanguageOptions}
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value as Language)}
          />
        </div>

        {targetLanguage ? (
          <SquareIconButton
            onClick={() => {
              navigate({
                to: "/step-three/translating",
                search: { id: 0 },
              });
            }}
          >
            <NextIcon width={40} height={40} />
          </SquareIconButton>
        ) : (
          <SquareIconButton bg="GRAY">
            <NextIcon width={40} height={40} />
          </SquareIconButton>
        )}
      </ContentWrapper>
    </div>
  );
}
