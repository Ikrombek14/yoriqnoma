import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getArticlesForSection } from "@/lib/data";
import type { Section } from "@/lib/types";
import { updatePost, deleteArticle, deleteVideo } from "@/app/admin/actions";
import SubmitButton from "@/components/SubmitButton";
import PostForm from "@/components/PostForm";
import VideoUploader from "@/components/VideoUploader";
import VideoPlayer from "@/components/VideoPlayer";

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
            {articles.map((a, idx) => {
              const embed = a.videos.find((v) => v.kind === "embed");
              const uploads = a.videos.filter((v) => v.kind === "upload");
              return (
                <div key={a.id} className="bg-card border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted">
                      #{idx + 1}
                    </span>
                    <form action={deleteArticle}>
                      <input type="hidden" name="id" value={a.id} />
                      <SubmitButton
                        variant="danger"
                        size="sm"
                        confirm="Bu mavzu o'chirilsinmi?"
                      >
                        🗑 O&apos;chirish
                      </SubmitButton>
                    </form>
                  </div>

                  <form action={updatePost} className="space-y-3">
                    <input type="hidden" name="id" value={a.id} />
                    <div>
                      <label className="block text-xs font-medium mb-1 text-muted">
                        Sarlavha
                      </label>
                      <input
                        name="title"
                        defaultValue={a.title}
                        className="w-full rounded-xl border px-3.5 py-2 text-sm font-medium outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-muted">
                        Matn
                      </label>
                      <textarea
                        name="body"
                        defaultValue={a.body}
                        rows={4}
                        className="w-full rounded-xl border px-3.5 py-2 text-sm outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-muted">
                        🎥 YouTube havolasi
                      </label>
                      <input
                        name="youtube"
                        type="url"
                        defaultValue={embed?.url ?? ""}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full rounded-xl border px-3.5 py-2 text-sm outline-none focus:border-brand"
                      />
                    </div>
                    <SubmitButton>💾 Saqlash</SubmitButton>
                  </form>

                  {/* Joriy video ko'rinishi */}
                  {embed && (
                    <div className="mt-2">
                      <div className="text-xs text-muted mb-1">
                        Joriy video ko&apos;rinishi:
                      </div>
                      <VideoPlayer video={embed} />
                    </div>
                  )}

                  {/* Yuklangan fayl videolari */}
                  {uploads.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {uploads.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between gap-2 bg-black/[0.03] rounded-lg px-3 py-2"
                        >
                          <span className="text-xs truncate">
                            📁 {v.title || v.url.split("/").pop()}
                          </span>
                          <form action={deleteVideo}>
                            <input type="hidden" name="id" value={v.id} />
                            <SubmitButton variant="danger" size="sm">
                              ✕
                            </SubmitButton>
                          </form>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3">
                    <VideoUploader articleId={a.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
