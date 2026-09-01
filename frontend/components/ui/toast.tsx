"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Global toast host. Mounted once in the root layout. Trigger toasts from
 * anywhere with `import { toast } from "sonner"`.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "!bg-surface !border !border-border-subtle !text-text-primary !rounded-md !shadow-lg !font-sans",
          title: "!text-text-primary !font-medium",
          description: "!text-text-secondary",
          actionButton: "!bg-accent !text-accent-foreground",
          cancelButton: "!bg-surface-muted !text-text-secondary",
          success: "!border-l-4 !border-l-success",
          error: "!border-l-4 !border-l-danger",
          warning: "!border-l-4 !border-l-warning",
        },
      }}
      closeButton
    />
  );
}

export { toast } from "sonner";
