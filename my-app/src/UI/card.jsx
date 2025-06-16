import React from "react"
import clsx from "clsx"

export function Card({ className, ...props }) {
  return <div className={clsx("rounded-2xl border bg-white p-6 shadow-sm", className)} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={clsx("mb-4", className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={clsx("text-xl font-semibold", className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={clsx("text-sm text-muted-foreground", className)} {...props} />
}
