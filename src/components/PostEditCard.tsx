"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@/components/Editor";
import VideoPlayer from "@/components/VideoPlayer";
import VideoUploader from "@/components/VideoUploader";
import { updatePost, deleteArticle, deleteVideo } from "@/app/admin/actions";
import type { ArticleWithVideos } from "@/lib/data";

export default function PostEditCard({
  article,
  index,
  canMoveUp = false,
  canMoveDown = false,
  moving = false,
  onMoveUp,
  onMoveDown,
}: {
  article: ArticleWithVideos;
  index: number;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  moving?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const router = useRouter();
  const embed = article.videos.find((v) => v.kind === "embed");
  const uploads = article.videos.filter((v) => v.kind === "upload");

  const [title, setTitle] = useState(article.title);
  const [youtube, setYoutube] = useState(embed?.url ?? "");
  const [body, setBody] = useState(article.body);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setBusy(true);
    setSaved(false);
    const fd = new FormData();
    fd.set("id", article.id);
    fd.set("title", title);
    fd.set("body", body);
    fd.set("youtube", youtube);
    try {
      await updatePost(fd);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Bu mavzu o'chirilsinmi?")) return;
    const fd = new FormData();
    fd.set("id", article.id);
    await deleteArticle(fd);
    router.refresh();
  };

  const removeVideo = async (id: string) => {
    const fd = new FormData();
    fd.set("id", id);
    await deleteVideo(fd);
    router.refresh();
  };

  return (
    <div className="bg-card border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted">#{index + 1}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp || moving}
              title="Yuqoriga siljitish"
              className="rounded-lg border px-2 py-1 text-xs text-muted hover:text-brand hover:border-brand disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown || moving}
              title="Pastga siljitish"
              className="rounded-lg border px-2 py-1 text-xs text-muted hover:text-brand hover:border-brand disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ↓
            </button>
          </div>
        </div>
        <button
          onClick={remove}
          className="rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 text-xs font-medium transition"
        >
          🗑 O&apos;chirish
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1 text-muted">
            Sarlavha
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border px-3.5 py-2 text-sm font-medium outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-muted">
            Matn
          </label>
          <Editor value={article.body} onChange={setBody} />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-muted">
            🎥 YouTube havolasi
          </label>
          <input
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full rounded-xl border px-3.5 py-2 text-sm outline-none focus:border-brand"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={busy}
            className="rounded-xl bg-brand text-white font-medium px-4 py-2 text-sm hover:bg-brand-600 transition disabled:opacity-50"
          >
            {busy ? "..." : "💾 Saqlash"}
          </button>
          {saved && <span className="text-sm text-emerald-600">✅ Saqlandi</span>}
        </div>
      </div>

      {embed && (
        <div className="mt-3">
          <div className="text-xs text-muted mb-1">Joriy video:</div>
          <VideoPlayer video={embed} />
        </div>
      )}

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
              <button
                onClick={() => removeVideo(v.id)}
                className="rounded-lg bg-rose-50 text-rose-600 px-2.5 py-1 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3">
        <VideoUploader articleId={article.id} />
      </div>
    </div>
  );
}
