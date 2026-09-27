import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-6 pb-24 pt-16 md:pt-20">
      {eyebrow ? (
        <p className="text-xs font-medium tracking-[0.22em] text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-4 max-w-3xl font-sans text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-12">{children}</div> : null}
    </div>
  );
}
