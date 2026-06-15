import { createServiceClient } from "@/lib/supabase/server";
import type {
  Section,
  Article,
  Video,
  Test,
  TestQuestion,
  TodoItem,
  RoadmapStage,
} from "@/lib/types";

export interface SectionNode extends Section {
  children: SectionNode[];
}

/** Barcha bo'limlarni daraxt ko'rinishida qaytaradi. */
export async function getSectionTree(): Promise<SectionNode[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("sections")
    .select("*")
    .order("position", { ascending: true });

  const sections = (data as Section[]) ?? [];
  const byId = new Map<string, SectionNode>();
  sections.forEach((s) => byId.set(s.id, { ...s, children: [] }));

  const roots: SectionNode[] = [];
  byId.forEach((node) => {
    if (node.parent_id && byId.has(node.parent_id)) {
      byId.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

export async function getAllSectionsFlat(): Promise<Section[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("sections")
    .select("*")
    .order("position", { ascending: true });
  return (data as Section[]) ?? [];
}

export async function getSectionBySlug(slug: string): Promise<Section | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("sections")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as Section) ?? null;
}

export interface ArticleWithVideos extends Article {
  videos: Video[];
}

export async function getArticlesForSection(
  sectionId: string
): Promise<ArticleWithVideos[]> {
  const supabase = createServiceClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("section_id", sectionId)
    .order("position", { ascending: true });

  const list = (articles as Article[]) ?? [];
  if (list.length === 0) return [];

  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .in(
      "article_id",
      list.map((a) => a.id)
    )
    .order("position", { ascending: true });

  const vids = (videos as Video[]) ?? [];
  return list.map((a) => ({
    ...a,
    videos: vids.filter((v) => v.article_id === a.id),
  }));
}

// ---------- TESTS ----------
export async function getTests(): Promise<Test[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("tests")
    .select("*")
    .order("position", { ascending: true });
  return (data as Test[]) ?? [];
}

export interface TestWithQuestions extends Test {
  questions: TestQuestion[];
}

export async function getTestWithQuestions(
  testId: string
): Promise<TestWithQuestions | null> {
  const supabase = createServiceClient();
  const { data: test } = await supabase
    .from("tests")
    .select("*")
    .eq("id", testId)
    .single();
  if (!test) return null;

  const { data: questions } = await supabase
    .from("test_questions")
    .select("*")
    .eq("test_id", testId)
    .order("position", { ascending: true });

  return { ...(test as Test), questions: (questions as TestQuestion[]) ?? [] };
}

// ---------- TODO ----------
export async function getTodoItems(): Promise<TodoItem[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("todo_items")
    .select("*")
    .order("position", { ascending: true });
  return (data as TodoItem[]) ?? [];
}

// ---------- ROADMAP ----------
export async function getRoadmapStages(): Promise<RoadmapStage[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("roadmap_stages")
    .select("*")
    .order("level", { ascending: true })
    .order("position", { ascending: true });
  return (data as RoadmapStage[]) ?? [];
}
