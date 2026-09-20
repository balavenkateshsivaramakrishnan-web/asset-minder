import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { addAsset, logService, useLedger } from "@/lib/ledger";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/assets", label: "Assets" },
  { to: "/reminders", label: "Reminders" },
  { to: "/reports", label: "Reports" },
] as const;

const EMOJI_OPTIONS = ["🏠", "❄️", "🌀", "🧊", "🚗", "🛵", "🔋", "🧺", "📺", "💧"];

function AddAssetDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [emoji, setEmoji] = useState("🏠");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const asset = addAsset({ name: name.trim(), detail: detail.trim(), emoji });
    toast.success(`${asset.name} added to your ledger`);
    setName("");
    setDetail("");
    setEmoji("🏠");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add an asset</DialogTitle>
          <DialogDescription>
            Register an appliance or vehicle to start tracking its services and contracts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset-name">Name</Label>
            <Input
              id="asset-name"
              placeholder="e.g. Washing Machine"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="asset-detail">Location / model</Label>
            <Input
              id="asset-detail"
              placeholder="e.g. Utility room"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "grid size-9 place-items-center rounded-lg border text-lg transition-colors",
                    emoji === e
                      ? "border-peach bg-peach/15"
                      : "border-line bg-card hover:border-ink/25",
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full bg-peach text-card hover:bg-ink">
            Add asset
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LogServiceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { assets } = useLedger();
  const [assetId, setAssetId] = useState<string>("");
  const [label, setLabel] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const target = assetId || assets[0]?.id;
    if (!target || !label.trim()) return;
    const asset = assets.find((a) => a.id === target)!;
    logService({
      assetId: target,
      label: label.trim(),
      cost: Number(cost) || 0,
      date: date.trim() || "Today",
    });
    toast.success(`Service logged for ${asset.name}`);
    setAssetId("");
    setLabel("");
    setCost("");
    setDate("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a service</DialogTitle>
          <DialogDescription>Record a service visit, part change, or expense.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Asset</Label>
            <Select value={assetId} onValueChange={setAssetId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.emoji} {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="svc-label">What was done</Label>
            <Input
              id="svc-label"
              placeholder="e.g. Filter change"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="svc-cost">Cost (₹)</Label>
              <Input
                id="svc-cost"
                inputMode="numeric"
                placeholder="1200"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-date">Date</Label>
              <Input
                id="svc-date"
                placeholder="e.g. 20 Sep"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-ink text-card hover:bg-ink/85">
            Log service
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AppHeader() {
  const [addOpen, setAddOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-peach text-lg font-extrabold text-card">
              H
            </div>
            <div className="leading-none">
              <p className="text-[15px] font-extrabold tracking-tight">Hearth</p>
              <p className="mt-0.5 font-mono text-[11px] text-soft">AMC &amp; warranty ledger</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1.5 text-[13px] font-medium md:flex">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-full px-4 py-2 transition-colors",
                    active ? "bg-ink text-card" : "text-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLogOpen(true)}
              className="hidden items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-2 text-[13px] font-semibold transition-colors hover:border-ink/25 sm:inline-flex"
            >
              <span className="font-bold text-peach">+</span> Log service
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-peach px-4 py-2 text-[13px] font-bold text-card transition-colors hover:bg-ink"
            >
              <span className="font-bold">+</span> Add asset
            </button>
          </div>
        </div>
      </header>

      <AddAssetDialog open={addOpen} onOpenChange={setAddOpen} />
      <LogServiceDialog open={logOpen} onOpenChange={setLogOpen} />
    </>
  );
}
