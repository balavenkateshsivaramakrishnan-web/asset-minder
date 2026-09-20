import { Link } from "@tanstack/react-router";
import type { Asset } from "@/lib/ledger";
import { StatusChip, iconBg, progressColor } from "@/components/StatusChip";
import { AssetIcon } from "@/components/AssetIcon";
import { cn } from "@/lib/utils";
...
          <div className={cn("grid size-10 place-items-center rounded-lg", iconBg(asset.status))}>
            <AssetIcon name={asset.icon} className="size-5 text-ink/70" />
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
