"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  variant = "primary",
  size = "md",
  confirm,
}: {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "ghost";
  size?: "sm" | "md";
  confirm?: string;
}) {
  const { pending } = useFormStatus();

  const base =
    "rounded-xl font-medium transition disabled:opacity-50 whitespace-nowrap";
  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-4 py-2.5 text-sm",
  };
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-600",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100",
    ghost: "bg-black/[0.04] text-foreground hover:bg-black/[0.08]",
  };

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={`${base} ${sizes[size]} ${variants[variant]}`}
    >
      {pending ? "..." : children}
    </button>
  );
}
