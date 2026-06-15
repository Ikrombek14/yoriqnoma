import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Service client — RLS'ni chetlab o'tadi, faqat SERVERDA ishlatiladi.
 * Ochiq (loginsiz) kontentni o'qish uchun. Service kalit hech qachon
 * brauzerga yuborilmaydi (NEXT_PUBLIC emas).
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/**
 * Server uchun Supabase client (cookie asosida sessiya).
 * Server Component / Route Handler / Server Action ichida ishlatiladi.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component ichidan chaqirilganda set ishlamaydi —
            // sessiya middleware orqali yangilanadi, shuning uchun e'tiborsiz qoldiramiz.
          }
        },
      },
    }
  );
}

/** Env sozlanganmi? (Supabase ulanmagan bo'lsa setup ekranini ko'rsatamiz) */
export function isSupabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR-PROJECT")
  );
}
