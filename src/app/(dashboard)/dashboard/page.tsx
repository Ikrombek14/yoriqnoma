import Link from "next/link";
import { getSectionTree } from "@/lib/data";
import { getCurrentProfile } from "@/lib/auth";

function hrefForSection(type: string, slug: string): string {
  if (type === "tests") return "/tests";
  if (type === "todo") return "/todo";
  if (type === "roadmap") return "/roadmap";
  return `/s/${slug}`;
}

export default async function DashboardHome() {
  const [tree, profile] = await Promise.all([
    getSectionTree(),
    getCurrentProfile(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Xush kelibsiz{profile?.full_name ? `, ${profile.full_name}` : ""}! 👋
        </h1>
        <p className="text-muted mt-1">
          Bu yerda adminlar uchun barcha yo&apos;riqnoma va qo&apos;llanmalar
          jamlangan. Quyidagi bo&apos;limlardan birini tanlang.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {tree.map((s) => (
          <Link
            key={s.id}
            href={hrefForSection(s.type, s.slug)}
            className="group bg-card border rounded-2xl p-5 hover:shadow-md hover:border-brand/40 transition"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl shrink-0">
                {s.icon || "📄"}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold group-hover:text-brand transition">
                  {s.title}
                </h3>
                {s.description && (
                  <p className="text-sm text-muted mt-0.5 line-clamp-2">
                    {s.description}
                  </p>
                )}
                {s.children.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {s.children.map((c) => (
                      <span
                        key={c.id}
                        className="text-[11px] bg-black/[0.04] rounded-full px-2 py-0.5 text-foreground/70"
                      >
                        {c.icon} {c.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
