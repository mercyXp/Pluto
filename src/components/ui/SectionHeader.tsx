import type { ReactNode } from "react";

export function SectionHeader({
  title,
  action
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[15px] font-semibold text-pluto-navy">{title}</h2>
      {action}
    </div>
  );
}
