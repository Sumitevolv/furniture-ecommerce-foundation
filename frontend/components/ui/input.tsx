import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, id, ...props }, ref) => {
    return (
      <input
        id={id}
        type={type}
        ref={ref}
        aria-invalid={!!error || undefined}
        className={cn(
          "flex h-11 w-full rounded-sm border border-border-subtle bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-border-strong",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-danger focus-visible:ring-danger",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
