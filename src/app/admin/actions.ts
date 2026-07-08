"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

async function ensureAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Ruxsat yo'q: faqat administratorlar.");
  }
  return createClient();
}

function refresh() {
  revalidatePath("/", "layout");
}

// ---------------- SECTIONS ----------------
export async function createSection(formData: FormData) {
  const supabase = await ensureAdmin();
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  const parent_id = String(formData.get("parent_id") || "") || null;
  await supabase.from("sections").insert({
    title,
    slug: slugify(title) + "-" + Math.random().toString(36).slice(2, 5),
    icon: String(formData.get("icon") || "") || null,
    description: String(formData.get("description") || "") || null,
    type: String(formData.get("type") || "content"),
    parent_id,
    position: Number(formData.get("position") || 0),
  });
  refresh();
}

export async function updateSection(formData: FormData) {
  const supabase = await ensureAdmin();
  const id = String(formData.get("id"));
  await supabase
    .from("sections")
    .update({
      title: String(formData.get("title") || "").trim(),
      icon: String(formData.get("icon") || "") || null,
      description: String(formData.get("description") || "") || null,
      type: String(formData.get("type") || "content"),
      position: Number(formData.get("position") || 0),
    })
    .eq("id", id);
  refresh();
}

export async function deleteSection(formData: FormData) {
  const supabase = await ensureAdmin();
  await supabase.from("sections").delete().eq("id", String(formData.get("id")));
  refresh();
}

// ---------------- POSTLAR (soddalashtirilgan: matn + YouTube bir formada) ----------------
export async function createPost(formData: FormData) {
  const supabase = await ensureAdmin();
  const section_id = String(formData.get("section_id"));
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "");
  const youtube = String(formData.get("youtube") || "").trim();
  // Fayldan yuklangan video (storage'ga clientda yuklanadi, bu yerga URL keladi)
  const video_url = String(formData.get("video_url") || "").trim();
  if (!title && !body && !youtube && !video_url)
    return { error: "Bo'sh post saqlanmaydi." };

  const { data: article, error } = await supabase
    .from("articles")
    .insert({ section_id, title, body, position: 999 })
    .select("id")
    .single();
  if (error || !article) return { error: "Saqlashda xatolik." };

  if (youtube) {
    await supabase.from("videos").insert({
      article_id: article.id,
      kind: "embed",
      url: youtube,
      position: 0,
    });
  }
  if (video_url) {
    await supabase.from("videos").insert({
      article_id: article.id,
      kind: "upload",
      url: video_url,
      position: youtube ? 1 : 0,
    });
  }
  refresh();
  return { ok: true };
}

export async function updatePost(formData: FormData) {
  const supabase = await ensureAdmin();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "");
  const youtube = String(formData.get("youtube") || "").trim();

  await supabase
    .from("articles")
    .update({ title, body, updated_at: new Date().toISOString() })
    .eq("id", id);

  // YouTube videoni yangilash: eski havola(lar)ni o'chirib, yangisini qo'yamiz.
  // Yuklangan fayl videolari (kind='upload') saqlanib qoladi.
  await supabase.from("videos").delete().eq("article_id", id).eq("kind", "embed");
  if (youtube) {
    await supabase
      .from("videos")
      .insert({ article_id: id, kind: "embed", url: youtube, position: 0 });
  }
  refresh();
}

// ---------------- ARTICLES (eski, ichki ishlatiladi) ----------------
export async function createArticle(formData: FormData) {
  const supabase = await ensureAdmin();
  await supabase.from("articles").insert({
    section_id: String(formData.get("section_id")),
    title: String(formData.get("title") || "").trim(),
    body: String(formData.get("body") || ""),
    position: Number(formData.get("position") || 0),
  });
  refresh();
}

export async function updateArticle(formData: FormData) {
  const supabase = await ensureAdmin();
  await supabase
    .from("articles")
    .update({
      title: String(formData.get("title") || "").trim(),
      body: String(formData.get("body") || ""),
      position: Number(formData.get("position") || 0),
      updated_at: new Date().toISOString(),
    })
    .eq("id", String(formData.get("id")));
  refresh();
}

export async function deleteArticle(formData: FormData) {
  const supabase = await ensureAdmin();
  await supabase.from("articles").delete().eq("id", String(formData.get("id")));
  refresh();
}

// ---------------- VIDEOS ----------------
export async function addVideo(formData: FormData) {
  const supabase = await ensureAdmin();
  const url = String(formData.get("url") || "").trim();
  if (!url) return;
  await supabase.from("videos").insert({
    article_id: String(formData.get("article_id")),
    title: String(formData.get("title") || "") || null,
    kind: String(formData.get("kind") || "embed"),
    url,
    position: Number(formData.get("position") || 0),
  });
  refresh();
}

export async function deleteVideo(formData: FormData) {
  const supabase = await ensureAdmin();
  await supabase.from("videos").delete().eq("id", String(formData.get("id")));
  refresh();
}

// ---------------- TESTS ----------------
export async function createTest(formData: FormData) {
  const supabase = await ensureAdmin();
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  await supabase.from("tests").insert({
    title,
    description: String(formData.get("description") || "") || null,
    position: Number(formData.get("position") || 0),
  });
  refresh();
}

export async function deleteTest(formData: FormData) {
  const supabase = await ensureAdmin();
  await supabase.from("tests").delete().eq("id", String(formData.get("id")));
  refresh();
}

export async function addQuestion(formData: FormData) {
  const supabase = await ensureAdmin();
  const options = [
    String(formData.get("opt0") || "").trim(),
    String(formData.get("opt1") || "").trim(),
    String(formData.get("opt2") || "").trim(),
    String(formData.get("opt3") || "").trim(),
  ].filter(Boolean);
  if (options.length < 2) return;
  await supabase.from("test_questions").insert({
    test_id: String(formData.get("test_id")),
    question: String(formData.get("question") || "").trim(),
    options,
    correct_index: Number(formData.get("correct_index") || 0),
    position: Number(formData.get("position") || 0),
  });
  refresh();
}

export async function deleteQuestion(formData: FormData) {
  const supabase = await ensureAdmin();
  await supabase
    .from("test_questions")
    .delete()
    .eq("id", String(formData.get("id")));
  refresh();
}

// ---------------- TODO ----------------
export async function createTodo(formData: FormData) {
  const supabase = await ensureAdmin();
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  await supabase.from("todo_items").insert({
    title,
    description: String(formData.get("description") || "") || null,
    position: Number(formData.get("position") || 0),
  });
  refresh();
}

export async function deleteTodo(formData: FormData) {
  const supabase = await ensureAdmin();
  await supabase.from("todo_items").delete().eq("id", String(formData.get("id")));
  refresh();
}

// ---------------- ROADMAP ----------------
export async function createRoadmapStage(formData: FormData) {
  const supabase = await ensureAdmin();
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  await supabase.from("roadmap_stages").insert({
    track: String(formData.get("track") || "administrative"),
    title,
    description: String(formData.get("description") || "") || null,
    requirements: String(formData.get("requirements") || "") || null,
    level: Number(formData.get("level") || 1),
    position: Number(formData.get("position") || 0),
  });
  refresh();
}

export async function deleteRoadmapStage(formData: FormData) {
  const supabase = await ensureAdmin();
  await supabase
    .from("roadmap_stages")
    .delete()
    .eq("id", String(formData.get("id")));
  refresh();
}
