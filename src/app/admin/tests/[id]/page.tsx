import Link from "next/link";
import { notFound } from "next/navigation";
import { getTestWithQuestions } from "@/lib/data";
import { addQuestion, deleteQuestion } from "@/app/admin/actions";
import SubmitButton from "@/components/SubmitButton";

export default async function AdminTestQuestions({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const test = await getTestWithQuestions(id);
  if (!test) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/tests" className="text-sm text-muted hover:text-brand">
          ← Testlar
        </Link>
        <h1 className="text-2xl font-bold mt-2">{test.title}</h1>
        <p className="text-muted text-sm">Savollarni boshqaring.</p>
      </div>

      {/* Yangi savol */}
      <form
        action={addQuestion}
        className="bg-card border rounded-2xl p-5 space-y-3"
      >
        <h2 className="font-semibold">➕ Yangi savol</h2>
        <input type="hidden" name="test_id" value={id} />
        <input
          name="question"
          required
          placeholder="Savol matni *"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <p className="text-xs text-muted">
          Variantlar (kamida 2 ta to&apos;ldiring). To&apos;g&apos;ri javobni
          belgilang:
        </p>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name="correct_index"
              value={i}
              defaultChecked={i === 0}
              className="accent-[var(--brand)]"
            />
            <input
              name={`opt${i}`}
              placeholder={`Variant ${i + 1}`}
              className="flex-1 rounded-xl border px-3.5 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
        ))}
        <SubmitButton>Savol qo&apos;shish</SubmitButton>
      </form>

      {/* Savollar */}
      <div className="space-y-3">
        {test.questions.map((q, idx) => (
          <div key={q.id} className="bg-card border rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium">
                  {idx + 1}. {q.question}
                </div>
                <ul className="mt-2 space-y-1">
                  {q.options.map((o, oi) => (
                    <li
                      key={oi}
                      className={`text-sm ${
                        oi === q.correct_index
                          ? "text-emerald-700 font-medium"
                          : "text-muted"
                      }`}
                    >
                      {oi === q.correct_index ? "✓" : "•"} {o}
                    </li>
                  ))}
                </ul>
              </div>
              <form action={deleteQuestion}>
                <input type="hidden" name="id" value={q.id} />
                <SubmitButton variant="danger" size="sm" confirm="O'chirilsinmi?">
                  ✕
                </SubmitButton>
              </form>
            </div>
          </div>
        ))}
        {test.questions.length === 0 && (
          <p className="text-muted text-sm text-center py-4">
            Hali savol yo&apos;q.
          </p>
        )}
      </div>
    </div>
  );
}
