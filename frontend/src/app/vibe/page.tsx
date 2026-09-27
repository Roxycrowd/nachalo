import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { VibeBoard } from "@/components/vibe-board";

export const metadata: Metadata = { title: "Вкус" };

export default function VibePage() {
  return (
    <PageShell
      eyebrow="ПРОФИЛЬ ВКУСА"
      title="Твой Vibe."
      description="Музыка, аниме и игры живут в одном профиле. Разные источники одной категории могут существовать рядом."
    >
      <VibeBoard />
    </PageShell>
  );
}
