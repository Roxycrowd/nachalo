"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useSession } from "./session-provider";

const links = [
  { href: "/discover", label: "Обзор" },
  { href: "/vibe", label: "Вкус" },
  { href: "/profile", label: "Профиль" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useSession();

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  }

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-block h-2.5 w-2.5 bg-accent" aria-hidden />
          <span className="font-serif text-[1.7rem] leading-none tracking-tight">
            Vibe
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "text-foreground" : "text-muted hover:text-foreground"}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          {user ? (
            <button
              type="button"
              onClick={() => {
                void logout();
              }}
              className="text-muted hover:text-foreground"
            >
              Выйти
            </button>
          ) : user === null ? (
            <Link
              href="/login"
              className={
                pathname === "/login"
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              }
            >
              Войти
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
