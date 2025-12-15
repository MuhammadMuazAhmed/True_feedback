import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 outline-none transition",
        "focus-visible:border-ring focus-visible:shadow-[0_0_0_3px_hsl(var(--ring))]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
