import Link from "next/link";
import { notFound } from "next/navigation";
import { getTestWithQuestions } from "@/lib/data";
import TestRunner from "@/components/TestRunner";

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const test = await getTestWithQuestions(id);
  if (!test) notFound();

  return (
    <div>
      <Link href="/tests" className="text-sm text-muted hover:text-brand">
        ← Testlar ro&apos;yxati
      </Link>
      <header className="mt-3 mb-6">
        <h1 className="text-2xl font-bold">{test.title}</h1>
        {test.description && (
          <p className="text-muted text-sm mt-1">{test.description}</p>
        )}
      </header>

      {test.questions.length === 0 ? (
        <div className="bg-card border rounded-2xl p-8 text-center text-muted">
          Bu testda hali savollar yo&apos;q.
        </div>
      ) : (
        <TestRunner testId={test.id} questions={test.questions} />
      )}
    </div>
  );
}
