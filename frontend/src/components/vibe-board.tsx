"use client";

import { useEffect, useState } from "react";
import { ApiError, api } from "@/lib/api";
import type { VibeItem } from "@/lib/types";
import { AuthGate } from "./auth-gate";

const categories = [
  { id: "music", title: "Music", note: "Треки, артисты и плейлисты." },
  { id: "anime", title: "Anime", note: "Тайтлы и списки просмотра." },
  { id: "games", title: "Games", note: "Игры и время в них." },
];

export function VibeBoard() {
  return (
    <AuthGate>
      <VibeList />
    </AuthGate>
  );
}

function VibeList() {
  const [items, setItems] = useState<VibeItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api<{ items: VibeItem[] }>("/api/vibe/me")
      .then((result) => {
        if (active) setItems(result.items);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(
          caught instanceof ApiError ? caught.message : "Не удалось загрузить вкус",
        );
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) return <p className="text-sm">{error}</p>;
  if (!items) return <p className="text-sm text-muted">Собираем профиль вкуса…</p>;

  const known = new Set(categories.map((category) => category.id));
  const extra = [...new Set(items.map((item) => item.category))].filter(
    (category) => !known.has(category),
  );

  return (
    <div className="space-y-14">
      {categories.map((category) => (
        <CategorySection
          key={category.id}
          title={category.title}
          note={category.note}
          items={items.filter((item) => item.category === category.id)}
        />
      ))}
      {extra.map((category) => (
        <CategorySection
          key={category}
          title={category}
          note="Источник добавлен расширением схемы."
          items={items.filter((item) => item.category === category)}
        />
      ))}
    </div>
  );
}

function CategorySection({
  title,
  note,
  items,
}: {
  title: string;
  note: string;
  items: VibeItem[];
}) {
  return (
    <section className="border-t border-line pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-serif text-4xl">{title}</h2>
        <p className="text-sm text-muted">{note}</p>
      </div>
      {items.length === 0 ? (
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted">
          Пока пусто. Элементы появятся после подключения сервиса — вручную их
          добавлять не нужно.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex items-baseline justify-between gap-6 py-4">
              <div>
                <p>{item.name}</p>
                <p className="mt-1 text-xs tracking-[0.14em] text-muted">
                  {item.source}
                </p>
              </div>
              {item.weight !== null ? (
                <span className="text-sm text-muted">{item.weight.toFixed(2)}</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
