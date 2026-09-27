"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { IntegrationProviderSummary } from "@/lib/types";

export function DiscoverBoard() {
  const [providers, setProviders] = useState<IntegrationProviderSummary[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api<IntegrationProviderSummary[]>("/api/integrations/providers")
      .then((list) => {
        if (active) setProviders(list);
      })
      .catch(() => {
        if (active) setError("Список сервисов сейчас недоступен.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-2xl">
      <p className="text-lg leading-relaxed text-muted">
        Здесь появятся люди с похожим вкусом. Пока алгоритм поиска не подключён —
        страница показывает только источники, из которых Vibe будет его собирать.
      </p>
      {error ? <p className="mt-8 text-sm">{error}</p> : null}
      <ul className="mt-12 divide-y divide-line border-y border-line">
        {(providers ?? []).map((provider) => (
          <li
            key={provider.id}
            className="flex items-baseline justify-between gap-6 py-5"
          >
            <div>
              <p className="font-serif text-3xl">{provider.displayName}</p>
              <p className="mt-1 text-sm text-muted">
                {provider.categories.join(", ")}
              </p>
            </div>
            <span className="text-xs tracking-[0.16em] text-muted">СКОРО</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
