"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/app/admin/actions";

export default function PostForm({ sectionId }: { sectionId: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: boolean; text: string } | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    fd.set("section_id", sectionId);
    try {
      const res = await createPost(fd);
      if (res?.error) {
        setMsg({ ok: false, text: res.error });
      } else {
        setMsg({ ok: true, text: "✅ Qo'shildi!" });
        formRef.current?.reset();
        router.refresh();
      }
    } catch {
      setMsg({ ok: false, text: "Xatolik yuz berdi." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="bg-card border-2 border-brand/20 rounded-2xl p-5 space-y-3"
    >
      <h2 className="font-semibold flex items-center gap-2">
        ➕ Yangi mavzu qo&apos;shish
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">📌 Sarlavha</label>
        <input
          name="title"
          placeholder="Masalan: Tizimga kirish"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">📝 Matn</label>
        <textarea
          name="body"
          rows={4}
          placeholder="Bu yerga tushuntirish matnini yozing..."
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <p className="text-[11px] text-muted mt-1">
          Ixtiyoriy formatlash: <code>**qalin**</code>, yangi qator —{" "}
          ro&apos;yxat uchun <code>- </code> bilan boshlang.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          🎥 YouTube havolasi{" "}
          <span className="text-muted font-normal">(ixtiyoriy)</span>
        </label>
        <input
          name="youtube"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <p className="text-[11px] text-muted mt-1">
          YouTube videoni oching → havolani nusxalab shu yerga joylang. Video
          avtomatik ko&apos;rinadi.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-brand text-white font-medium px-5 py-2.5 text-sm hover:bg-brand-600 transition disabled:opacity-50"
        >
          {busy ? "Saqlanmoqda..." : "Qo'shish"}
        </button>
        {msg && (
          <span
            className={`text-sm ${
              msg.ok ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}
