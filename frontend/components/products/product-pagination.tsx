"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";

export function ProductPagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/products?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} className="pt-12" />
  );
}
