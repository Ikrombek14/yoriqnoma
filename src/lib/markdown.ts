import { marked } from "marked";

marked.setOptions({ breaks: true, gfm: true });

/** Markdown matnni HTML ga aylantiradi. */
export function renderMarkdown(md: string): string {
  return marked.parse(md || "") as string;
}

/**
 * Video havolasini embed ko'rinishiga keltiradi.
 * YouTube / Vimeo havolalarini qo'llab-quvvatlaydi.
 */
export function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      // /embed/ yoki /shorts/
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" && parts[1])
        return `https://www.youtube.com/embed/${parts[1]}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}
