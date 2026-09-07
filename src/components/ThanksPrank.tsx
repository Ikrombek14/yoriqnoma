"use client";

const TELEGRAM_URL = "https://t.me/ikromoff14";

// Har safar sahifa ochilganda chiqadi — yopishning yagona yo'li "Aytdim".
export default function ThanksPrank() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="max-w-sm w-full bg-card border rounded-2xl p-8 shadow-xl text-center">
        <div className="text-5xl mb-4">🙏</div>
        <h2 className="text-lg font-bold mb-2">
          Sayt ishlagani uchun Ikrom akaga rahmat ayting)
        </h2>
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
