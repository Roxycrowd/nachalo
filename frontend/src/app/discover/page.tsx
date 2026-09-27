import type { Metadata } from "next";
import { DiscoverBoard } from "@/components/discover-board";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Обзор" };

export default function DiscoverPage() {
  return (
    <PageShell
      eyebrow="ЛЮДИ"
      title="Похожий вкус."
      description="Vibe ищет людей по интересам, а не по свайпам."
    >
      <DiscoverBoard />
    </PageShell>
  );
}
