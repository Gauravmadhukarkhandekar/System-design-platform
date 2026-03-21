function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconWarn({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function IconCpu({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  );
}

function IconRam({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function IconDisk({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zm8 3v4m-2-2h4" />
    </svg>
  );
}

function IconNetwork({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

function IconLatency({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconError({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

const metricIcons = [IconCpu, IconRam, IconDisk, IconNetwork, IconLatency, IconError] as const;

type MetricRow = { name: string; target: string; watch: string; notes: string };

const KEY_METRICS: MetricRow[] = [
  {
    name: 'CPU utilization',
    target: '~40–70% average',
    watch: 'Sustained >80%',
    notes: 'Leave room for bursts; watch steal time on VMs.',
  },
  {
    name: 'Memory',
    target: '~60–80% average',
    watch: '>90% or OOM kills',
    notes: 'Track leaks; cgroup limits in containers.',
  },
  {
    name: 'Disk I/O',
    target: 'Under ~70% of provisioned IOPS',
    watch: 'High I/O wait / latency',
    notes: 'SSD vs HDD; burst credits on cloud volumes.',
  },
  {
    name: 'Network throughput',
    target: 'Under ~60% of link / cap',
    watch: 'Saturation, drops, retries',
    notes: 'CDN and compression for egress.',
  },
  {
    name: 'Request latency',
    target: 'p99 within SLO (e.g. under 500 ms)',
    watch: 'Creeping p95 / p99',
    notes: 'Often first user-visible sign of pressure.',
  },
  {
    name: 'Error rate',
    target: 'Under 0.1% (context-dependent)',
    watch: '5xx spikes with load',
    notes: 'Timeouts, pool exhaustion, throttling.',
  },
];

/** Colorful ✓ target / ⚠ watch cards for capacity metrics */
export function KeyCapacityMetricsGrid() {
  return (
    <figure className="not-prose my-10">
      <figcaption className="mb-4 rounded-xl border border-sky-200/60 bg-gradient-to-r from-sky-500/10 to-cyan-500/5 px-4 py-3 dark:border-sky-800/40">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-700 dark:text-sky-300">
            <IconLatency className="h-6 w-6" />
          </span>
          <div>
            <h4 className="text-base font-bold text-foreground">Signals that drive capacity decisions</h4>
            <p className="text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                  ✓
                </span>
                Target band
              </span>
              <span className="mx-2 text-border">·</span>
              <span className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
                <span className="text-amber-600 dark:text-amber-400" aria-hidden>
                  ⚠
                </span>
                Watch / investigate
              </span>
            </p>
          </div>
        </div>
      </figcaption>
      <div className="grid gap-4 sm:grid-cols-2">
        {KEY_METRICS.map((m, i) => {
          const Icon = metricIcons[i] ?? IconCpu;
          return (
            <div
              key={m.name}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3 border-b border-border/60 bg-muted/40 px-4 py-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300">
                  <Icon className="h-6 w-6" />
                </span>
                <h5 className="font-bold text-foreground">{m.name}</h5>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex gap-3 rounded-xl border border-emerald-300/50 bg-emerald-500/10 px-3 py-2.5 dark:border-emerald-700/40 dark:bg-emerald-500/15">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-sm"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Target
                    </p>
                    <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">{m.target}</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-xl border border-amber-300/60 bg-amber-500/10 px-3 py-2.5 dark:border-amber-700/45 dark:bg-amber-500/15">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-lg leading-none text-white shadow-sm"
                    aria-hidden
                  >
                    ⚠
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                      Watch for
                    </p>
                    <p className="text-sm font-semibold text-amber-950 dark:text-amber-50">{m.watch}</p>
                  </div>
                </div>
                <p className="border-t border-border/50 pt-2 text-xs text-muted-foreground">
                  <span className="mr-1.5 inline-block text-violet-600 dark:text-violet-400" aria-hidden>
                    💡
                  </span>
                  {m.notes}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

type Strategy = {
  id: string;
  title: string;
  timing: string;
  icon: 'early' | 'late' | 'match' | 'scale';
  pros: string[];
  cons: string[];
  bestFor: string;
};

const STRATEGIES: Strategy[] = [
  {
    id: 'lead',
    title: 'Lead',
    timing: 'Add capacity before you need it',
    icon: 'early',
    pros: ['No performance cliff while you scramble', 'Absorbs unexpected spikes', 'Easier to pass audits / hard SLOs'],
    cons: ['Higher baseline cost', 'Capital or commit spend earlier', 'Risk of idle capacity'],
    bestFor: 'Critical paths, regulated systems, unpredictable growth',
  },
  {
    id: 'lag',
    title: 'Lag',
    timing: 'Add capacity after demand increases',
    icon: 'late',
    pros: ['Lower cost', 'High utilization', 'Pay when load is proven'],
    cons: ['Overload window while scaling', 'Reactive firefighting', 'User-visible degradation risk'],
    bestFor: 'Predictable batch, cost-sensitive internal workloads',
  },
  {
    id: 'match',
    title: 'Match',
    timing: 'Grow in step with measured demand',
    icon: 'match',
    pros: ['Balances cost and risk', 'Forces good forecasting habits', 'Easier to explain to finance'],
    cons: ['Needs accurate signals', 'More frequent planning cycles', 'Still miss black-swan spikes'],
    bestFor: 'Most steady-state production systems',
  },
  {
    id: 'autoscale',
    title: 'Auto-scaling',
    timing: 'Adjust on metrics or schedules',
    icon: 'scale',
    pros: ['Tracks variable load', 'Can optimize $ with scale-to-zero (where safe)', 'Less manual ticketing'],
    cons: ['Scaling lag & limits', 'Cold starts / warmup', 'Complex policies and alarms'],
    bestFor: 'Variable web/API tiers and worker pools',
  },
];

function StrategyHeaderIcon({ kind }: { kind: Strategy['icon'] }) {
  const cls = 'h-6 w-6';
  if (kind === 'early')
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  if (kind === 'late')
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  if (kind === 'match')
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
  return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

/** Strategies with green ✓ pros and amber ⚠ cons */
export function CapacityStrategyCards() {
  return (
    <div className="not-prose my-10">
      <div className="mb-4 rounded-xl border border-violet-200/60 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/5 px-4 py-3 dark:border-violet-800/40">
        <h4 className="text-base font-bold text-foreground">How aggressively you add capacity</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          Mix strategies by tier — e.g. <strong className="text-foreground">lead</strong> for payments,{' '}
          <strong className="text-foreground">match</strong> for web, <strong className="text-foreground">autoscale</strong> for workers.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {STRATEGIES.map((s) => (
          <article
            key={s.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-md shadow-black/5 dark:shadow-black/20"
          >
            <header className="flex items-start gap-3 border-b border-border/70 bg-gradient-to-r from-slate-500/10 to-transparent px-4 py-4 dark:from-slate-400/10">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-700 dark:bg-violet-400/25 dark:text-violet-200">
                <StrategyHeaderIcon kind={s.icon} />
              </span>
              <div>
                <h5 className="text-lg font-bold text-foreground">{s.title}</h5>
                <p className="text-sm text-muted-foreground">{s.timing}</p>
              </div>
            </header>
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
                    ✓
                  </span>
                  Pros
                </p>
                <ul className="space-y-2.5">
                  {s.pros.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-foreground">
                      <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-400">
                  <span className="text-base leading-none" aria-hidden>
                    ⚠
                  </span>
                  Cons
                </p>
                <ul className="space-y-2.5">
                  {s.cons.map((c) => (
                    <li key={c} className="flex gap-2.5 text-sm text-foreground">
                      <IconWarn className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <footer className="border-t border-border/60 bg-sky-500/5 px-4 py-3 dark:bg-sky-500/10">
              <p className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-lg" aria-hidden>
                  🎯
                </span>
                <span>
                  <span className="font-bold text-sky-900 dark:text-sky-100">Best for: </span>
                  <span className="text-muted-foreground">{s.bestFor}</span>
                </span>
              </p>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
