"use client"

import { Toaster as Sonner } from 'sonner';
import type { ToasterProps } from 'sonner';

const resolveTheme = (): ToasterProps["theme"] => {
  if (typeof document === 'undefined') return 'system'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = resolveTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
