import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { getSectionTree } from "@/lib/data";
import SetupNotice from "@/components/SetupNotice";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return <SetupNotice />;
  }

  // Kontent hammaga ochiq — login talab qilinmaydi.
  // Profil bo'lsa (admin kirgan bo'lsa) admin havolasini ko'rsatamiz.
  const profile = await getCurrentProfile();
  const tree = await getSectionTree();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        tree={tree}
        profile={
          profile
            ? {
                full_name: profile.full_name,
                email: profile.email,
                role: profile.role,
              }
            : null
        }
      />
      <main className="flex-1 lg:ml-72 min-w-0">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
