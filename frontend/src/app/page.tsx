import Link from "next/link";
import { BackendStatus } from "@/components/backend-status";

const lanes = [
  {
    title: "Music",
    text: "То, что ты слушаешь, уже описывает вкус точнее любой анкеты.",
  },
  {
    title: "Anime",
    text: "Списки и оценки можно будет забрать из AniList.",
  },
  {
    title: "Games",
    text: "Библиотека Steam станет частью того же профиля.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-6 pb-24 pt-16 md:pt-24">
      <p className="flex items-center gap-3 text-xs font-medium tracking-[0.22em] text-muted">
        <span className="inline-block h-2 w-8 bg-accent" aria-hidden />
        VIBE
      </p>
      <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.95] tracking-tight sm:text-7xl">
        People who share
        <span className="italic"> your taste.</span>
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
        Не заполняй длинный список интересов. Подключи сервисы, которыми уже
        пользуешься — Vibe соберёт профиль вкуса и поможет найти людей, которым
        близко то же самое.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-white"
        >
          Начать
        </Link>
        <Link
          href="/discover"
          className="inline-flex h-12 items-center justify-center rounded-full border border-line px-5 text-sm font-medium"
        >
          Смотреть обзор
        </Link>
      </div>
      <dl className="mt-24 grid gap-12 border-t border-line pt-12 sm:grid-cols-3">
        {lanes.map((lane) => (
          <div key={lane.title}>
            <dt className="font-serif text-4xl">{lane.title}</dt>
            <dd className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {lane.text}
            </dd>
          </div>
        ))}
      </dl>
      <BackendStatus />
    </div>
  );
}
