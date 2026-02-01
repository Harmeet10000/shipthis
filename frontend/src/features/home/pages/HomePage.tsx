import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-3 motion-safe:animate-in fade-in-50 duration-300">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Welcome to <span className="text-primary">SaaS Studio</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A modern SaaS platform to manage user subscriptions and payments while
          studying System Design interviews: LLD, HLD, scalability, distributed systems,
          databases, networking best practices, edge cases, & real-world applications.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild><Link to="/subscriptions">Explore Plans</Link></Button>
          <Button variant="outline" asChild><Link to="/about">Learn More</Link></Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Subscriptions', desc: 'Flexible tiers for learners and teams.' },
          { title: 'Payments', desc: 'Secure, seamless checkout & invoicing.' },
          { title: 'Study Tracks', desc: 'Curated content for LLD, HLD & more.' },
        ].map((f) => (
          <Card key={f.title} className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
              <CardDescription>{f.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Built with performance and DX in mind.</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
