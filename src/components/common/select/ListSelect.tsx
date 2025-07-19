import c from "@/utils/c";

type Width = "base";

interface ListSelectProps {
  width?: Width;
  options: Record<string, string>;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function ListSelect({
  width = "base",
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
      )}
    >
      {Object.entries(options).map((item, idx) => {
        const [keyName, valueString] = item;
        return (
          <button
            key={`ListSelect-${idx}-${keyName}`}
            className={c(
              "py-6",
              "rounded-[5px]",
              WIDTH_CLASSNAME[width],
              "text-[32px]",
              "font-medium",
              value === keyName
                ? "bg-tmoji-orange-linear"
                : "hover:bg-tmoji-dark-grey",
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

const WIDTH_CLASSNAME: Record<Width, string> = {
  base: "w-[320px]",
};
