import Link from 'next/link';
import { Card } from '@/components/Card';

const features = [
  {
    title: 'Fundamentals',
    description: 'Build a solid foundation with core concepts: requirements, scalability, latency, and the system design process.',
    href: '/learn/fundamentals/what-is-system-design',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'High Level Design',
    description: 'Learn load balancers, caching, databases, message queues, API gateways, and distributed systems concepts.',
    href: '/learn/hld/load-balancers',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: 'Low Level Design',
    description: 'Apply SOLID principles, design patterns, and object-oriented design to real problems like parking lots and elevators.',
    href: '/learn/lld/solid-principles',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Real World Case Studies',
    description: 'Design URL shorteners, Twitter, WhatsApp, Uber, and YouTube with step-by-step system design breakdowns.',
    href: '/learn/case-studies/design-url-shortener',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
];

const steps = [
  { num: 1, title: 'Fundamentals', href: '/learn/fundamentals/what-is-system-design' },
  { num: 2, title: 'High Level Design', href: '/learn/hld/load-balancers' },
  { num: 3, title: 'Low Level Design', href: '/learn/lld/solid-principles' },
  { num: 4, title: 'Case Studies', href: '/learn/case-studies/design-url-shortener' },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background py-20 px-4 md:py-28">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Learn System Design the Practical Way
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Master High Level Design and Low Level Design through structured lessons and real world case studies.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/learn/fundamentals/what-is-system-design"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Start Learning
            </Link>
            <Link
              href="/learn/case-studies/design-url-shortener"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-center text-foreground mb-10">What you&apos;ll learn</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.href} title={f.title} description={f.description} href={f.href} icon={f.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center text-foreground mb-10">Learning path</h2>
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="flex flex-1 flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-lg font-semibold text-primary">
                  {step.num}
                </div>
                <p className="mt-3 font-medium text-foreground">{step.title}</p>
                <Link
                  href={step.href}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  Start →
                </Link>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute left-1/2 top-8 h-0.5 w-full max-w-[80px] bg-border -translate-y-1/2" style={{ left: `${(i + 1) * 25}%` }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4 text-center text-sm text-muted-foreground">
        System Design Learning Platform — Developed by Gaurav Khandekar
      </footer>
    </div>
  );
}
