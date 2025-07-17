import { Link } from "@tanstack/react-router";
import Logo from "@/assets/logo.svg?react";

export default function Header() {
  return (
    <header className="px-36 pt-24 flex gap-2 justify-between">
      <nav className="flex flex-row">
        <Link to="/">
          <Logo width={119} height={34} />
        </Link>
      </nav>
    </header>
  );
}
