import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "flex h-10 w-full min-w-0 rounded-lg border border-input bg-gradient-to-r from-muted/50 to-muted/30 px-3 py-2 text-base",
        "shadow-xs transition-all duration-200 outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-gradient-to-r file:from-primary file:to-accent file:text-sm file:font-medium file:text-primary-foreground file:cursor-pointer",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:bg-background",
        "hover:border-primary/50 hover:bg-gradient-to-r hover:from-muted/70 hover:to-muted/40",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Input };
