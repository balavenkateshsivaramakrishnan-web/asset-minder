import { createFileRoute, Link } from "@tanstack/react-router";
import { allExpenses, formatINR, totalSpent, useLedger } from "@/lib/ledger";
import { iconBg } from "@/components/StatusChip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Hearth" },
      {
        name: "description",
        content: "Household maintenance spend per asset with the full expense ledger.",
      },
      { property: "og:title", content: "Reports — Hearth" },
      {
        property: "og:description",
        content: "Household maintenance spend per asset with the full expense ledger.",
      },
    ],
  }),
  component: ReportsPage,
});

const barColors = ["bg-peach", "bg-teal", "bg-amber", "bg-ink", "bg-soft"];

function ReportsPage() {
  const ledger = useLedger();
  const expenses = allExpenses(ledger);
  const total = totalSpent(ledger);

  const byAsset = ledger.assets
    .map((a) => ({
      asset: a,
      spent: a.history.reduce((s, h) => s + h.cost, 0),
    }))
    .filter((x) => x.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  const max = byAsset[0]?.spent ?? 1;

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">(d) Reports</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Household spend
        </h1>
        <p className="mt-2 text-[15px] text-soft">
          {formatINR(total)} across {expenses.length} logged expenses
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <section className="rounded-2xl bg-card p-5 ring-1 ring-black/5 sm:p-6 lg:col-span-5">
          <h2 className="text-lg font-extrabold tracking-tight">Spend per asset</h2>
          <div className="mt-6 space-y-4">
            {byAsset.map((x, i) => (
              <div key={x.asset.id}>
                <div className="mb-1.5 flex justify-between text-[12px]">
                  <span className="font-semibold">
                    {x.asset.emoji} {x.asset.name}
                  </span>
                  <span className="font-mono text-soft">{formatINR(x.spent)}</span>
                </div>
                <div className="h-2 rounded-full bg-line">
                  <div
                    className={cn("h-2 rounded-full", barColors[i % barColors.length])}
                    style={{ width: `${Math.round((x.spent / max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {byAsset.length === 0 && (
              <p className="text-[13px] text-soft">Log a service to see spending here.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-card p-5 ring-1 ring-black/5 sm:p-6 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight">Expense ledger</h2>
            <span className="font-mono text-[11px] text-soft">{formatINR(total)}</span>
          </div>
          <div className="space-y-2.5">
            {expenses.map((e, i) => (
              <div
                key={e.id}
                className="animate-rise flex items-center gap-3"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div
                  className={cn(
                    "grid size-8 place-items-center rounded-lg text-sm",
                    iconBg(
                      ledger.assets.find((a) => a.id === e.assetId)?.status ?? "healthy",
                    ),
                  )}
                >
                  {e.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">
                    <Link
                      to="/assets/$assetId"
                      params={{ assetId: e.assetId }}
                      className="hover:underline"
                    >
                      {e.assetName}
                    </Link>{" "}
                    — {e.label}
                  </p>
                  <p className="text-[11px] text-soft">{e.date}</p>
                </div>
                <p className="shrink-0 font-mono text-[13px]">{formatINR(e.cost)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
