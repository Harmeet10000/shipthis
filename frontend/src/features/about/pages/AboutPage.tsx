import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3 motion-safe:animate-in fade-in-50 duration-300">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">About SaaS Studio</h1>
        <p className="text-muted-foreground max-w-3xl">
          SaaS Studio helps engineers master System Design while managing their learning subscriptions and payments in a single, elegant interface.
          We focus on LLD, HLD, scalability, distributed systems, databases, networking, edge cases, and practical real-world scenarios.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Modern Stack', desc: 'React, Vite, TanStack Router/Query, Zustand, Tailwind & Shadcn.' },
          { title: 'Scalable Design', desc: 'Feature-based architecture, DRY & KISS principles.' },
          { title: 'Beautiful UI', desc: 'Polished UI with micro-animations and dark mode.' },
        ].map((f) => (
          <Card key={f.title} className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
              <CardDescription>{f.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-14 rounded bg-muted/30" />
            </CardContent>
          </Card>
        ))}
      </section>

      <Separator />

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>Clarity, depth, and practicality.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We believe learning System Design should be hands-on and enjoyable. Our platform combines curated learning tracks with subscription management so you can focus on growth.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>What You Get</CardTitle>
            <CardDescription>Tools and content built for engineers.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Guided tracks for LLD and HLD</li>
              <li>Real-world system walkthroughs</li>
              <li>Checklists and edge-case catalogs</li>
              <li>Progress tracking and billing in one place</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
