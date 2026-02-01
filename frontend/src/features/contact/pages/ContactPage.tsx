import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export function ContactPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3 motion-safe:animate-in fade-in-50 duration-300">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground max-w-3xl">
          Questions, feedback, or partnership ideas? We’d love to hear from you.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>We typically respond within 1–2 business days.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input placeholder="Your email" type="email" required />
              <Input placeholder="Subject" required />
              <textarea
                placeholder="Message"
                className="w-full min-h-32 rounded-md border bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
              <Button type="submit" className="w-full">Send</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other ways to reach us</CardTitle>
            <CardDescription>We’re available on multiple channels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p><span className="font-medium text-foreground">Email:</span> support@saasstudio.dev</p>
            <p><span className="font-medium text-foreground">Docs:</span> docs.saasstudio.dev</p>
            <p><span className="font-medium text-foreground">X/Twitter:</span> @saasstudio</p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="text-sm text-muted-foreground">
        <p>We value feedback from our community and continuously iterate to make learning System Design effective and enjoyable.</p>
      </section>
    </div>
  )
}
