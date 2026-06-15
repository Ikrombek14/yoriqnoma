"use client";

import { useActionState } from "react";
import Image from "next/image";
import { signIn } from "@/app/auth/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, null as { error?: string } | null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/robbit-logo.webp"
            alt="Robbit"
            width={200}
            height={52}
            priority
            className="mx-auto h-12 w-auto object-contain"
          />
          <h1 className="mt-4 text-xl font-bold">Admin kirish</h1>
          <p className="text-muted text-sm mt-1">
            Yo&apos;riqnoma va qo&apos;llanma boshqaruvi
          </p>
        </div>

        <form
          action={action}
          className="bg-card rounded-2xl border p-6 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Parol</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-brand text-white font-medium py-2.5 hover:bg-brand-600 transition disabled:opacity-60"
          >
            {pending ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          Akkaunt Supabase administratoringiz tomonidan yaratiladi.
        </p>
      </div>
    </div>
  );
}
