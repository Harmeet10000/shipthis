export function SimplePage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight motion-safe:animate-in fade-in-50 duration-300">{title}</h1>
      {description && <p className="text-muted-foreground max-w-2xl">{description}</p>}
    </div>
  )
}
