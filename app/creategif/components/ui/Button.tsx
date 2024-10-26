// components/ui/button.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = "default",
    size = "default",
    children,
    ...props
}, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
    }

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
    }

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    )
})
Button.displayName = "Button"

export { Button }