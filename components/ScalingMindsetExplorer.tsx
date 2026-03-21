'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

type Stage = {
  id: string;
  shortLabel: string;
  userBand: string;
  title: string;
  tag: string;
  flow: string;
  pros: string[];
  cons: string[];
  changes: string[];
};

const STAGES: Stage[] = [
  {
    id: 'single',
    shortLabel: '1',
    userBand: '~0 – 1K',
    title: 'Single server',
    tag: 'Starting',
    flow: 'Users → one box (app + DB on same host or VM)',
    pros: ['Fast to build and ship', 'Easy to debug end-to-end', 'Minimal ops surface'],
    cons: ['Single point of failure', 'Vertical scaling hits a ceiling', 'Deploys risk downtime'],
    changes: ['Focus on product–market fit', 'Basic monitoring and backups'],
  },
  {
    id: 'split-db',
    shortLabel: '2',
    userBand: '~1K – 100K',
    title: 'App + database split',
    tag: 'Growth',
    flow: 'Users → app server → database (network hop)',
    pros: ['Scale app tier independently from DB', 'Clearer failure domains', 'Room for a cache between app and DB'],
    cons: ['DB can still saturate on reads/writes', 'Network latency between tiers'],
    changes: ['Introduce Redis (or similar) for hot reads / sessions', 'Connection pooling', 'Indexes on hot queries'],
  },
  {
    id: 'lb',
    shortLabel: '3',
    userBand: '~100K – 1M',
    title: 'Load-balanced app tier',
    tag: 'Scale-out',
    flow: 'Users → load balancer → app₁, app₂, app₃ → primary DB',
    pros: ['Horizontal scale for stateless compute', 'Rolling deploys with less pain'],
    cons: ['Sessions must leave local disk (Redis / JWT)', 'Database often becomes the bottleneck'],
    changes: ['Stateless services', 'Health checks', 'Read replicas when reads dominate'],
  },
  {
    id: 'db-scale',
    shortLabel: '4',
    userBand: '~1M – 10M',
    title: 'DB scaling & async',
    tag: 'Advanced',
    flow: 'LB → apps → cache → primary + replicas (R1, R2) — optional queues for slow work',
    pros: ['Read replicas spread read load', 'Cache cuts DB QPS dramatically', 'Queues absorb spikes'],
    cons: ['Replication lag & consistency trade-offs', 'Sharding is a big step', 'More moving parts'],
    changes: ['CQRS-style read paths', 'Sharding when writes or size demand it', 'Async jobs for email, search index, analytics'],
  },
  {
    id: 'distributed',
    shortLabel: '5',
    userBand: '10M+',
    title: 'Distributed / service boundaries',
    tag: 'Enterprise',
    flow: 'Gateway → bounded services (orders, pay, search…) each with own data stores',
    pros: ['Independent deploy and scale per domain', 'Team ownership aligned to services'],
    cons: ['Distributed tracing, contracts, and ops culture required', 'Not “free” — avoid microservices until boundaries are clear'],
    changes: ['API gateway / BFF', 'Event-driven integration', 'SLOs per service, chaos testing'],
  },
];

export function ScalingMindsetExplorer() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];

  return (
    <div className="not-prose my-10 rounded-2xl border border-sky-200/60 bg-gradient-to-b from-sky-50/30 to-background p-4 shadow-lg shadow-sky-900/5 dark:border-sky-800/40 dark:from-sky-950/20 dark:shadow-black/20 sm:p-6">
      <div className="mb-1 flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <span className="text-lg" aria-hidden>
          📈
        </span>
        <h3 className="text-lg font-bold tracking-tight text-foreground">Interactive: architecture by scale</h3>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Bands are <strong>illustrative</strong> — real cutovers depend on workload, team, and budget. Click a stage to compare shapes.
      </p>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Scaling stages">
        {STAGES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={clsx(
              'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
              i === active
                ? 'border-sky-500 bg-sky-500/15 text-sky-900 dark:text-sky-100'
                : 'border-border bg-background hover:bg-muted/60'
            )}
          >
            <span className="tabular-nums font-bold">{s.shortLabel}</span>
            <span className="text-muted-foreground"> · </span>
            {s.userBand}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        className="rounded-xl border border-border bg-background/80 p-4 sm:p-5"
      >
        <div className="mb-3 flex flex-wrap items-baseline gap-2">
          <h4 className="text-base font-bold text-foreground">{stage.title}</h4>
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{stage.tag}</span>
        </div>
        <p className="mb-4 font-mono text-xs leading-relaxed text-sky-800 dark:text-sky-200 sm:text-sm">{stage.flow}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Pros</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {stage.pros.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400" aria-hidden>
                    ✓
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-rose-700 dark:text-rose-400">Cons / limits</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {stage.cons.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-rose-600 dark:text-rose-400" aria-hidden>
                    ✗
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-foreground">Typical next moves</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {stage.changes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
