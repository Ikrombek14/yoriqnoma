"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostEditCard from "@/components/PostEditCard";
import { reorderArticles } from "@/app/admin/actions";
import type { ArticleWithVideos } from "@/lib/data";

/**
 * Bo'lim ichidagi postlar (mavzular) ro'yxati — admin ↑/↓ tugmalari bilan
 * tartibini o'zgartirishi mumkin. Har bosishda darhol (optimistik) UI
 * yangilanadi, so'ng serverga yangi tartib saqlanadi.
 */
export default function PostList({
  articles,
}: {
  articles: ArticleWithVideos[];
}) {
  const router = useRouter();
  const [order, setOrder] = useState(articles);
  const [movingId, setMovingId] = useState<string | null>(null);

  const persist = async (next: ArticleWithVideos[], movedId: string) => {
    setOrder(next);
    setMovingId(movedId);
    const fd = new FormData();
    fd.set("ids", next.map((a) => a.id).join(","));
    try {
      await reorderArticles(fd);
      router.refresh();
    } finally {
      setMovingId(null);
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    const next = order.slice();
    [next[index], next[target]] = [next[target], next[index]];
    persist(next, next[target].id);
  };

  // Admin xohlagan raqamni yozib, postni to'g'ridan-to'g'ri o'sha o'ringa
  // (1-asosli) ko'chirishi mumkin — masalan 1-postni 4-o'ringa tushirish.
  const moveTo = (index: number, pos1Based: number) => {
    const target = Math.min(Math.max(Math.round(pos1Based), 1), order.length) - 1;
    if (target === index || Number.isNaN(target)) return;
    const next = order.slice();
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    persist(next, item.id);
  };

  return (
    <div className="space-y-5">
      {order.map((a, idx) => (
        <PostEditCard
          key={a.id}
          article={a}
          index={idx}
          total={order.length}
          canMoveUp={idx > 0}
          canMoveDown={idx < order.length - 1}
          moving={movingId === a.id}
          onMoveUp={() => move(idx, -1)}
          onMoveDown={() => move(idx, 1)}
          onMoveTo={(pos) => moveTo(idx, pos)}
        />
      ))}
    </div>
  );
}
