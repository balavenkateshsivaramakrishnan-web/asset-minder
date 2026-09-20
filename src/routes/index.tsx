import { createFileRoute, Link } from "@tanstack/react-router";
import { allExpenses, formatINR, totalSpent, useLedger } from "@/lib/ledger";
import { AssetCard } from "@/components/AssetCard";
import { iconBg } from "@/components/StatusChip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hearth — AMC & warranty ledger" },
      {
        name: "description",
        content:
          "Track household assets, AMC contracts, warranties, service history, and expenses in one calm place.",
      },
      { property: "og:title", content: "Hearth — AMC & warranty ledger" },
      {
        property: "og:description",
        content: "Never miss a service, renewal, or warranty expiry for your home and vehicles.",
      },
    ],
  }),
  component: Dashboard,
});

const urgencyDot: Record<string, string> = {
  urgent: "bg-peach",
  soon: "bg-amber",
  later: "bg-ink",
  ok: "bg-teal",
};

function Dashboard() {
  const ledger = useLedger();
  const { assets, reminders } = ledger;
  const needsAttention = assets.filter((a) => a.status !== "healthy");
  const upcoming = [...reminders].sort((a, b) => {
    const order = { urgent: 0, soon: 1, later: 2, ok: 3 } as const;
    return order[a.urgency] - order[b.urgency];
  });
  const expenses = allExpenses(ledger).slice(0, 3);
  const featured = assets.find((a) => a.id === "split-ac") ?? assets[0];
  const featuredTotal = featured?.history.reduce((s, h) => s + h.cost, 0) ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">
            (a) Dashboard
          </p>
          <h1 className="mt-1 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Good evening, Bala
          </h1>
          <p className="mt-2 text-[15px] text-soft">
            {needsAttention.length} assets need attention · {assets.length - needsAttention.length} in
            good standing
          </p>
        </div>
        <p className="font-mono text-[12px] text-soft">Sun, 20 Sep 2026</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="animate-rise rounded-2xl bg-card p-4 ring-1 ring-black/5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-soft">This month</p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight">₹12,480</p>
              <p className="mt-0.5 text-[11px] font-semibold text-teal">▼ 8% vs last mo</p>
            </div>
            <div
              className="animate-rise rounded-2xl bg-card p-4 ring-1 ring-black/5"
              style={{ animationDelay: "60ms" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-soft">Assets</p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight">{assets.length}</p>
              <p className="mt-0.5 text-[11px] text-soft">{needsAttention.length} need attention</p>
            </div>
            <div
              className="animate-rise rounded-2xl bg-card p-4 ring-1 ring-black/5"
              style={{ animationDelay: "120ms" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-soft">
                Expiring ≤30d
              </p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-peach">
                {needsAttention.length}
              </p>
              <p className="mt-0.5 text-[11px] text-soft">AMC &amp; warranties</p>
            </div>
            <div
              className="animate-rise rounded-2xl bg-card p-4 ring-1 ring-black/5"
              style={{ animationDelay: "180ms" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-soft">Total spend</p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight">
                {formatINR(totalSpent(ledger))}
              </p>
              <p className="mt-0.5 text-[11px] text-soft">all assets</p>
            </div>
          </div>

          {/* Assets */}
          <section className="rounded-2xl bg-card p-5 ring-1 ring-black/5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold tracking-tight">Registered assets</h2>
              <Link
                to="/assets"
                className="text-[13px] font-semibold text-soft transition-colors hover:text-ink"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {assets.slice(0, 4).map((asset, i) => (
                <AssetCard key={asset.id} asset={asset} delay={i * 60} />
              ))}
            </div>
          </section>

          {/* Upcoming services */}
          <section className="rounded-2xl bg-card p-5 ring-1 ring-black/5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold tracking-tight">Upcoming services</h2>
              <Link
                to="/reminders"
                className="text-[13px] font-semibold text-soft transition-colors hover:text-ink"
              >
                Full timeline
              </Link>
            </div>
            <div className="space-y-1">
              {upcoming.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-paper"
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
                  <p className="shrink-0 font-mono text-[13px]">{formatINR(r.cost)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:col-span-4">
          {/* Needs attention */}
          <section className="rounded-2xl bg-card p-5 ring-1 ring-black/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold tracking-tight">Needs attention</h2>
              <span className="rounded-full bg-peach px-2 py-0.5 text-[11px] font-bold text-card">
                {needsAttention.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {needsAttention.slice(0, 3).map((a, i) => (
                <div
                  key={a.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl p-3",
                    i === 0 && a.status === "overdue" ? "bg-peach/8" : "border border-line",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      a.status === "overdue"
                        ? "animate-ring bg-peach"
                        : a.status === "due"
                          ? "bg-peach"
                          : "bg-amber",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">
                      {a.name} — {a.statusLabel.toLowerCase()}
                    </p>
                    <p className="text-[11px] text-soft">
                      {a.nextLabel} {a.nextDate}
                    </p>
                  </div>
                  <Link
                    to="/assets/$assetId"
                    params={{ assetId: a.id }}
                    className={cn(
                      "shrink-0 text-[12px] font-bold",
                      a.status === "overdue" ? "text-peach" : "text-ink",
                    )}
                  >
                    {a.status === "overdue" ? "Book" : "Renew"}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Recent expenses */}
          <section className="rounded-2xl bg-card p-5 ring-1 ring-black/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold tracking-tight">Recent expense</h2>
              <span className="font-mono text-[11px] text-soft">
                {expenses[0] ? formatINR(expenses[0].cost) : "—"}
              </span>
            </div>
            <div className="space-y-2.5">
              {expenses.map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "grid size-8 place-items-center rounded-lg text-sm",
                      iconBg(
                        assets.find((a) => a.id === e.assetId)?.status ?? "healthy",
                      ),
                    )}
                  >
                    {e.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">
                      {e.assetName} — {e.label}
                    </p>
                    <p className="text-[11px] text-soft">{e.date}</p>
                  </div>
                  <p className="shrink-0 font-mono text-[13px]">{formatINR(e.cost)}</p>
                </div>
              ))}
            </div>
            <Link
              to="/reports"
              className="mt-4 block w-full rounded-xl border border-line py-2.5 text-center text-[13px] font-semibold text-soft transition-colors hover:border-ink/25 hover:text-ink"
            >
              View all expenses
            </Link>
          </section>

          {/* Featured asset detail */}
          {featured && (
            <section className="rounded-2xl bg-ink p-5 text-paper">
              <h2 className="text-balance text-lg font-extrabold tracking-tight">
                {featured.name} · detail
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-paper/60">Warranty</span>
                  <span className="font-semibold">{featured.warranty}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-paper/60">AMC contract</span>
                  <span className="font-semibold text-peach">{featured.amc}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-paper/60">Total spent</span>
                  <span className="font-mono">{formatINR(featuredTotal)}</span>
                </div>
              </div>
              <div className="mt-4 border-t border-paper/15 pt-4">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-paper/50">
                  History
                </p>
                <div className="space-y-2">
                  {featured.history.slice(0, 2).map((h) => (
                    <p key={h.id} className="text-[12px] text-paper/80">
                      {h.date} · {h.label}{" "}
                      <span className="font-mono text-paper/60">{formatINR(h.cost)}</span>
                    </p>
                  ))}
                </div>
              </div>
              <Link
                to="/assets/$assetId"
                params={{ assetId: featured.id }}
                className="mt-4 block w-full rounded-xl bg-paper py-2.5 text-center text-[13px] font-bold text-ink transition-colors hover:bg-card"
              >
                Open asset
              </Link>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
