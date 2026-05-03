import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { formatSol } from "@/lib/utils/format";
import type { Activity } from "@/types";

export function ActivityList({
  activities,
  onActivityClick,
  onViewAll
}: {
  activities: Activity[];
  onActivityClick?: (activity: Activity) => void;
  onViewAll?: () => void;
}) {
  return (
    <section className="space-y-3">
      <SectionHeader
        title="Recent activity"
        action={
          onViewAll ? (
            <button onClick={onViewAll} className="text-sm font-semibold text-pluto-blue">
              View all
            </button>
          ) : undefined
        }
      />
      <Card className="space-y-1 p-2">
        {activities.map((activity) => {
          const isReceive = activity.amountSol > 0;
          return (
            <button
              type="button"
              key={activity.id}
              onClick={() => onActivityClick?.(activity)}
              className="flex w-full items-center gap-3 rounded-[1.1rem] px-3 py-3 text-left transition hover:bg-pluto-mist"
            >
              <div
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full",
                  isReceive ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-pluto-blue"
                )}
              >
                {isReceive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-pluto-navy">{activity.title}</p>
                <p className="text-xs text-pluto-slate">{activity.timestamp}</p>
              </div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isReceive ? "text-emerald-600" : "text-pluto-navy"
                )}
              >
                {isReceive ? "+" : ""}
                {formatSol(activity.amountSol)}
              </p>
            </button>
          );
        })}
      </Card>
    </section>
  );
}
