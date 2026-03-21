import type { ReactNode } from 'react';

/** Three boxed pillars: SLI / SLO / SLA — for learn pages */
export function ReliabilityPillarBoxes() {
  const items: {
    abbr: string;
    title: string;
    tag: string;
    body: string;
    example: ReactNode;
    tone: string;
    badge: string;
  }[] = [
    {
      abbr: 'SLI',
      title: 'Service Level Indicator',
      tag: 'What we measure',
      body: 'A quantitative measure of service behavior (latency, availability, error rate, freshness…).',
      example: 'Example: p99 latency, ratio of successful HTTP requests.',
      tone: 'from-sky-500/15 to-cyan-500/10 border-sky-300/50 dark:border-sky-700/50',
      badge: 'bg-sky-600 text-white',
    },
    {
      abbr: 'SLO',
      title: 'Service Level Objective',
      tag: 'What we target',
      body: 'An internal goal for an SLI over a time window — your reliability north star.',
      example: (
        <span>
          Example: 99.9% of requests complete in under 200 ms over 30 rolling days.
        </span>
      ),
      tone: 'from-violet-500/15 to-fuchsia-500/10 border-violet-300/50 dark:border-violet-700/50',
      badge: 'bg-violet-600 text-white',
    },
    {
      abbr: 'SLA',
      title: 'Service Level Agreement',
      tag: 'What we promise',
      body: 'A contract with customers: expected service and remedies (credits, refunds) if you miss it.',
      example: 'Example: 99.5% monthly uptime or published service credits.',
      tone: 'from-amber-500/15 to-orange-500/10 border-amber-300/50 dark:border-amber-700/50',
      badge: 'bg-amber-600 text-white',
    },
  ];

  return (
    <div className="not-prose my-8 grid gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.abbr}
          className={`rounded-2xl border bg-gradient-to-b p-5 shadow-sm ${item.tone}`}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className={`rounded-lg px-2.5 py-1 text-sm font-bold ${item.badge}`}>{item.abbr}</span>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.tag}</span>
          </div>
          <h4 className="text-lg font-bold text-foreground">{item.title}</h4>
          <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
          <div className="mt-3 rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-xs text-foreground">
            {item.example}
          </div>
        </div>
      ))}
    </div>
  );
}
