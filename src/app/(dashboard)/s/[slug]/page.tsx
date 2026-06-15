import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSectionBySlug,
  getArticlesForSection,
  getAllSectionsFlat,
} from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
import VideoPlayer from "@/components/VideoPlayer";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = await getSectionBySlug(slug);
  if (!section) notFound();

  const [articles, allSections] = await Promise.all([
    getArticlesForSection(section.id),
    getAllSectionsFlat(),
  ]);

  const children = allSections.filter((s) => s.parent_id === section.id);

  return (
    <article>
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
            {section.icon || "📄"}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{section.title}</h1>
            {section.description && (
              <p className="text-muted text-sm">{section.description}</p>
            )}
          </div>
        </div>
      </header>

      {/* Kichik bo'limlar (masalan: Holly Hop, ERP, Bitrix) */}
      {children.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {children.map((c) => (
            <Link
              key={c.id}
              href={`/s/${c.slug}`}
              className="bg-card border rounded-xl p-4 hover:border-brand/40 hover:shadow-sm transition"
            >
              <div className="text-2xl mb-1">{c.icon || "📁"}</div>
              <div className="font-medium">{c.title}</div>
              {c.description && (
                <div className="text-xs text-muted mt-0.5 line-clamp-2">
                  {c.description}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Maqolalar */}
      {articles.length === 0 && children.length === 0 && (
        <div className="bg-card border rounded-2xl p-8 text-center text-muted">
          Bu bo&apos;lim hali to&apos;ldirilmagan. Admin panel orqali matn va
          video qo&apos;shing.
        </div>
      )}

      <div className="space-y-8">
        {articles.map((a) => (
          <section
            key={a.id}
            className="bg-card border rounded-2xl p-6 shadow-sm"
          >
            {a.title && (
              <h2 className="text-xl font-bold mb-3">{a.title}</h2>
            )}
            {a.body && (
              <div
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(a.body) }}
              />
            )}
            {a.videos.map((v) => (
              <VideoPlayer key={v.id} video={v} />
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
