import type { MouseEvent } from "react";
import c from "@/utils/c";

type BG = "ORANGE" | "GRAY";

interface SquareIconButtonProps {
  as?: "button" | "div" | "span";
  bg?: BG;
  children?: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export default function SquareIconButton({
  as: Component = "button",
  bg = "ORANGE",
  children,
  onClick,
}: SquareIconButtonProps) {
  return (
    <Component
      className={c(
        "w-[100px]",
        "h-[100px]",
        "rounded-[25px]",
        BG_CLASSNAME[bg],
        "flex",
        "items-center",
        "justify-center",
        "shrink-0",
      )}
      onClick={onClick}
    >
      {children ?? <></>}
    </Component>
  );
}

const BG_CLASSNAME: Record<BG, string> = {
  ORANGE: "bg-tmoji-orange-linear",
  GRAY: "bg-tmoji-light-grey/50",
};
