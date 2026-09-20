import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { formatINR, useLedger } from "@/lib/ledger";
import { StatusChip, iconBg, progressColor } from "@/components/StatusChip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assets/$assetId")({
  component: AssetDetailPage,
  notFoundComponent: AssetMissing,
  head: () => ({
    meta: [
      { title: "Asset detail — Hearth" },
      { name: "description", content: "Warranty, AMC contract, service history, and expenses for one asset." },
      { property: "og:title", content: "Asset detail — Hearth" },
      { property: "og:description", content: "Warranty, AMC contract, service history, and expenses for one asset." },
    ],
  }),
});

function AssetMissing() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20 text-center">
      <h1 className="text-2xl font-extrabold tracking-tight">Asset not found</h1>
      <p className="mt-2 text-soft">This asset may have been removed from your ledger.</p>
      <Link
        to="/assets"
        className="mt-6 inline-flex rounded-full bg-peach px-4 py-2 text-[13px] font-bold text-card transition-colors hover:bg-ink"
      >
        Back to assets
      </Link>
    </main>
  );
}

function AssetDetailPage() {
  const { assetId } = Route.useParams();
  const { assets } = useLedger();
  const asset = assets.find((a) => a.id === assetId);

  if (!asset) throw notFound();

  const total = asset.history.reduce((s, h) => s + h.cost, 0);

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
      <Link
        to="/assets"
        className="text-[13px] font-semibold text-soft transition-colors hover:text-ink"
      >
        ← All assets
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn("grid size-14 place-items-center rounded-2xl text-2xl", iconBg(asset.status))}>
            {asset.emoji}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{asset.name}</h1>
            <p className="mt-1 text-[15px] text-soft">{asset.detail}</p>
          </div>
        </div>
        <StatusChip status={asset.status} label={asset.statusLabel} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          {/* Contract summary */}
          <section className="rounded-2xl bg-card p-5 ring-1 ring-black/5 sm:p-6">
            <h2 className="text-lg font-extrabold tracking-tight">Contract &amp; coverage</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-line p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-soft">Warranty</p>
                <p className="mt-1 font-bold">{asset.warranty}</p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-soft">AMC</p>
                <p className="mt-1 font-bold">{asset.amc}</p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-soft">Provider</p>
                <p className="mt-1 font-bold">{asset.provider}</p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-soft">
                  {asset.nextLabel}
                </p>
                <p className="mt-1 font-bold">{asset.nextDate}</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="mb-1.5 flex justify-between text-[12px] text-soft">
                <span>Time to next due date</span>
                <span className="font-mono">{Math.round(asset.progress * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-line">
                <div
                  className={cn("h-1.5 rounded-full", progressColor(asset.status))}
                  style={{ width: `${Math.round(asset.progress * 100)}%` }}
                />
              </div>
            </div>
          </section>

          {/* Service history */}
          <section className="rounded-2xl bg-card p-5 ring-1 ring-black/5 sm:p-6">
            <h2 className="text-lg font-extrabold tracking-tight">Service history</h2>
            {asset.history.length === 0 ? (
              <p className="mt-4 text-[13px] text-soft">
                No services logged yet. Use “Log service” above to record the first visit.
              </p>
            ) : (
              <div className="mt-2 divide-y divide-line">
                {asset.history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[14px] font-semibold">{h.label}</p>
                      <p className="text-[12px] text-soft">{h.date}</p>
                    </div>
                    <p className="font-mono text-[13px]">{formatINR(h.cost)}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-5 lg:col-span-5">
          <section className="rounded-2xl bg-ink p-5 text-paper">
            <h2 className="text-lg font-extrabold tracking-tight">Spend on this asset</h2>
            <p className="mt-3 font-mono text-4xl tracking-tight">{formatINR(total)}</p>
            <p className="mt-1 text-[12px] text-paper/60">
              across {asset.history.length} logged {asset.history.length === 1 ? "service" : "services"}
            </p>
            <div className="mt-4 border-t border-paper/15 pt-4">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-paper/50">
                Documents
              </p>
              <p className="text-[12px] text-paper/80">
                Invoice and warranty uploads will live here — attach bills after each service so
                nothing gets lost.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
