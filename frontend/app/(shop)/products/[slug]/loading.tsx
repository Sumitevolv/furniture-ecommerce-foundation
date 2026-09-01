import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page py-10 md:py-14">
      <Skeleton className="mb-8 h-4 w-64" />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-[4/5] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
