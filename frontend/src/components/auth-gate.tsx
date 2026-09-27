"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSession } from "./session-provider";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user } = useSession();

  if (user === undefined) {
    return <p className="text-sm text-muted">Загружаем профиль…</p>;
  }

  if (user === null) {
    return (
      <p className="max-w-md text-lg leading-relaxed text-muted">
        Сначала{" "}
        <Link href="/login" className="text-foreground underline decoration-accent decoration-2 underline-offset-4">
          войди
        </Link>
        , чтобы продолжить.
      </p>
    );
  }

  return children;
}
