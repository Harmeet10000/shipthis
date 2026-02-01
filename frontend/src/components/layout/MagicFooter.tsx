import { cn } from '@/lib/utils'

export function MagicFooter({ className }: { className?: string }) {
  return (
    <footer className={cn('border-t relative overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 items-center">
          <div className="space-y-2">
            <p className="text-lg font-semibold tracking-tight">SaaS Studio</p>
            <p className="text-sm text-muted-foreground">
              Learn and manage subscriptions for System Design: LLD, HLD, Scalability, Distributed Systems, Databases, Networking, and real-world apps.
            </p>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Docs</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a>
          </div>
          <div className="md:text-right text-sm text-muted-foreground">
            © {new Date().getFullYear()} SaaS Studio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
