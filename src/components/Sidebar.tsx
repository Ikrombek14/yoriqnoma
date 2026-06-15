"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { SectionNode } from "@/lib/data";
import { signOut } from "@/app/auth/actions";

function hrefForSection(s: SectionNode): string {
  if (s.type === "tests") return "/tests";
  if (s.type === "todo") return "/todo";
  if (s.type === "roadmap") return "/roadmap";
  return `/s/${s.slug}`;
}

export default function Sidebar({
  tree,
  profile,
}: {
  tree: SectionNode[];
  profile: { full_name: string | null; email: string; role: string } | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({
    href,
    icon,
    label,
    depth = 0,
  }: {
    href: string;
    icon?: string | null;
    label: string;
    depth?: number;
  }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
          depth > 0 ? "ml-4 pl-3" : ""
        } ${
          active
            ? "bg-brand-50 text-brand font-medium"
            : "text-foreground/80 hover:bg-black/[0.04]"
        }`}
      >
        {icon && <span className="text-base leading-none">{icon}</span>}
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link
        href="/dashboard"
        onClick={() => setOpen(false)}
        className="flex items-center px-5 h-16 border-b shrink-0"
      >
        <Image
          src="/robbit-logo.webp"
          alt="Robbit"
          width={150}
          height={39}
          priority
          className="h-9 w-auto object-contain"
        />
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <NavLink href="/dashboard" icon="🏠" label="Bosh sahifa" />
        <div className="h-px bg-border my-2" />
        {tree.map((s) => (
          <div key={s.id}>
            <NavLink href={hrefForSection(s)} icon={s.icon} label={s.title} />
            {s.children.length > 0 && (
              <div className="mt-0.5 space-y-0.5">
                {s.children.map((c) => (
                  <NavLink
                    key={c.id}
                    href={hrefForSection(c)}
                    icon={c.icon}
                    label={c.title}
                    depth={1}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {profile?.role === "admin" && (
          <>
            <div className="h-px bg-border my-2" />
            <NavLink href="/admin" icon="🛠️" label="Admin panel" />
          </>
        )}
      </nav>

      {/* User / Admin kirish */}
      <div className="border-t p-3 shrink-0">
        {profile ? (
          <>
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand text-sm font-semibold">
                {(profile.full_name || profile.email)[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">
                  {profile.full_name || profile.email}
                </div>
                <div className="text-[11px] text-muted truncate">
                  {profile.role === "admin" ? "Administrator" : "Foydalanuvchi"}
                </div>
              </div>
            </div>
            <form action={signOut}>
              <button className="mt-1 w-full rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition text-left">
                ↪ Chiqish
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-black/[0.04] transition"
          >
            🔑 Admin kirish
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-14 bg-card border-b z-30 flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          className="h-9 w-9 rounded-lg hover:bg-black/5 flex items-center justify-center"
          aria-label="Menyu"
        >
          ☰
        </button>
        <Image
          src="/robbit-logo.webp"
          alt="Robbit"
          width={130}
          height={34}
          priority
          className="h-8 w-auto object-contain"
        />
      </div>
      <div className="lg:hidden h-14" />

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-72 bg-card border-r z-20">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-card border-r">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
