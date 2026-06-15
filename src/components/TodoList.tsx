"use client";

import { useEffect, useState } from "react";
import type { TodoItem } from "@/lib/types";

const STORAGE_KEY = "yoriqnoma_todo_done";

export default function TodoList({ items }: { items: TodoItem[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  // Brauzer xotirasidan o'qish (login talab qilinmaydi)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // e'tiborsiz
    }
    setLoaded(true);
  }, []);

  const toggle = (id: string) => {
    setDone((d) => {
      const next = { ...d, [id]: !d[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // e'tiborsiz
      }
      return next;
    });
  };

  const completed = items.filter((i) => done[i.id]).length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div>
      {/* Progress */}
      <div className="bg-card border rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">Bajarildi</span>
          <span className="text-muted">
            {loaded ? completed : 0} / {items.length}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-black/[0.06] overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${loaded ? pct : 0}%` }}
          />
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((item) => {
          const checked = !!done[item.id];
          return (
            <li
              key={item.id}
              className={`flex items-start gap-3 bg-card border rounded-xl p-4 transition ${
                checked ? "opacity-70" : ""
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className={`mt-0.5 h-6 w-6 shrink-0 rounded-md border flex items-center justify-center transition ${
                  checked
                    ? "bg-brand border-brand text-white"
                    : "border-border hover:border-brand"
                }`}
                aria-label="Belgilash"
              >
                {checked && "✓"}
              </button>
              <div className="min-w-0">
                <div
                  className={`font-medium ${
                    checked ? "line-through text-muted" : ""
                  }`}
                >
                  {item.title}
                </div>
                {item.description && (
                  <div className="text-sm text-muted mt-0.5">
                    {item.description}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-muted mt-4">
        Belgilashlar shu brauzerda saqlanadi.
      </p>
    </div>
  );
}
