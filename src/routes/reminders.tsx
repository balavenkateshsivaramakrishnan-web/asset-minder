import { createFileRoute, Link } from "@tanstack/react-router";
import { formatINR, useLedger } from "@/lib/ledger";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders — Hearth" },
      {
        name: "description",
        content: "Upcoming services, AMC renewals, insurance, and warranty expiries across all assets.",
      },
      { property: "og:title", content: "Reminders — Hearth" },
      {
        property: "og:description",
        content: "Upcoming services, AMC renewals, insurance, and warranty expiries across all assets.",
      },
    ],
  }),
  component: RemindersPage,
});

const urgencyDot: Record<string, string> = {
  urgent: "bg-peach",
  soon: "bg-amber",
  later: "bg-ink",
  ok: "bg-teal",
};

const urgencyChip: Record<string, string> = {
  urgent: "bg-peach text-card",
  soon: "bg-amber text-ink",
  later: "bg-ink text-card",
  ok: "bg-teal text-card",
};

const urgencyLabel: Record<string, string> = {
  urgent: "Act now",
  soon: "Due soon",
  later: "This quarter",
  ok: "On track",
};

function RemindersPage() {
  const { reminders } = useLedger();
  const order = { urgent: 0, soon: 1, later: 2, ok: 3 } as const;
  const sorted = [...reminders].sort((a, b) => order[a.urgency] - order[b.urgency]);

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">
          (c) Reminders
        </p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Full timeline
        </h1>
        <p className="mt-2 text-[15px] text-soft">
          Every upcoming service, renewal, and expiry — sorted by urgency.
        </p>
      </div>

      <section className="rounded-2xl bg-card p-5 ring-1 ring-black/5 sm:p-6">
        <div className="space-y-1">
          {sorted.map((r, i) => (
            <div
              key={r.id}
              className="animate-rise flex items-center gap-4 rounded-xl px-3 py-4 transition-colors hover:bg-paper"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  urgencyDot[r.urgency],
                  r.urgency === "urgent" && "animate-ring",
                )}
              />
              <div className="w-24 shrink-0">
                <p className="text-[13px] font-bold">{r.date}</p>
                <p className="text-[11px] text-soft">{r.relative}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold">
                  {r.assetName} — {r.label}
                </p>
                <p className="text-[12px] text-soft">{r.vendor}</p>
              </div>
              <span
                className={cn(
                  "hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold sm:inline-block",
                  urgencyChip[r.urgency],
                )}
              >
                {urgencyLabel[r.urgency]}
              </span>
              <p className="shrink-0 font-mono text-[13px]">{formatINR(r.cost)}</p>
              <Link
                to="/assets/$assetId"
                params={{ assetId: r.assetId }}
                className="shrink-0 text-[12px] font-bold text-peach"
              >
                Open
              </Link>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-6 text-center font-mono text-[11px] text-soft">
        Notifications arrive 30, 7, and 1 day before each date once reminders are enabled.
      </p>
    </main>
  );
}
