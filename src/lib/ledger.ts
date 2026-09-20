import { useSyncExternalStore } from "react";

export type ServiceRecord = {
  id: string;
  date: string;
  label: string;
  cost: number;
};

export type AssetStatus = "due" | "overdue" | "notice" | "healthy";

export type Asset = {
  id: string;
  name: string;
  detail: string;
  icon: string;
  status: AssetStatus;
  statusLabel: string;
  nextLabel: string;
  nextDate: string;
  costLabel: string;
  progress: number; // 0..1
  warranty: string;
  amc: string;
  provider: string;
  history: ServiceRecord[];
};

export type Reminder = {
  id: string;
  assetId: string;
  assetName: string;
  label: string;
  vendor: string;
  date: string;
  relative: string;
  cost: number;
  urgency: "urgent" | "soon" | "later" | "ok";
};

export type Expense = {
  id: string;
  assetId: string;
  assetName: string;
  emoji: string;
  label: string;
  date: string;
  cost: number;
};

const initialAssets: Asset[] = [
  {
    id: "split-ac",
    name: "Split AC",
    detail: "Living room",
    icon: "airvent",
    status: "due",
    statusLabel: "AMC due",
    nextLabel: "Next service",
    nextDate: "28 Sep",
    costLabel: "₹2,500/yr",
    progress: 0.2,
    warranty: "Expires 2026",
    amc: "Ends 28 Sep",
    provider: "Cooltech Services",
    history: [
      { id: "ac-1", date: "03 Sep", label: "Gas top-up", cost: 2800 },
      { id: "ac-2", date: "14 Jul", label: "Annual service", cost: 1800 },
    ],
  },
  {
    id: "ro-purifier",
    name: "RO Purifier",
    detail: "Kitchen",
    icon: "droplets",
    status: "notice",
    statusLabel: "Cartridge",
    nextLabel: "Filter change",
    nextDate: "30 Nov",
    costLabel: "₹1,200",
    progress: 0.66,
    warranty: "Expires Mar 2027",
    amc: "Active till Feb 2026",
    provider: "Aquaguard Care",
    history: [
      { id: "ro-1", date: "28 Aug", label: "Filter kit", cost: 1200 },
      { id: "ro-2", date: "11 Dec 2025", label: "Cartridge change", cost: 600 },
    ],
  },
  {
    id: "car",
    name: "Car",
    detail: "Mahindra XUV300",
    icon: "car",
    status: "overdue",
    statusLabel: "Overdue",
    nextLabel: "Service",
    nextDate: "due 02 Sep",
    costLabel: "₹4,800",
    progress: 1,
    warranty: "Expires 2028",
    amc: "No AMC",
    provider: "Mahindra Service, Guindy",
    history: [
      { id: "car-1", date: "21 Dec 2025", label: "Oil change", cost: 4800 },
      { id: "car-2", date: "02 Jun 2025", label: "Brake pads", cost: 3200 },
    ],
  },
  {
    id: "fridge",
    name: "Refrigerator",
    detail: "Kitchen",
    icon: "refrigerator",
    status: "healthy",
    statusLabel: "Healthy",
    nextLabel: "Warranty",
    nextDate: "2027",
    costLabel: "AMC ₹0",
    progress: 0.8,
    warranty: "Expires 2027",
    amc: "No AMC",
    provider: "Samsung Care",
    history: [{ id: "fr-1", date: "18 Sep 2025", label: "Coil clean", cost: 950 }],
  },
  {
    id: "bike",
    name: "Bike",
    detail: "Honda Activa 6G",
    icon: "bike",
    status: "notice",
    statusLabel: "Insurance",
    nextLabel: "Insurance renewal",
    nextDate: "28 Sep",
    costLabel: "₹1,850",
    progress: 0.15,
    warranty: "Expired 2025",
    amc: "Insurance only",
    provider: "HDFC Ergo",
    history: [{ id: "bk-1", date: "28 Sep 2025", label: "Insurance renewal", cost: 1850 }],
  },
  {
    id: "inverter",
    name: "Inverter",
    detail: "Luminous 1.5kVA",
    icon: "battery",
    status: "healthy",
    statusLabel: "Healthy",
    nextLabel: "Battery check",
    nextDate: "30 Oct",
    costLabel: "₹600",
    progress: 0.58,
    warranty: "Ends Jul 2026",
    amc: "No AMC",
    provider: "Luminous Care",
    history: [{ id: "in-1", date: "30 Apr 2025", label: "Battery water top-up", cost: 300 }],
  },
];

const initialReminders: Reminder[] = [
  {
    id: "r1",
    assetId: "split-ac",
    assetName: "Split AC",
    label: "AMC renewal",
    vendor: "Cooltech Services",
    date: "28 Sep",
    relative: "in 8 days",
    cost: 2500,
    urgency: "urgent",
  },
  {
    id: "r2",
    assetId: "bike",
    assetName: "Bike",
    label: "Insurance renewal",
    vendor: "Honda Activa",
    date: "28 Sep",
    relative: "in 8 days",
    cost: 1850,
    urgency: "soon",
  },
  {
    id: "r3",
    assetId: "car",
    assetName: "Car",
    label: "Periodic service",
    vendor: "Mahindra Service",
    date: "02 Sep",
    relative: "overdue",
    cost: 4800,
    urgency: "urgent",
  },
  {
    id: "r4",
    assetId: "inverter",
    assetName: "Inverter",
    label: "Battery check",
    vendor: "Luminous",
    date: "30 Oct",
    relative: "in 6 weeks",
    cost: 600,
    urgency: "later",
  },
  {
    id: "r5",
    assetId: "ro-purifier",
    assetName: "RO Purifier",
    label: "Cartridge replacement",
    vendor: "Aquaguard",
    date: "30 Nov",
    relative: "in 2 mo",
    cost: 1200,
    urgency: "ok",
  },
];

type LedgerState = {
  assets: Asset[];
  reminders: Reminder[];
  extraExpenses: Expense[];
};

let state: LedgerState = {
  assets: initialAssets,
  reminders: initialReminders,
  extraExpenses: [],
};

const listeners = new Set<() => void>();

function setState(next: Partial<LedgerState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  return state;
}

export function useLedger() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function addAsset(input: { name: string; detail: string; emoji: string }) {
  const id = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
  const asset: Asset = {
    id,
    name: input.name,
    detail: input.detail || "Home",
    emoji: input.emoji || "🏠",
    status: "healthy",
    statusLabel: "Healthy",
    nextLabel: "First service",
    nextDate: "Not set",
    costLabel: "—",
    progress: 0.05,
    warranty: "Not recorded",
    amc: "Not recorded",
    provider: "—",
    history: [],
  };
  setState({ assets: [asset, ...state.assets] });
  return asset;
}

export function logService(input: {
  assetId: string;
  label: string;
  cost: number;
  date: string;
}) {
  const record: ServiceRecord = {
    id: "svc-" + Date.now().toString(36),
    date: input.date,
    label: input.label,
    cost: input.cost,
  };
  const assets = state.assets.map((a) =>
    a.id === input.assetId ? { ...a, history: [record, ...a.history] } : a,
  );
  const asset = assets.find((a) => a.id === input.assetId)!;
  const expense: Expense = {
    id: "exp-" + Date.now().toString(36),
    assetId: asset.id,
    assetName: asset.name,
    emoji: asset.emoji,
    label: input.label,
    date: input.date,
    cost: input.cost,
  };
  setState({ assets, extraExpenses: [expense, ...state.extraExpenses] });
}

export function allExpenses(s: LedgerState): Expense[] {
  const base: Expense[] = s.assets.flatMap((a) =>
    a.history.map((h) => ({
      id: h.id,
      assetId: a.id,
      assetName: a.name,
      emoji: a.emoji,
      label: h.label,
      date: h.date,
      cost: h.cost,
    })),
  );
  const seen = new Set<string>();
  return [...s.extraExpenses, ...base].filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}

export function totalSpent(s: LedgerState): number {
  return allExpenses(s).reduce((sum, e) => sum + e.cost, 0);
}

export function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}
