import { createFileRoute } from "@tanstack/react-router";
import { useLedger } from "@/lib/ledger";
import { AssetCard } from "@/components/AssetCard";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Assets — Hearth" },
      {
        name: "description",
        content: "All registered household appliances and vehicles with their AMC and warranty status.",
      },
      { property: "og:title", content: "Assets — Hearth" },
      {
        property: "og:description",
        content: "All registered household appliances and vehicles with their AMC and warranty status.",
      },
    ],
  }),
  component: AssetsPage,
});

function AssetsPage() {
  const { assets } = useLedger();

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">(b) Assets</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Registered assets
        </h1>
        <p className="mt-2 text-[15px] text-soft">{assets.length} assets under care</p>
      </div>

      <section className="rounded-2xl bg-card p-5 ring-1 ring-black/5 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset, i) => (
            <AssetCard key={asset.id} asset={asset} delay={i * 50} />
          ))}
        </div>
      </section>
    </main>
  );
}
