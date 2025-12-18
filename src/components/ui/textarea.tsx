import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "border-input min-h-[120px] w-full rounded-md border bg-transparent px-3 py-2 outline-none transition resize-none",
                "focus-visible:border-ring focus-visible:shadow-[0_0_0_3px_hsl(var(--ring))]",
                className
            )}
            {...props}
        />
    )
}

export { Textarea }
