import {
  AirVent,
  BatteryCharging,
  Bike,
  CarFront,
  Droplets,
  Home,
  Refrigerator,
  Tv,
  WashingMachine,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  airvent: AirVent,
  droplets: Droplets,
  car: CarFront,
  refrigerator: Refrigerator,
  bike: Bike,
  battery: BatteryCharging,
  washing: WashingMachine,
  tv: Tv,
  home: Home,
} as const;

export type AssetIconName = keyof typeof ICONS;

export function AssetIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[(name as AssetIconName) in ICONS ? (name as AssetIconName) : "home"];
  return <Icon className={cn("size-5", className)} />;
}
