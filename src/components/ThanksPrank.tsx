"use client";

import { useEffect, useState } from "react";

const TELEGRAM_URL = "https://t.me/ikromoff14";
const SHOW_MS = 5000;

// Har safar sahifa ochilganda chiqadi va 5 sekunddan keyin o'zi yo'qoladi.
export default function ThanksPrank() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), SHOW_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="max-w-sm w-full bg-card border rounded-2xl p-8 shadow-xl text-center">
        <div className="text-5xl mb-4">🙏</div>
        <h2 className="text-lg font-bold mb-2">
          Sayt ishlagani uchun Ikrom akaga rahmat ayting)
        </h2>
        <p className="text-sm text-muted mb-2">
          Iroda opa, xafa bo&apos;lmang hay 😊🌸 Kayfiyatingiz doim a&apos;lo
          bo&apos;lsin! ✨💐😄
        </p>
        <a
          href={TELEGRAM_URL}
          className="mt-4 inline-block w-full rounded-xl bg-brand text-white font-semibold py-3 hover:bg-brand-600 transition-colors"
        >
          Aytdim
        </a>
      </div>
    </div>
  );
}
