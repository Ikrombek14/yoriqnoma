/** Matn BlockNote JSON formatida saqlanganmi? (server va clientda ishlaydi) */
export function isBlockJSON(body: string): boolean {
  if (!body) return false;
  try {
    const v = JSON.parse(body);
    return Array.isArray(v) && v.length > 0 && typeof v[0] === "object";
  } catch {
    return false;
  }
}
