import { getRoadmapStages } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
import type { RoadmapStage } from "@/lib/types";

function Track({
  title,
  emoji,
  stages,
  accent,
}: {
  title: string;
  emoji: string;
  stages: RoadmapStage[];
  accent: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        <span>{emoji}</span> {title}
      </h2>
      {stages.length === 0 ? (
        <p className="text-sm text-muted">Bosqichlar qo&apos;shilmagan.</p>
      ) : (
        <ol className="relative border-l-2 border-dashed pl-6 space-y-5">
          {stages.map((s, i) => (
            <li key={s.id} className="relative">
              <span
                className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${accent}`}
              >
                {i + 1}
              </span>
              <div className="bg-card border rounded-2xl p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">{s.title}</h3>
                  <span className="text-[11px] text-muted bg-black/[0.04] rounded-full px-2 py-0.5">
                    {s.level}-bosqich
                  </span>
                </div>
                {s.description && (
                  <p className="text-sm text-muted mt-1">{s.description}</p>
                )}
                {s.requirements && (
                  <div
                    className="prose-content text-sm mt-3"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(s.requirements),
                    }}
                  />
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default async function RoadmapPage() {
  const stages = await getRoadmapStages();
  const admin = stages.filter((s) => s.track === "administrative");
  const sales = stages.filter((s) => s.track === "sales");

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🚀 Career roadmap
        </h1>
        <p className="text-muted text-sm mt-1">
          Lavozim o&apos;sishi yo&apos;l xaritasi — administrativ jamoa va sotuv
          uchun.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <Track
          title="Administrativ jamoa"
          emoji="🧑‍💼"
          stages={admin}
          accent="bg-brand"
        />
        <Track
          title="Sotuv"
          emoji="💼"
          stages={sales}
          accent="bg-emerald-500"
        />
      </div>
    </div>
  );
}
