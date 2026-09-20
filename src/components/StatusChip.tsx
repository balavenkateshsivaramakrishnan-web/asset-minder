import type { AssetStatus } from "@/lib/ledger";
import { cn } from "@/lib/utils";

const styles: Record<AssetStatus, string> = {
  due: "bg-peach text-card",
  overdue: "bg-ink text-card",
  notice: "bg-amber text-ink",
  healthy: "bg-teal text-card",
};

export function StatusChip({ status, label }: { status: AssetStatus; label: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap",
        styles[status],
      )}
    >
      {label}
    </span>
  );
}

export function progressColor(status: AssetStatus): string {
  switch (status) {
    case "due":
      return "bg-peach";
    case "overdue":
      return "bg-ink";
    case "notice":
      return "bg-amber";
    case "healthy":
      return "bg-teal";
  }
}

export function iconBg(status: AssetStatus): string {
  switch (status) {
    case "due":
      return "bg-peach/15";
    case "overdue":
      return "bg-soft/15";
    case "notice":
      return "bg-amber/20";
    case "healthy":
      return "bg-teal/15";
  }
}
