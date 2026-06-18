import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getArticlesForSection } from "@/lib/data";
import type { Section } from "@/lib/types";
import PostForm from "@/components/PostForm";
import PostEditCard from "@/components/PostEditCard";

export default async function AdminSectionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: section } = await supabase
    .from("sections")
    .select("*")
    .eq("id", id)
    .single();
  if (!section) notFound();
  const sec = section as Section;

  const articles = await getArticlesForSection(id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/sections"
          className="text-sm text-muted hover:text-brand"
        >
          ← Bo&apos;limlar
        </Link>
        <h1 className="text-2xl font-bold mt-2">
          {sec.icon} {sec.title}
        </h1>
        <p className="text-muted text-sm">
          Mavzu (matn + YouTube video) qo&apos;shing. Pastda qo&apos;shilganlar
          ko&apos;rinadi.
        </p>
      </div>

      {/* Yangi mavzu qo'shish (sodda) */}
      <PostForm sectionId={id} />

      {/* Qo'shilgan mavzular */}
      <div>
        <h2 className="text-sm font-semibold text-muted mb-3">
          QO&apos;SHILGAN MAVZULAR ({articles.length})
        </h2>

        {articles.length === 0 ? (
          <p className="text-muted text-sm text-center py-6 bg-card border rounded-2xl">
            Hali mavzu yo&apos;q. Yuqoridagi formadan birinchisini qo&apos;shing.
          </p>
        ) : (
          <div className="space-y-5">
            {articles.map((a, idx) => (
              <PostEditCard key={a.id} article={a} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
