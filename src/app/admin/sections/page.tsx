import Link from "next/link";
import { getAllSectionsFlat } from "@/lib/data";
import { createSection, deleteSection } from "@/app/admin/actions";
import SubmitButton from "@/components/SubmitButton";

export default async function AdminSectionsPage() {
  const sections = await getAllSectionsFlat();
  const roots = sections.filter((s) => !s.parent_id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Bo&apos;limlar</h1>
        <p className="text-muted text-sm">
          Navigatsiya bo&apos;limlarini yarating va boshqaring.
        </p>
      </div>

      {/* Yangi bo'lim qo'shish */}
      <form
        action={createSection}
        className="bg-card border rounded-2xl p-5 grid sm:grid-cols-2 gap-3"
      >
        <h2 className="sm:col-span-2 font-semibold">➕ Yangi bo&apos;lim</h2>
        <input
          name="title"
          required
          placeholder="Bo'lim nomi *"
          className="rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <input
          name="icon"
          placeholder="Emoji (masalan 📘)"
          className="rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <input
          name="description"
          placeholder="Qisqa tavsif"
          className="sm:col-span-2 rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <select
          name="parent_id"
          className="rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand bg-white"
        >
          <option value="">Asosiy bo&apos;lim (ildiz)</option>
          {roots.map((s) => (
            <option key={s.id} value={s.id}>
              {s.icon} {s.title} ostida
            </option>
          ))}
        </select>
        <select
          name="type"
          className="rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand bg-white"
        >
          <option value="content">Matnli kontent</option>
          <option value="tests">Testlar</option>
          <option value="todo">To-do</option>
          <option value="roadmap">Roadmap</option>
        </select>
        <input
          name="position"
          type="number"
          placeholder="Tartib (0,1,2...)"
          className="rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <div className="sm:col-span-2">
          <SubmitButton>Qo&apos;shish</SubmitButton>
        </div>
      </form>

      {/* Ro'yxat */}
      <div className="space-y-2">
        {roots.map((s) => {
          const children = sections.filter((c) => c.parent_id === s.id);
          return (
            <div key={s.id} className="bg-card border rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">{s.icon || "📄"}</span>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{s.title}</div>
                    <div className="text-xs text-muted">
                      /{s.slug} · {s.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {s.type === "content" && (
                    <Link
                      href={`/admin/sections/${s.id}`}
                      className="text-sm text-brand font-medium hover:underline"
                    >
                      Kontent →
                    </Link>
                  )}
                  <form action={deleteSection}>
                    <input type="hidden" name="id" value={s.id} />
                    <SubmitButton variant="danger" confirm="Bo'lim va uning kontenti o'chiriladi. Davom etasizmi?">
                      O&apos;chirish
                    </SubmitButton>
                  </form>
                </div>
              </div>

              {children.length > 0 && (
                <div className="mt-3 ml-6 space-y-1.5 border-l pl-4">
                  {children.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span>{c.icon || "📄"}</span>
                        <span className="text-sm truncate">{c.title}</span>
                        <span className="text-xs text-muted">/{c.slug}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {c.type === "content" && (
                          <Link
                            href={`/admin/sections/${c.id}`}
                            className="text-xs text-brand font-medium hover:underline"
                          >
                            Kontent →
                          </Link>
                        )}
                        <form action={deleteSection}>
                          <input type="hidden" name="id" value={c.id} />
                          <SubmitButton variant="danger" size="sm" confirm="O'chirilsinmi?">
                            ✕
                          </SubmitButton>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
