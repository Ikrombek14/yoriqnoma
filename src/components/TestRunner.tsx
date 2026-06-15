"use client";

import { useState } from "react";
import type { TestQuestion } from "@/lib/types";
import { gradeFromScore } from "@/lib/types";
import { saveAttempt } from "@/app/(dashboard)/tests/actions";

export default function TestRunner({
  testId,
  questions,
}: {
  testId: string;
  questions: TestQuestion[];
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_index) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    saveAttempt(testId, pct).catch(() => {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const grade = gradeFromScore(score);
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="space-y-5">
      {submitted && (
        <div className={`rounded-2xl border p-6 text-center ${colorMap[grade.color]}`}>
          <div className="text-4xl font-bold">{score}</div>
          <div className="text-lg font-semibold mt-1">{grade.label}</div>
          <button
            onClick={reset}
            className="mt-4 rounded-lg bg-white/70 px-4 py-2 text-sm font-medium hover:bg-white transition"
          >
            Qayta urinib ko&apos;rish
          </button>
        </div>
      )}

      {questions.map((q, idx) => (
        <div key={q.id} className="bg-card border rounded-2xl p-5">
          <div className="font-medium mb-3">
            <span className="text-brand">{idx + 1}.</span> {q.question}
          </div>
          <div className="space-y-2">
            {q.options.map((opt, oIdx) => {
              const selected = answers[q.id] === oIdx;
              const isCorrect = q.correct_index === oIdx;
              let cls =
                "border-border hover:border-brand/40 hover:bg-brand-50/50";
              if (submitted) {
                if (isCorrect)
                  cls = "border-emerald-300 bg-emerald-50 text-emerald-800";
                else if (selected)
                  cls = "border-rose-300 bg-rose-50 text-rose-800";
                else cls = "border-border opacity-70";
              } else if (selected) {
                cls = "border-brand bg-brand-50 text-brand";
              }
              return (
                <button
                  key={oIdx}
                  disabled={submitted}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, [q.id]: oIdx }))
                  }
                  className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition ${cls}`}
                >
                  {opt}
                  {submitted && isCorrect && " ✓"}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full rounded-xl bg-brand text-white font-medium py-3 hover:bg-brand-600 transition disabled:opacity-50"
        >
          {allAnswered
            ? "Natijani ko'rish"
            : `Barcha savollarga javob bering (${
                Object.keys(answers).length
              }/${questions.length})`}
        </button>
      )}
    </div>
  );
}
