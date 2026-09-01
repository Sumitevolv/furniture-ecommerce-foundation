import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "danger" | "muted"> = {
  pending: "warning",
  confirmed: "default",
  processing: "default",
  shipped: "success",
  delivered: "success",
  cancelled: "danger",
  refunded: "muted",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return <Badge variant={STATUS_VARIANT[status] ?? "muted"}>{status}</Badge>;
}
