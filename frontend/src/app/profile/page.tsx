import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ProfileBoard } from "@/components/profile-board";

export const metadata: Metadata = { title: "Профиль" };

export default function ProfilePage() {
  return (
    <PageShell eyebrow="ТЫ" title="Профиль.">
      <ProfileBoard />
    </PageShell>
  );
}
