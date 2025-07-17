import c from "@/utils/c";

interface ContentWrapperProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function ContentWrapper({
  children,
  title,
  subtitle,
}: ContentWrapperProps) {
  return (
    <div
      className={c("w-full", "h-full", "flex", "flex-col", "justify-between")}
    >
      <div className={c("flex", "flex-col", "items-center", "py-[55px]")}>
        {title ? (
          <h1 className={c("text-[64px]", "font-extrabold")}>{title}</h1>
        ) : (
          <></>
        )}
        {subtitle ? (
          <span className={c("text-xl", "font-extralight")}>{subtitle}</span>
        ) : (
          <></>
        )}
      </div>
      {children ? (
        <div className={c("flex", "justify-center", "gap-36", "min-h-[440px]")}>
          {children}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
