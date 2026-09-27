import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Вход" };

export default function LoginPage() {
  return (
    <PageShell
      eyebrow="АККАУНТ"
      title="Войти в Vibe."
      description="Регистрация создаёт профиль. Подключение Spotify, AniList и Steam будет отдельным шагом на backend."
    >
      <LoginForm />
    </PageShell>
  );
}
