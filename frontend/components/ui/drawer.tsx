"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerPortal = DialogPrimitive.Portal;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = "DrawerOverlay";

const drawerVariants = cva(
  "fixed z-50 flex flex-col bg-surface shadow-2xl transition-transform focus:outline-none",
  {
    variants: {
      side: {
        right: "inset-y-0 right-0 h-full w-full max-w-md border-l border-border-subtle data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        left: "inset-y-0 left-0 h-full w-full max-w-md border-r border-border-subtle data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-lg border-t border-border-subtle data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      },
    },
    defaultVariants: { side: "right" },
  }
);

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerVariants> {}

const DrawerContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DrawerContentProps>(
  ({ className, side, children, ...props }, ref) => (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(drawerVariants({ side }), "animate-in duration-300", className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm text-text-muted hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DrawerPortal>
  )
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("border-b border-border-subtle px-6 py-5", className)} {...props} />
);

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto border-t border-border-subtle px-6 py-5", className)} {...props} />
);

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("font-serif text-lg text-text-primary", className)} {...props} />
));
DrawerTitle.displayName = "DrawerTitle";

export { Drawer, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle };
