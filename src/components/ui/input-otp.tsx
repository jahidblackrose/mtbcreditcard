/**
 * OTP Input Component
 * Clean, properly styled OTP input boxes for mobile banking
 */

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      // Make wrapper relative so the real <input> can be positioned invisibly over it.
      "relative flex items-center justify-center gap-3 flex-nowrap",
      "has-[:disabled]:opacity-50",
      containerClassName
    )}
    // Hide the actual input's text/caret so users only see the per-slot UI.
    // This prevents the full OTP value from visually stacking in the first slot.
    className={cn(
      "absolute inset-0 h-full w-full opacity-0",
      "caret-transparent text-transparent selection:bg-transparent",
      "disabled:cursor-not-allowed",
      className
    )}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3 flex-nowrap", className)}
    {...props}
  />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const slot = inputOTPContext.slots[index];
  
  if (!slot) {
    return null;
  }
  
  const { char, hasFakeCaret, isActive } = slot;

  return (
    <div
      ref={ref}
      className={cn(
        // Base sizing - fixed dimensions (matches design memory)
        "relative flex items-center justify-center select-none shrink-0 overflow-hidden",
        "w-11 h-12 sm:w-12 sm:h-14",
        // Border and background (semantic tokens)
        "border-2 rounded-lg bg-background border-input",
        // Typography
        "text-xl sm:text-2xl font-bold leading-none text-foreground",
        // Transitions
        "transition-all duration-150",
        // States
        isActive && "border-success ring-2 ring-success/30 shadow-sm",
        char && !isActive && "bg-muted",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-5 w-0.5 bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn("text-muted-foreground", className)}
    {...props}
  >
    <span className="text-xl">-</span>
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
