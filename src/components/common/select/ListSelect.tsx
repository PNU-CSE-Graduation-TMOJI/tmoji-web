import c from "@/utils/c";

type Size = "sm" | "base";

interface ListSelectProps {
  size?: Size;
  options: Record<string, string>;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function ListSelect({
  size = "base",
  options,
  value,
  onChange,
}: ListSelectProps) {
  const handleClick = (key: string) => {
    const syntheticEvent = {
      target: {
        value: key,
      },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
  };
  return (
    <div
      className={c(
        "p-2",
        "flex",
        "flex-col",
        "bg-tmoji-grey/30",
        "rounded-[5px]",
        "border-[1px]",
        "border-white",
        WIDTH_CLASSNAME[size],
      )}
    >
      {Object.entries(options).map((item, idx) => {
        const [keyName, valueString] = item;
        return (
          <button
            key={`ListSelect-${idx}-${keyName}`}
            className={c(
              "rounded-[5px]",
              PADDING_CLASSNAME[size],
              FONT_SIZE_CLASSNAME[size],
              "w-full",
              value === keyName
                ? "font-extrabold bg-tmoji-orange-linear"
                : "font-medium hover:bg-tmoji-dark-grey",
            )}
            onClick={() => {
              handleClick(keyName);
            }}
          >
            {valueString}
          </button>
        );
      })}
    </div>
  );
}

const WIDTH_CLASSNAME: Record<Size, string> = {
  sm: "w-[280px]",
  base: "w-[320px]",
};

const FONT_SIZE_CLASSNAME: Record<Size, string> = {
  sm: "text-[24px]",
  base: "text-[32px]",
};

const PADDING_CLASSNAME: Record<Size, string> = {
  sm: "py-[16px]",
  base: "py-6",
};
