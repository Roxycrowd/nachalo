"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ConnectedAccount } from "@/lib/types";
import { AuthGate } from "./auth-gate";
import { useSession } from "./session-provider";

export function ProfileBoard() {
  return (
    <AuthGate>
      <ProfileDetails />
    </AuthGate>
  );
}

function ProfileDetails() {
  const { user } = useSession();
  const [accounts, setAccounts] = useState<ConnectedAccount[] | null>(null);

  useEffect(() => {
    let active = true;
    api<ConnectedAccount[]>("/api/integrations/accounts")
      .then((list) => {
        if (active) setAccounts(list);
      })
      .catch(() => {
        if (active) setAccounts([]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!user) return null;

  const facts = [user.city, user.age ? `${user.age}` : null].filter(Boolean);

  return (
    <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        <p className="text-sm text-muted">@{user.username}</p>
        <p className="mt-3 text-5xl font-medium leading-none tracking-tight">
          {user.name || user.username}
        </p>
        {facts.length > 0 ? (
          <p className="mt-4 text-sm text-muted">{facts.join(" · ")}</p>
        ) : null}
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
          {user.bio || "Короткое описание вкуса ещё не заполнено."}
        </p>
        <Link
          href="/onboarding"
          className="mt-8 inline-flex text-sm underline decoration-accent decoration-2 underline-offset-4"
        >
          Редактировать профиль
        </Link>
      </section>
      <section>
        <h2 className="text-sm tracking-[0.16em] text-muted">СЕРВИСЫ</h2>
        {accounts === null ? (
          <p className="mt-6 text-sm text-muted">Загружаем подключения…</p>
        ) : accounts.length === 0 ? (
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            Подключённых сервисов нет. Токены внешних аккаунтов остаются на
            backend и не показываются здесь.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {accounts.map((account) => (
              <li key={account.id} className="py-4">
                <p>{account.provider}</p>
                <p className="mt-1 text-sm text-muted">{account.providerUserId}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
