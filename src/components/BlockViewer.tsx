"use client";

import { useEffect, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import type { PartialBlock } from "@blocknote/core";

function Inner({ blocks }: { blocks: PartialBlock[] }) {
  const editor = useCreateBlockNote({ initialContent: blocks });
  return <BlockNoteView editor={editor} editable={false} theme="light" />;
}

/** Saqlangan BlockNote JSON kontentni faqat o'qish uchun ko'rsatadi. */
export default function BlockViewer({ json }: { json: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  let blocks: PartialBlock[] = [];
  try {
    blocks = JSON.parse(json);
  } catch {
    blocks = [];
  }

  if (!mounted) {
    return <div className="text-sm text-muted py-2">Yuklanmoqda...</div>;
  }
  if (blocks.length === 0) return null;

  return (
    <div className="bn-viewer -mx-3">
      <Inner blocks={blocks} />
    </div>
  );
}
