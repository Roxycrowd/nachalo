"use client";

import { useState, type FormEvent } from "react";
import { ApiError, api } from "@/lib/api";
import type { SessionUser } from "@/lib/types";
import { AuthGate } from "./auth-gate";
import { useSession } from "./session-provider";
import { Button, FormError, TextAreaField, TextField } from "./ui";

const steps = [
  { id: "01", title: "О тебе", text: "Имя, город и короткая биография." },
  { id: "02", title: "Сервисы", text: "Spotify, AniList и Steam подключим следующим этапом." },
  { id: "03", title: "Vibe", text: "Профиль вкуса соберётся из данных сервисов." },
];

export function OnboardingForm() {
  return (
    <AuthGate>
      <OnboardingFields />
    </AuthGate>
  );
}

function OnboardingFields() {
  const { user, setUser } = useSession();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!user) return null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ageValue = String(form.get("age") ?? "").trim();
    const avatar = String(form.get("avatar") ?? "").trim();
    const payload = {
      name: String(form.get("name") ?? ""),
      city: String(form.get("city") ?? ""),
      bio: String(form.get("bio") ?? ""),
      age: ageValue ? Number(ageValue) : null,
      avatar: avatar || null,
    };

    setPending(true);
    setError(null);
    setMessage(null);
    try {
      setUser(
        await api<SessionUser>("/api/users/me", {
          method: "PATCH",
          body: JSON.stringify(payload),
        }),
      );
      setMessage("Профиль сохранён.");
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "Не удалось сохранить профиль",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
      <ol className="space-y-8">
        {steps.map((step) => (
          <li key={step.id}>
            <p className="font-serif text-3xl">{step.id}</p>
            <p className="mt-2 text-base">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
      <form className="space-y-5" onSubmit={onSubmit}>
        <TextField
          label="Имя"
          name="name"
          defaultValue={user.name ?? ""}
          maxLength={80}
        />
        <TextField
          label="Возраст"
          name="age"
          type="number"
          min={13}
          max={120}
          defaultValue={user.age ?? ""}
        />
        <TextField
          label="Город"
          name="city"
          defaultValue={user.city ?? ""}
          maxLength={80}
        />
        <TextField
          label="Аватар, ссылка"
          name="avatar"
          type="url"
          placeholder="https://"
          defaultValue={user.avatar ?? ""}
        />
        <TextAreaField
          label="Коротко о вкусе"
          name="bio"
          maxLength={500}
          defaultValue={user.bio ?? ""}
        />
        <FormError message={error} />
        {message ? <p className="text-sm">{message}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Сохраняем…" : "Сохранить"}
        </Button>
      </form>
    </div>
  );
}
