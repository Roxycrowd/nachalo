"use client";

import { useEffect, useState } from "react";
import { ApiError, api } from "@/lib/api";
import type { HealthStatus } from "@/lib/types";

type Status =
  | { state: "loading" }
  | { state: "up"; database: "up" }
  | { state: "down"; detail: string };

export function BackendStatus() {
  const [status, setStatus] = useState<Status>({ state: "loading" });

  useEffect(() => {
    let active = true;
    api<HealthStatus>("/api/health")
      .then((health) => {
        if (active) setStatus({ state: "up", database: health.database });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const detail =
          error instanceof ApiError
            ? error.message
            : "Backend не отвечает";
        setStatus({ state: "down", detail });
      });
    return () => {
      active = false;
    };
  }, []);

  const label =
    status.state === "loading"
      ? "Проверяем соединение с backend…"
      : status.state === "up"
        ? "Frontend подключён к backend. База данных доступна."
        : `Нет соединения с backend: ${status.detail}`;

  return (
    <p className="mt-16 max-w-xl border-t border-line pt-6 text-sm text-muted">
      <span
        className={`mr-2 inline-block h-2 w-2 rounded-full ${
          status.state === "up" ? "bg-accent" : "bg-line"
        }`}
        aria-hidden
      />
      {label}
    </p>
  );
}
