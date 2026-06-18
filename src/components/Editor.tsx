"use client";

import { useEffect, useMemo, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import type { PartialBlock } from "@blocknote/core";

/** Saqlangan matnni bloklarga aylantiradi (JSON bo'lsa). Markdown bo'lsa null. */
export function parseToBlocks(body: string): PartialBlock[] | null {
  if (!body) return null;
  try {
    const v = JSON.parse(body);
    if (Array.isArray(v) && v.length) return v as PartialBlock[];
  } catch {
    // JSON emas — markdown deb hisoblaymiz
  }
  return null;
}

function InnerEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (json: string) => void;
}) {
  const initialBlocks = useMemo(() => parseToBlocks(value), [value]);
  const editor = useCreateBlockNote({
    initialContent: initialBlocks ?? undefined,
  });

  // Eski markdown kontentni bloklarga ko'chirish (faqat bir marta)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!initialBlocks && value && value.trim()) {
        const blocks = await editor.tryParseMarkdownToBlocks(value);
        if (!cancelled && blocks?.length) {
          editor.replaceBlocks(editor.document, blocks);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl border bg-white py-2">
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={() => onChange(JSON.stringify(editor.document))}
      />
    </div>
  );
}

export default function Editor({
  value,
  onChange,
}: {
  value: string;
  onChange: (json: string) => void;
}) {
  // BlockNote faqat brauzerda ishlaydi — SSR'da render qilmaymiz.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="rounded-xl border bg-white px-3 py-8 text-sm text-muted">
        Editor yuklanmoqda...
      </div>
    );
  }
  return <InnerEditor value={value} onChange={onChange} />;
}
