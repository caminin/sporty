import type { GroupColorKey } from "./types";

export const GROUP_COLOR_KEYS: GroupColorKey[] = [
  "red",
  "blue",
  "purple",
  "yellow",
  "emerald",
  "primary",
  "orange",
  "cyan",
];

export const GROUP_COLOR_STYLES: Record<GroupColorKey, { colorClass: string; borderClass: string }> = {
  red: {
    colorClass: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    borderClass: "",
  },
  blue: {
    colorClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    borderClass: "",
  },
  purple: {
    colorClass: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    borderClass: "",
  },
  yellow: {
    colorClass: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    borderClass: "",
  },
  emerald: {
    colorClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    borderClass: "",
  },
  primary: {
    colorClass: "bg-primary/10 text-primary",
    borderClass: "border-l-4 border-primary",
  },
  orange: {
    colorClass: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    borderClass: "",
  },
  cyan: {
    colorClass: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    borderClass: "",
  },
};

export const DEFAULT_GROUP_COLOR: GroupColorKey = "blue";

export function isGroupColorKey(value: unknown): value is GroupColorKey {
  return typeof value === "string" && GROUP_COLOR_KEYS.includes(value as GroupColorKey);
}
