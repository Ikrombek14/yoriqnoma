import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function count(table: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminHome() {
  const [sections, articles, videos, tests, todos, roadmap] = await Promise.all([
    count("sections"),
    count("articles"),
    count("videos"),
    count("tests"),
    count("todo_items"),
    count("roadmap_stages"),
  ]);

  const cards = [
    { label: "Bo'limlar", value: sections, href: "/admin/sections", icon: "📂" },
    { label: "Maqolalar", value: articles, href: "/admin/sections", icon: "📝" },
    { label: "Videolar", value: videos, href: "/admin/sections", icon: "🎬" },
    { label: "Testlar", value: tests, href: "/admin/tests", icon: "🧠" },
    { label: "To-do", value: todos, href: "/admin/todo", icon: "✅" },
    { label: "Roadmap", value: roadmap, href: "/admin/roadmap", icon: "🚀" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Boshqaruv paneli</h1>
      <p className="text-muted text-sm mb-6">
        Bu yerdan matnlar, videolar, testlar va boshqa kontentni boshqarasiz.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-card border rounded-2xl p-5 hover:border-brand/40 hover:shadow-sm transition"
          >
            <div className="text-2xl">{c.icon}</div>
            <div className="text-3xl font-bold mt-2">{c.value}</div>
            <div className="text-sm text-muted">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-brand-50 border border-brand/20 rounded-2xl p-5 text-sm">
        <b>Maslahat:</b> Matn yozishda <b>Markdown</b> ishlatishingiz mumkin —
        sarlavha (<code># Sarlavha</code>), qalin (<code>**matn**</code>),
        ro&apos;yxat (<code>- element</code>) va h.k. Video qo&apos;shishda
        YouTube/Vimeo havolasini joylang yoki faylni yuklang.
      </div>
    </div>
  );
}
