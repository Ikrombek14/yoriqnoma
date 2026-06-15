import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import SetupNotice from "@/components/SetupNotice";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-card border rounded-2xl p-8 text-center max-w-sm">
          <div className="text-3xl mb-2">🔒</div>
          <h1 className="font-bold text-lg">Ruxsat yo&apos;q</h1>
          <p className="text-muted text-sm mt-1">
            Bu sahifa faqat administratorlar uchun.
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-4 text-sm text-brand font-medium"
          >
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛠️</span>
              <span className="font-bold">Admin panel</span>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-muted hover:text-brand"
            >
              ← Dashboardga qaytish
            </Link>
          </div>
          <AdminNav />
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-8 py-8">{children}</div>
    </div>
  );
}
