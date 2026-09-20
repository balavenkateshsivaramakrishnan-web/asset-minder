import { Link } from "@tanstack/react-router";
import type { Asset } from "@/lib/ledger";
import { StatusChip, iconBg, progressColor } from "@/components/StatusChip";
import { cn } from "@/lib/utils";

export function AssetCard({ asset, delay = 0 }: { asset: Asset; delay?: number }) {
  return (
    <Link
      to="/assets/$assetId"
      params={{ assetId: asset.id }}
      className="animate-rise block rounded-xl border border-line p-4 transition-colors hover:border-ink/25"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={cn("grid size-10 place-items-center rounded-lg text-lg", iconBg(asset.status))}>
            {asset.emoji}
          </div>
          <div>
            <p className="font-bold tracking-tight">{asset.name}</p>
            <p className="text-[12px] text-soft">{asset.detail}</p>
          </div>
        </div>
        <StatusChip status={asset.status} label={asset.statusLabel} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[12px] text-soft">
          {asset.nextLabel} <span className="font-semibold text-ink">{asset.nextDate}</span>
        </p>
        <p className="font-mono text-[12px] text-soft">{asset.costLabel}</p>
      </div>
      <div className="mt-3">
        <div className="h-1.5 rounded-full bg-line">
          <div
            className={cn("h-1.5 rounded-full", progressColor(asset.status))}
            style={{ width: `${Math.round(asset.progress * 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
