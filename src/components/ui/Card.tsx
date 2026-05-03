import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-pluto-line/80 bg-white p-5 shadow-[0_18px_44px_rgba(7,26,51,0.06)]",
        className
      )}
      {...props}
    />
  );
}
