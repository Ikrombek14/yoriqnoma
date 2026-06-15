import Link from "next/link";
import { getTests } from "@/lib/data";

export default async function TestsListPage() {
  const tests = await getTests();

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📝 O&apos;z-o&apos;zini baholash
        </h1>
        <p className="text-muted text-sm mt-1">
          O&apos;rgangan ko&apos;nikmalaringizni test orqali tekshiring.
          Baholash: <b>70</b> — o&apos;rtacha, <b>80</b> — yaxshi, <b>100</b> —
          zo&apos;r.
        </p>
      </header>

      {tests.length === 0 ? (
        <div className="bg-card border rounded-2xl p-8 text-center text-muted">
          Hozircha testlar yo&apos;q. Admin panel orqali test qo&apos;shing.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {tests.map((t) => (
            <Link
              key={t.id}
              href={`/tests/${t.id}`}
              className="bg-card border rounded-2xl p-5 hover:border-brand/40 hover:shadow-md transition"
            >
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="font-semibold">{t.title}</h3>
              {t.description && (
                <p className="text-sm text-muted mt-1 line-clamp-2">
                  {t.description}
                </p>
              )}
              <span className="inline-block mt-3 text-sm text-brand font-medium">
                Testni boshlash →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
