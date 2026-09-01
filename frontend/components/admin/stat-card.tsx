import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "warning";
}) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{label}</p>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            tone === "warning" ? "bg-warning/15 text-warning" : "bg-surface-muted text-text-secondary"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 font-serif text-2xl text-charcoal">{value}</p>
    </div>
  );
}
