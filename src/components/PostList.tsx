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

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= order.length) return;

    const next = order.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setMovingId(next[target].id);

    const fd = new FormData();
    fd.set("ids", next.map((a) => a.id).join(","));
    try {
      await reorderArticles(fd);
      router.refresh();
    } finally {
      setMovingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {order.map((a, idx) => (
        <PostEditCard
          key={a.id}
          article={a}
          index={idx}
          canMoveUp={idx > 0}
          canMoveDown={idx < order.length - 1}
          moving={movingId === a.id}
          onMoveUp={() => move(idx, -1)}
          onMoveDown={() => move(idx, 1)}
        />
      ))}
    </div>
  );
}
