export default function SetupNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg bg-card border rounded-2xl p-8 shadow-sm">
        <div className="text-3xl mb-3">⚙️</div>
        <h1 className="text-xl font-bold mb-2">Supabase ulanmagan</h1>
        <p className="text-muted text-sm mb-4">
          Ilovani ishga tushirish uchun Supabase loyihangiz ma&apos;lumotlarini
          kiriting:
        </p>
        <ol className="text-sm space-y-2 list-decimal pl-5 mb-4">
          <li>
            <code className="bg-brand-50 px-1.5 py-0.5 rounded">
              .env.local.example
            </code>{" "}
            faylini <code className="bg-brand-50 px-1.5 py-0.5 rounded">.env.local</code>{" "}
            deb nusxalang.
          </li>
          <li>Supabase URL va ANON kalitni qo&apos;ying.</li>
          <li>
            <code className="bg-brand-50 px-1.5 py-0.5 rounded">supabase/schema.sql</code>{" "}
            va <code className="bg-brand-50 px-1.5 py-0.5 rounded">seed.sql</code> ni
            SQL Editor&apos;da ishga tushiring.
          </li>
          <li>
            Dev serverni qayta ishga tushiring:{" "}
            <code className="bg-brand-50 px-1.5 py-0.5 rounded">npm run dev</code>
          </li>
        </ol>
        <p className="text-xs text-muted">
          Batafsil: <code>README.md</code> fayliga qarang.
        </p>
      </div>
    </div>
  );
}
