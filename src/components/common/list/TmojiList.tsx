import { useState } from "react";
import c from "@/utils/c";

import ZoomIcon from "@/assets/icons/zoom-mini.svg?react";
import EditIcon from "@/assets/icons/edit-mini.svg?react";
import DeleteIcon from "@/assets/icons/delete-mini.svg?react";

interface TmojiListProps {
  texts: Array<string>;
  selectedText: number;
  onChange?: (newTexts: Array<string>, newSelectedText: number) => void;
}

type RowMode = "NORMAL" | "ZOOM" | "EDIT";

const textReducer = (text: string): string => {
  return text.length > 22 ? text.slice(0, 22) + "..." : text;
};

export default function TmojiList({
  texts,
  selectedText,
  onChange,
}: TmojiListProps) {
  const [rowMode, setRowMode] = useState<RowMode>("NORMAL");

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
        return (
          <div
            key={`TmojiList-Row-${idx}`}
            className={c(
              "p-2",
              "w-full",
              selectedText === idx
                ? "border-[1px] border-tmoji-white"
                : "cursor-pointer",
              selectedText === idx
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
                  selectedText === idx ? "bg-tmoji-orange-linear" : "",
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
              {selectedText === idx ? (
                <div
                  className={c(
                    "absolute",
                    "right-0",
                    "flex",
                    "items-center",
                    "gap-1",
                  )}
                >
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
                  >
                    <ZoomIcon />
                  </div>
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
                  >
                    <EditIcon />
                  </div>
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
                  >
                    <DeleteIcon />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
