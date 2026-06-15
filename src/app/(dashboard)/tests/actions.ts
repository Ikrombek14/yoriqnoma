"use server";

import { createClient } from "@/lib/supabase/server";

/** Test natijasini saqlaydi (ixtiyoriy tarix). */
export async function saveAttempt(testId: string, score: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("test_attempts").insert({
    test_id: testId,
    user_id: user.id,
    score,
  });
}
