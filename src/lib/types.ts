// Ma'lumotlar bazasi modellari (Supabase jadvallariga mos)

export type Role = "admin" | "viewer";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
}

export type SectionType = "content" | "tests" | "todo" | "roadmap";

export interface Section {
  id: string;
  parent_id: string | null;
  title: string;
  slug: string;
  icon: string | null; // emoji yoki ikon nomi
  description: string | null;
  type: SectionType;
  position: number;
  created_at: string;
}

export interface Article {
  id: string;
  section_id: string;
  title: string;
  body: string; // Markdown
  position: number;
  created_at: string;
  updated_at: string;
}

export type VideoKind = "embed" | "upload";

export interface Video {
  id: string;
  article_id: string;
  title: string | null;
  kind: VideoKind;
  url: string; // embed havola yoki storage public URL
  position: number;
  created_at: string;
}

// O'z-o'zini baholash testlari
export interface Test {
  id: string;
  section_id: string | null;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
}

export interface TestQuestion {
  id: string;
  test_id: string;
  question: string;
  options: string[]; // jsonb
  correct_index: number;
  position: number;
}

// To-do list (admin yaratadi, har bir foydalanuvchi belgilab boradi)
export interface TodoItem {
  id: string;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
}

export interface TodoCompletion {
  user_id: string;
  item_id: string;
  done: boolean;
  updated_at: string;
}

// Career roadmap
export type RoadmapTrack = "administrative" | "sales";

export interface RoadmapStage {
  id: string;
  track: RoadmapTrack;
  title: string; // lavozim nomi
  description: string | null;
  requirements: string | null; // talablar (markdown/matn)
  level: number; // 1 dan boshlab
  position: number;
}

// Test natijasi bahosi
export function gradeFromScore(score: number): {
  label: string;
  color: string;
} {
  if (score >= 100) return { label: "Zo'r 🔥", color: "emerald" };
  if (score >= 80) return { label: "Yaxshi 👍", color: "blue" };
  if (score >= 70) return { label: "O'rtacha 🙂", color: "amber" };
  return { label: "Yana urinib ko'ring 💪", color: "rose" };
}
