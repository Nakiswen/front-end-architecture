// components/ui/card.tsx
import * as React from "react"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
    <div
    ref= { ref }
    className = "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm"
    { ...props }
    />
))
    Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
    <div
    ref= { ref }
    className = "flex flex-col space-y-1.5 p-6"
    { ...props }
    />
))
    CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ ...props }, ref) => (
    <h3
    ref= { ref }
    className = "text-2xl font-semibold leading-none tracking-tight"
    { ...props }
    />
))
    CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ ...props }, ref) => (
    <p
    ref= { ref }
    className = "text-sm text-gray-500"
    { ...props }
    />
))
    CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
    <div ref= { ref } className = "p-6 pt-0" { ...props } />
))
    CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
    <div
    ref= { ref }
    className = "flex items-center p-6 pt-0"
    { ...props }
    />
))
    CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }