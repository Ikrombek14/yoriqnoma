import { getRoadmapStages } from "@/lib/data";
import { createRoadmapStage, deleteRoadmapStage } from "@/app/admin/actions";
import SubmitButton from "@/components/SubmitButton";

export default async function AdminRoadmapPage() {
  const stages = await getRoadmapStages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Career roadmap</h1>
        <p className="text-muted text-sm">
          Lavozim o&apos;sishi bosqichlarini boshqaring (administrativ va sotuv).
        </p>
      </div>

      <form
        action={createRoadmapStage}
        className="bg-card border rounded-2xl p-5 space-y-3"
      >
        <h2 className="font-semibold">➕ Yangi bosqich</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <select
            name="track"
            className="rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand bg-white"
          >
            <option value="administrative">Administrativ jamoa</option>
            <option value="sales">Sotuv</option>
          </select>
          <input
            name="level"
            type="number"
            defaultValue={1}
            placeholder="Bosqich (1,2,3...)"
            className="rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
          />
        </div>
        <input
          name="title"
          required
          placeholder="Lavozim nomi *"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <input
          name="description"
          placeholder="Qisqa tavsif"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <textarea
          name="requirements"
          rows={3}
          placeholder="Talablar (Markdown: - element)"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand font-mono"
        />
        <SubmitButton>Qo&apos;shish</SubmitButton>
      </form>

      <div className="grid sm:grid-cols-2 gap-4">
        {(["administrative", "sales"] as const).map((track) => (
          <div key={track}>
            <h3 className="font-semibold mb-2">
              {track === "administrative" ? "🧑‍💼 Administrativ" : "💼 Sotuv"}
            </h3>
            <div className="space-y-2">
              {stages
                .filter((s) => s.track === track)
                .map((s) => (
                  <div
                    key={s.id}
                    className="bg-card border rounded-xl p-3 flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">
                        {s.level}. {s.title}
                      </div>
                      {s.description && (
                        <div className="text-xs text-muted">
                          {s.description}
                        </div>
                      )}
                    </div>
                    <form action={deleteRoadmapStage}>
                      <input type="hidden" name="id" value={s.id} />
                      <SubmitButton variant="danger" size="sm" confirm="O'chirilsinmi?">
                        ✕
                      </SubmitButton>
                    </form>
                  </div>
                ))}
              {stages.filter((s) => s.track === track).length === 0 && (
                <p className="text-xs text-muted">Bosqich yo&apos;q.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
