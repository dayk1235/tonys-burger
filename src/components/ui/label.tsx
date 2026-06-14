import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block font-sans text-sm font-medium text-text-primary",
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
    )
  }
)
Label.displayName = "Label"

export { Label }
