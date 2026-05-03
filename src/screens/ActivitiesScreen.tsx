"use client";

import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { TextInput } from "@/components/ui/TextInput";
import { cn } from "@/lib/utils/cn";
import { formatSol } from "@/lib/utils/format";
import type { Activity } from "@/types";

export function ActivitiesScreen({
  activities,
  onBack,
  onSelectActivity
}: {
  activities: Activity[];
  onBack: () => void;
  onSelectActivity: (activity: Activity) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = activities.filter((activity) =>
    `${activity.title} ${activity.contactName} ${activity.memo || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <main className="min-h-[100dvh] bg-pluto-mist px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">Activity</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pluto-slate" />
          <TextInput
            className="pl-11"
            placeholder="Search activity"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filtered.map((activity) => {
            const isReceive = activity.amountSol > 0;
            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => onSelectActivity(activity)}
                className="block w-full text-left"
              >
                <Card className="flex items-center gap-3 p-4 shadow-sm transition hover:border-pluto-blue/35">
                  <div
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-full",
                      isReceive ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-pluto-blue"
                    )}
                  >
                    {isReceive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-pluto-navy">{activity.title}</p>
                    <p className="mt-0.5 text-xs text-pluto-slate">{activity.timestamp}</p>
                    {activity.memo ? <p className="mt-1 truncate text-xs text-pluto-slate">For {activity.memo}</p> : null}
                  </div>
                  <p className={cn("text-sm font-semibold", isReceive ? "text-emerald-600" : "text-pluto-navy")}>
                    {isReceive ? "+" : ""}
                    {formatSol(activity.amountSol)}
                  </p>
                </Card>
              </button>
            );
          })}
        </div>

        {!filtered.length ? (
          <Card className="mt-2 bg-white/75 text-center shadow-none">
            <p className="text-sm font-semibold text-pluto-navy">No activity found</p>
            <p className="mt-1 text-sm text-pluto-slate">Receipts will appear here after you send or receive SOL.</p>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
