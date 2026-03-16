import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Match Input and Select styling - MTB Green accent
        "flex min-h-[60px] sm:min-h-[80px] w-full rounded border border-gray-300 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-900",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        "transition-all duration-200",
        "hover:border-gray-400",
        "resize-y",
        "data-[error=true]:border-red-500 data-[error=true]:focus:ring-red-500 data-[error=true]:focus:border-red-500",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
