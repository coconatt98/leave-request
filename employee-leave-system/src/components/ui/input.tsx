import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-2xl border border-white/70 bg-white/85 px-3 py-2 text-base text-[#0f1c2f] shadow-[0_6px_15px_rgba(15,98,254,0.08)] transition-colors outline-none placeholder:text-[#8a94a8] focus-visible:border-[#0f62fe]/60 focus-visible:ring-3 focus-visible:ring-[#0f62fe]/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-[#8a94a8] aria-invalid:border-destructive/60 aria-invalid:ring-3 aria-invalid:ring-destructive/30 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
