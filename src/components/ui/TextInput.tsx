import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-[3.25rem] w-full rounded-[1.35rem] border border-pluto-line bg-white px-4 text-[15px] text-pluto-navy outline-none transition placeholder:text-pluto-slate/65 focus:border-pluto-blue focus:ring-4 focus:ring-blue-100",
        className
      )}
      {...props}
    />
  );
}

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full resize-none rounded-[1.35rem] border border-pluto-line bg-white p-4 text-[15px] text-pluto-navy outline-none transition placeholder:text-pluto-slate/65 focus:border-pluto-blue focus:ring-4 focus:ring-blue-100",
        className
      )}
      {...props}
    />
  );
}
