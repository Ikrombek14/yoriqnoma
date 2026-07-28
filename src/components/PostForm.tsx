"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@/components/Editor";
import { createClient } from "@/lib/supabase/client";
import { createPost } from "@/app/admin/actions";
import {
  compressVideo,
  fmtMB,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
} from "@/lib/video-compress";

export default function PostForm({ sectionId }: { sectionId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([""]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [body, setBody] = useState("");
  const [formKey, setFormKey] = useState(0); // editorни tozalash uchun
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: boolean; text: string } | null>(null);

  const submit = async () => {
    setBusy(true);
    setMsg(null);

    // Video faylni avval siqamiz, so'ng storage'ga yuklab URL'ni postga bog'laymiz
    let videoUrl = "";
    if (videoFile) {
      setMsg({ ok: true, text: "🗜 Video siqilmoqda... 0%" });
      const { file: upload, compressed } = await compressVideo(videoFile, (pct) =>
        setMsg({ ok: true, text: `🗜 Video siqilmoqda... ${pct}%` })
      );
      if (upload.size > MAX_UPLOAD_BYTES) {
        setMsg({
          ok: false,
          text: `Video siqilgandan keyin ham ${fmtMB(upload.size)} — maksimum ${MAX_UPLOAD_MB} MB. Qisqaroq video yuklang yoki YouTube'dan foydalaning.`,
        });
        setBusy(false);
        return;
      }
      setMsg({
        ok: true,
        text: compressed
          ? `⏳ Yuklanmoqda... (${fmtMB(videoFile.size)} → ${fmtMB(upload.size)})`
          : "⏳ Video yuklanmoqda...",
      });
      const supabase = createClient();
      const ext = upload.name.split(".").pop()?.toLowerCase() || "mp4";
      const rnd = Math.random().toString(36).slice(2, 8);
      const path = `videos/${Date.now()}-${rnd}.${ext}`;
      const { error } = await supabase.storage
        .from("media")
        .upload(path, upload, { contentType: upload.type || undefined });
      if (error) {
        setMsg({ ok: false, text: "Video yuklashda xatolik: " + error.message });
        setBusy(false);
        return;
      }
      videoUrl = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
    }

    const fd = new FormData();
    fd.set("section_id", sectionId);
    fd.set("title", title);
    fd.set("body", body);
    fd.set(
      "youtube",
      youtubeLinks
        .map((l) => l.trim())
        .filter(Boolean)
        .join("\n")
    );
    fd.set("video_url", videoUrl);
    try {
      const res = await createPost(fd);
      if (res?.error) {
        setMsg({ ok: false, text: res.error });
      } else {
        setMsg({ ok: true, text: "✅ Qo'shildi!" });
        setTitle("");
        setYoutubeLinks([""]);
        setVideoFile(null);
        setBody("");
        setFormKey((k) => k + 1);
        router.refresh();
      }
    } catch {
      setMsg({ ok: false, text: "Xatolik yuz berdi." });
    } finally {
      setBusy(false);
    }
  };

  const updateLink = (i: number, value: string) => {
    setYoutubeLinks((links) => links.map((l, idx) => (idx === i ? value : l)));
  };

  const addLinkField = () => setYoutubeLinks((links) => [...links, ""]);

  const removeLinkField = (i: number) =>
    setYoutubeLinks((links) =>
      links.length > 1 ? links.filter((_, idx) => idx !== i) : links
    );

  return (
    <div className="bg-card border-2 border-brand/20 rounded-2xl p-5 space-y-3">
      <h2 className="font-semibold flex items-center gap-2">
        ➕ Yangi mavzu qo&apos;shish
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">📌 Sarlavha</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masalan: Tizimga kirish"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">📝 Matn</label>
        <Editor key={formKey} value="" onChange={setBody} />
        <p className="text-[11px] text-muted mt-1">
          Blok qo&apos;shish uchun yangi qatorda <b>&quot;/&quot;</b> ni bosing —
          sarlavha, ro&apos;yxat, <b>toggle (ochiladigan bo&apos;lim)</b>, rasm va
          h.k.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          🎥 YouTube havolasi (havolalari){" "}
          <span className="text-muted font-normal">(ixtiyoriy)</span>
        </label>
        <div className="space-y-2">
          {youtubeLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={link}
                onChange={(e) => updateLink(i, e.target.value)}
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
              />
              {youtubeLinks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLinkField(i)}
                  title="Bu havolani o'chirish"
                  className="shrink-0 rounded-lg border px-2.5 py-2 text-xs text-muted hover:text-rose-600 hover:border-rose-300 transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLinkField}
          className="mt-2 text-xs font-medium text-brand hover:text-brand-600"
        >
          + Yana YouTube havolasi qo&apos;shish
        </button>
        <p className="text-[11px] text-muted mt-1">
          Bitta mavzuga bir nechta video havolasi qo&apos;shishingiz mumkin —
          barchasi shu mavzu ichida ko&apos;rinadi.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          📁 Video fayl{" "}
          <span className="text-muted font-normal">(ixtiyoriy)</span>
        </label>
        <input
          key={formKey}
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:text-white file:px-3 file:py-1.5 file:text-xs file:cursor-pointer"
        />
        <p className="text-[11px] text-muted mt-1">
          {videoFile
            ? `Tanlandi: ${videoFile.name} (${fmtMB(videoFile.size)})`
            : "Katta videolar avtomatik siqiladi (720p) — yuklash tezlashadi."}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={submit}
          disabled={busy}
          className="rounded-xl bg-brand text-white font-medium px-5 py-2.5 text-sm hover:bg-brand-600 transition disabled:opacity-50"
        >
          {busy ? "Saqlanmoqda..." : "Qo'shish"}
        </button>
        {msg && (
          <span
            className={`text-sm ${msg.ok ? "text-emerald-600" : "text-rose-600"}`}
          >
            {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}
