import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import SetupNotice from "@/components/SetupNotice";

export default function Home() {
  if (!isSupabaseConfigured()) {
    return <SetupNotice />;
  }
  redirect("/dashboard");
}
