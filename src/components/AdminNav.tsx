"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Umumiy", exact: true },
  { href: "/admin/sections", label: "Bo'limlar" },
  { href: "/admin/tests", label: "Testlar" },
  { href: "/admin/todo", label: "To-do" },
  { href: "/admin/roadmap", label: "Roadmap" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto -mb-px">
      {links.map((l) => {
        const active = l.exact
          ? pathname === l.href
          : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3.5 py-2.5 text-sm border-b-2 whitespace-nowrap transition ${
              active
                ? "border-brand text-brand font-medium"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
