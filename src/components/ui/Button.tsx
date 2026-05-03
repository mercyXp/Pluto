"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-pluto-blue text-white shadow-[0_14px_28px_rgba(10,132,255,0.18)] hover:bg-pluto-blueDark",
  secondary:
    "border border-pluto-line bg-white text-pluto-navy shadow-sm hover:bg-pluto-mist",
  ghost: "text-pluto-slate hover:bg-pluto-ice",
  danger: "bg-red-50 text-red-700 hover:bg-red-100"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 rounded-2xl px-4 text-sm",
  md: "h-12 rounded-[1.25rem] px-5 text-sm",
  lg: "h-14 rounded-[1.35rem] px-6 text-base",
  icon: "h-11 w-11 rounded-full p-0"
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
