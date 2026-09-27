"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiError, api } from "@/lib/api";
import type { SessionUser } from "@/lib/types";
import { useSession } from "./session-provider";
import { Button, FormError, TextField } from "./ui";

type Mode = "login" | "register";

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useSession();
  const [mode, setMode] = useState<Mode>("register");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const payload =
      mode === "register"
        ? {
            email,
            password,
            username: String(form.get("username") ?? ""),
            name: String(form.get("name") ?? ""),
          }
        : { email, password };

    setPending(true);
    setError(null);
    try {
      const user = await api<SessionUser>(
        mode === "register" ? "/api/auth/register" : "/api/auth/login",
        { method: "POST", body: JSON.stringify(payload) },
      );
      setUser(user);
      router.push(mode === "register" ? "/onboarding" : "/vibe");
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "Не удалось выполнить запрос",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="max-w-md">
      <div className="mb-8 flex gap-6 text-sm">
        <button
          type="button"
          onClick={() => setMode("register")}
          className={mode === "register" ? "text-foreground" : "text-muted"}
        >
          Регистрация
        </button>
        <button
          type="button"
          onClick={() => setMode("login")}
          className={mode === "login" ? "text-foreground" : "text-muted"}
        >
          Вход
        </button>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        {mode === "register" ? (
          <>
            <TextField
              label="Имя пользователя"
              name="username"
              autoComplete="username"
              minLength={3}
              maxLength={24}
              pattern="[A-Za-z0-9_]+"
              required
            />
            <TextField label="Имя" name="name" autoComplete="name" maxLength={80} />
          </>
        ) : null}
        <TextField
          label="Пароль"
          name="password"
          type="password"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          minLength={8}
          maxLength={72}
          required
        />
        <FormError message={error} />
        <Button type="submit" disabled={pending}>
          {pending ? "Секунду…" : mode === "register" ? "Создать профиль" : "Войти"}
        </Button>
      </form>
    </div>
  );
}
