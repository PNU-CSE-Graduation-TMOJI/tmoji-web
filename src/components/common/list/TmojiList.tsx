import { useEffect, useState } from "react";
import c from "@/utils/c";

import ZoomIcon from "@/assets/icons/zoom-mini.svg?react";
import EditIcon from "@/assets/icons/edit-mini.svg?react";
import DeleteIcon from "@/assets/icons/delete-mini.svg?react";
import RefreshIcon from "@/assets/icons/refresh-mini.svg?react";

interface TmojiListProps {
  type?: Type;
  texts: Array<string>;
  originTexts?: Array<string>;
  translateLanguage?: TranslateLanguage;
  selectedIndex: number;
  onChange?: (newTexts: Array<string>, newSelectedIndex: number) => void;
  onRowModeChange?: (rowMode: RowMode) => void;
  onDelete?: (deletedIndex: number) => void;
}

export type RowMode = "NORMAL" | "ZOOM" | "EDIT" | "DELETE";
type Type = "DETECT" | "TRANSLATE";
type Language = "KO" | "EN" | "JP";
export interface TranslateLanguage {
  origin: Language;
  target: Language;
}

const languageOptions: Record<Language, string> = {
  KO: "한국어",
  EN: "English",
  JP: "日本語",
};

const textReducer = (text: string, length = 22): string => {
  return text.length > length ? text.slice(0, 22) + "..." : text;
};

export default function TmojiList({
  type = "DETECT",
  texts,
  originTexts,
  translateLanguage,
  selectedIndex,
  onChange,
  onRowModeChange,
  onDelete,
}: TmojiListProps) {
  const [rowMode, setRowMode] = useState<RowMode>("NORMAL");

  // 편집 모드 로직
  const [textEdit, setTextEdit] = useState<string | null>(null);

  useEffect(() => {
    onRowModeChange && onRowModeChange(rowMode);

    if (rowMode === "EDIT") {
      setTextEdit(texts[selectedIndex]);
    } else {
      setTextEdit(null);
    }
  }, [rowMode]);

  if (type === "TRANSLATE" && !originTexts)
    return <>error: TRANSLATE type shoud have originTexts</>;

  if (type === "TRANSLATE" && !translateLanguage)
    return <>error: TRANSLATE type shoud have translateLanguage</>;

  return (
    <div
      className={c(
        "w-[500px]",
        "h-full",
        "flex",
        "flex-col",
        "gap-2.5",
        rowMode === "NORMAL" ? "overflow-auto" : "overflow-hidden",
      )}
    >
      {texts.map((t, idx) => {
        if (rowMode !== "NORMAL" && selectedIndex !== idx) return <></>;
        return (
          <div
            key={`TmojiList-Row-${idx}`}
            className={c(
              "p-2",
              "w-full",
              selectedIndex === idx
                ? "border-[1px] border-tmoji-white"
                : "cursor-pointer",
              selectedIndex === idx
                ? "bg-tmoji-dark-grey"
                : "hover:bg-tmoji-grey-radial",
              "rounded-full",
            )}
            onClick={() => {
              onChange && onChange(texts, idx);
            }}
          >
            <div
              className={c("p-2", "gap-2", "flex", "relative", "items-center")}
            >
              <div
                className={c(
                  selectedIndex === idx ? "bg-tmoji-orange-linear" : "",
                  "w-[25px]",
                  "h-[25px]",
                  "rounded-full",
                  "text-center",
                  "font-black",
                )}
              >
                {idx + 1}
              </div>
              <span className={c("grow", "text-center", "text-xl/tight", "l")}>
                {textReducer(t)}
              </span>
              {selectedIndex === idx ? (
                <div
                  className={c(
                    "absolute",
                    "right-0",
                    "flex",
                    "items-center",
                    "gap-1",
                  )}
                >
                  {rowMode === "NORMAL" || rowMode === "ZOOM" ? (
                    <div
                      className={c(
                        "w-[25px]",
                        "h-[25px]",
                        "flex",
                        "items-center",
                        "justify-center",
                        "bg-tmoji-grey",
                        "rounded-full",
                        "cursor-pointer",
                      )}
                      onClick={() =>
                        setRowMode(rowMode === "NORMAL" ? "ZOOM" : "NORMAL")
                      }
                    >
                      <ZoomIcon />
                    </div>
                  ) : (
                    <></>
                  )}

                  {rowMode === "NORMAL" || rowMode === "EDIT" ? (
                    <div
                      className={c(
                        "w-[25px]",
                        "h-[25px]",
                        "flex",
                        "items-center",
                        "justify-center",
                        "bg-tmoji-grey",
                        "rounded-full",
                        "cursor-pointer",
                      )}
                      onClick={() =>
                        setRowMode(rowMode === "NORMAL" ? "EDIT" : "NORMAL")
                      }
                    >
                      <EditIcon />
                    </div>
                  ) : (
                    <></>
                  )}

                  {(rowMode === "NORMAL" || rowMode === "DELETE") &&
                  texts.length > 1 ? (
                    <div
                      className={c(
                        "w-[25px]",
                        "h-[25px]",
                        "flex",
                        "items-center",
                        "justify-center",
                        "bg-tmoji-grey",
                        "rounded-full",
                        "cursor-pointer",
                      )}
                      onClick={() =>
                        setRowMode(rowMode === "NORMAL" ? "DELETE" : "NORMAL")
                      }
                    >
                      <DeleteIcon />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      })}

      {type === "TRANSLATE" &&
      originTexts &&
      translateLanguage &&
      rowMode !== "NORMAL" &&
      rowMode !== "DELETE" ? (
        <div
          className={c(
            "relative",
            "grow",
            "border-[1px]",
            "border-tmoji-white",
            "rounded-3xl",
            "px-6",
            "py-4",
            "flex",
            "flex-col",
            "bg-tmoji-dark-grey",
            "overflow-y-hidden",
            "gap-4",
          )}
        >
          <div
            className={c(
              "text-xs",
              "font-light",
              "px-4",
              "py-1",
              "flex",
              "justify-center",
              "items-center",
              "absolute",
              "right-3",
              "top-3",
              "rounded-full",
              "bg-tmoji-grey",
            )}
          >
            {languageOptions[translateLanguage.origin]}
          </div>
          <span
            className={c(
              "flex",
              "justify-center",
              "w-full",
              "grow",
              "items-center",
              "overflow-y-hidden",
            )}
          >
            {originTexts[selectedIndex]}
          </span>
        </div>
      ) : (
        <></>
      )}

      {rowMode !== "NORMAL" ? (
        <div
          className={c(
            "relative",
            "grow",
            "border-[1px]",
            "border-tmoji-white",
            "rounded-3xl",
            "px-6",
            "py-4",
            "flex",
            "flex-col",
            "bg-tmoji-dark-grey",
            "overflow-y-hidden",
            "gap-4",
          )}
        >
          {type === "TRANSLATE" && translateLanguage ? (
            <div
              className={c(
                "text-xs",
                "font-light",
                "px-4",
                "py-1",
                "flex",
                "justify-center",
                "items-center",
                "absolute",
                "right-3",
                "top-3",
                "rounded-full",
                "bg-tmoji-grey",
              )}
            >
              {languageOptions[translateLanguage.target]}
            </div>
          ) : (
            <></>
          )}
          {rowMode === "ZOOM" ? (
            <>
              <span
                className={c(
                  "flex",
                  "justify-center",
                  "w-full",
                  "grow",
                  "items-center",
                  "overflow-y-hidden",
                )}
              >
                {texts[selectedIndex]}
              </span>
            </>
          ) : rowMode === "EDIT" ? (
            <>
              <label
                className={c(
                  "w-full",
                  "h-full",
                  "flex",
                  "items-center",
                  "justify-center",
                )}
              >
                <textarea
                  name="textEdit"
                  className={c(
                    "w-full",
                    "resize-none",
                    "border-transparent",
                    "focus:border-transparent",
                    "focus:ring-0",
                    "outline-none",
                    "text-center",
                    "field-sizing-content",
                    "max-h-full",
                  )}
                  value={textEdit ?? "error"}
                  onChange={(e) => {
                    setTextEdit(e.target.value);
                  }}
                />
              </label>
              <div className={c("flex", "gap-2", "w-full", "leading-5")}>
                <button
                  onClick={() => setTextEdit(texts[selectedIndex])}
                  className={c(
                    "py-2",
                    "gap-2",
                    "bg-tmoji-grey",
                    "grow",
                    "rounded-2xl",
                    "flex",
                    "items-center",
                    "justify-center",
                  )}
                >
                  <RefreshIcon width={13} />
                  초기화
                </button>
                <button
                  onClick={() => {
                    const newTexts = [...texts];
                    newTexts[selectedIndex] = textEdit ?? "error";
                    onChange && onChange(newTexts, selectedIndex);
                    setRowMode("NORMAL");
                  }}
                  className={c(
                    "py-2",
                    "gap-2",
                    "bg-tmoji-orange-linear",
                    "grow",
                    "rounded-2xl",
                    "flex",
                    "items-center",
                    "justify-center",
                  )}
                >
                  <EditIcon />
                  수정
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className={c(
                  "w-full",
                  "h-full",
                  "flex",
                  "flex-col",
                  "items-center",
                  "justify-center",
                  "gap-8",
                )}
              >
                <h3 className={c("font-extrabold")}>
                  '{textReducer(texts[selectedIndex], 35)}' 삭제
                </h3>
                <span className={c("text-center")}>
                  삭제 후 다시 되돌릴 수 없습니다.
                  <br />
                  진행 하시겠습니까?
                </span>
              </div>
              <div className={c("flex", "gap-2", "w-full", "leading-5")}>
                <button
                  onClick={() => setRowMode("NORMAL")}
                  className={c(
                    "py-2",
                    "gap-2",
                    "bg-tmoji-grey",
                    "grow",
                    "rounded-2xl",
                    "flex",
                    "items-center",
                    "justify-center",
                  )}
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    const newTexts = [...texts];
                    newTexts.splice(selectedIndex, 1);
                    onChange && onChange(newTexts, selectedIndex);
                    onDelete && onDelete(selectedIndex);
                    setRowMode("NORMAL");
                  }}
                  className={c(
                    "py-2",
                    "gap-2",
                    "bg-tmoji-red",
                    "grow",
                    "rounded-2xl",
                    "flex",
                    "items-center",
                    "justify-center",
                  )}
                >
                  삭제
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
