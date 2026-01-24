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
      "flex items-center justify-center gap-2",
      "has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
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
    className={cn("flex items-center gap-2", className)}
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
        // Base sizing - fixed dimensions
        "relative flex items-center justify-center",
        "w-11 h-12 sm:w-12 sm:h-14",
        // Border and background
        "border-2 rounded-lg bg-white",
        "border-gray-300",
        // Typography
        "text-xl sm:text-2xl font-bold text-gray-900",
        // Transitions
        "transition-all duration-150",
        // States
        isActive && "border-success ring-2 ring-success/30 shadow-md",
        char && !isActive && "border-gray-400 bg-gray-50",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-5 w-0.5 bg-gray-900 duration-1000" />
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
    className={cn("text-gray-400", className)}
    {...props}
  >
    <span className="text-xl">-</span>
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
