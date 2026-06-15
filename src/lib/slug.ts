/** Matndan URL uchun xavfsiz slug yasaydi (lotin/raqam). */
export function slugify(text: string): string {
  const s = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // harf/raqam bo'lmagan belgilarni (apostrof ham) olib tashlaymiz
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "bolim-" + Math.random().toString(36).slice(2, 7);
}
