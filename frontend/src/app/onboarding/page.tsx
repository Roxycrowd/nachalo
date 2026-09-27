import type { Metadata } from "next";
import { OnboardingForm } from "@/components/onboarding-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Знакомство" };

export default function OnboardingPage() {
  return (
    <PageShell
      eyebrow="ПРОФИЛЬ"
      title="Немного о тебе."
      description="Этого достаточно, чтобы начать. Вкус подтянется из сервисов, а не из длинной анкеты."
    >
      <OnboardingForm />
    </PageShell>
  );
}
