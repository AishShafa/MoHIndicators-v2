import React from "react"
import clsx from "clsx"

export function Badge({ className, children }) {
  return (
    <span
      className={clsx(
        "inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800",
        className
      )}
    >
      {children}
    </span>
  )
}
