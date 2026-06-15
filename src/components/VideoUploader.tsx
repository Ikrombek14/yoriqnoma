"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { addVideo } from "@/app/admin/actions";

/** Ixtiyoriy: postga fayl ko'rinishidagi video yuklash. */
export default function VideoUploader({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const upload = async () => {
    if (!file) return;
    setBusy(true);
    setMsg("Yuklanmoqda...");
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "mp4";
      const path = `videos/${articleId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      const fd = new FormData();
      fd.set("article_id", articleId);
      fd.set("kind", "upload");
      fd.set("url", data.publicUrl);
      await addVideo(fd);
      setMsg("✅ Yuklandi");
      setFile(null);
      router.refresh();
    } catch (e) {
      setMsg("Xatolik: " + (e instanceof Error ? e.message : ""));
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-muted hover:text-brand"
      >
        ⬆️ Fayl ko&apos;rinishida video yuklash (ixtiyoriy)
      </button>
    );
  }

  return (
    <div className="bg-black/[0.03] rounded-xl p-3 space-y-2">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-brand file:text-white file:px-3 file:py-1.5"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={upload}
          disabled={busy || !file}
          className="rounded-lg bg-brand text-white text-xs px-3 py-1.5 disabled:opacity-50"
        >
          {busy ? "..." : "Yuklash"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-muted"
        >
          Bekor
        </button>
        {msg && <span className="text-xs text-muted">{msg}</span>}
      </div>
    </div>
  );
}
