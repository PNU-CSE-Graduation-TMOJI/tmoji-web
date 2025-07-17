import { Link } from "@tanstack/react-router";
import Logo from "@/assets/logo.svg?react";
import c from "@/utils/c";

export default function Header() {
  return (
    <header className={c("px-36", "pt-20", "flex", "gap-2", "justify-between")}>
      <nav className="flex flex-row">
        <Link to="/">
          <Logo width={119} height={34} />
        </Link>
      </nav>
    </header>
  );
}
