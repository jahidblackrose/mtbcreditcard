import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // MTB Brand Colors - Compact design
          "flex h-7 sm:h-8 w-full rounded border border-gray-300 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5",
          // Text styling
          "text-xs sm:text-sm text-gray-900",
          // Placeholder styling
          "placeholder:text-gray-400",
          // Focus styles - MTB green/accent
          "focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          // Transition for smooth interactions
          "transition-colors duration-150",
          // Hover state
          "hover:border-gray-400",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
