import Link from "next/link";
import { getTests } from "@/lib/data";
import { createTest, deleteTest } from "@/app/admin/actions";
import SubmitButton from "@/components/SubmitButton";

export default async function AdminTestsPage() {
  const tests = await getTests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Testlar</h1>
        <p className="text-muted text-sm">
          O&apos;z-o&apos;zini baholash testlarini yarating.
        </p>
      </div>

      <form
        action={createTest}
        className="bg-card border rounded-2xl p-5 space-y-3"
      >
        <h2 className="font-semibold">➕ Yangi test</h2>
        <input
          name="title"
          required
          placeholder="Test nomi *"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <input
          name="description"
          placeholder="Tavsif"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <SubmitButton>Yaratish</SubmitButton>
      </form>

      <div className="space-y-2">
        {tests.map((t) => (
          <div
            key={t.id}
            className="bg-card border rounded-2xl p-4 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="font-medium truncate">{t.title}</div>
              {t.description && (
                <div className="text-xs text-muted truncate">
                  {t.description}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/admin/tests/${t.id}`}
                className="text-sm text-brand font-medium hover:underline"
              >
                Savollar →
              </Link>
              <form action={deleteTest}>
                <input type="hidden" name="id" value={t.id} />
                <SubmitButton variant="danger" size="sm" confirm="O'chirilsinmi?">
                  ✕
                </SubmitButton>
              </form>
            </div>
          </div>
        ))}
        {tests.length === 0 && (
          <p className="text-muted text-sm text-center py-4">
            Hali test yo&apos;q.
          </p>
        )}
      </div>
    </div>
  );
}
