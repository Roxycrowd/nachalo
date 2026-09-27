import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

const fieldClass =
  "w-full rounded-lg border border-line bg-white px-3 py-3 text-base text-foreground outline-none transition placeholder:text-muted/70 focus:border-foreground";

export function TextField({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-muted">{label}</span>
      <input className={fieldClass} {...props} />
    </label>
  );
}

export function TextAreaField({
  label,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-muted">{label}</span>
      <textarea className={`${fieldClass} min-h-32 resize-y`} {...props} />
    </label>
  );
}

export function Button({
  children,
  variant = "solid",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles =
    variant === "solid"
      ? "bg-foreground text-white hover:bg-black"
      : "border border-line bg-white text-foreground hover:border-foreground";

  return (
    <button
      className={`inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-foreground">
      {message}
    </p>
  );
}
