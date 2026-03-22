import { clsx } from 'clsx';

type Section =
  | 'kitchen'
  | 'impact'
  | 'latency'
  | 'patternCards'
  | 'patternTable'
  | 'whatToCache'
  | 'invalidation'
  | 'hitRate';

type Props = { section: Section };

const lanes = [
  {
    id: 'l1',
    emoji: '🍳',
    title: 'Counter (L1 cache)',
    subtitle: 'CPU registers / L1',
    desc: 'What you are touching right now — nanoseconds.',
    gradient: 'from-amber-400/90 via-orange-500/85 to-amber-600/90',
    border: 'border-amber-400/50 dark:border-amber-500/40',
    glow: 'shadow-amber-500/20',
  },
  {
    id: 'l2',
    emoji: '🗄️',
    title: 'Fridge (L2 cache)',
    subtitle: 'Redis / Memcached / local',
    desc: 'Hot shared data — sub-millisecond to low ms.',
    gradient: 'from-sky-400/90 via-cyan-500/85 to-blue-600/90',
    border: 'border-sky-400/50 dark:border-sky-500/40',
    glow: 'shadow-sky-500/20',
  },
  {
    id: 'db',
    emoji: '🏪',
    title: 'Grocery store (database)',
    subtitle: 'Source of truth',
    desc: 'Everything is there — higher latency, durable.',
    gradient: 'from-violet-500/85 via-purple-600/80 to-indigo-700/85',
    border: 'border-violet-400/50 dark:border-violet-500/40',
    glow: 'shadow-violet-500/25',
  },
];

const latencyRows = [
  { label: 'L1 cache (CPU)', value: '~1 ns', widthPct: 4, bar: 'from-emerald-400 to-emerald-600' },
  { label: 'L2 cache (CPU)', value: '~10 ns', widthPct: 6, bar: 'from-lime-400 to-lime-600' },
  { label: 'Redis (in-memory)', value: '~0.5 ms', widthPct: 22, bar: 'from-cyan-400 to-cyan-600' },
  { label: 'SSD read', value: '~1 ms', widthPct: 28, bar: 'from-sky-400 to-blue-600' },
  { label: 'Database query', value: '~10–100 ms', widthPct: 62, bar: 'from-indigo-400 to-violet-600' },
  { label: 'Network API call', value: '~100–500 ms', widthPct: 95, bar: 'from-fuchsia-500 to-rose-600' },
];

const patterns = [
  {
    name: 'Cache-aside (lazy loading)',
    tag: 'Most common',
    accent: 'border-emerald-400/60 bg-emerald-500/[0.08] dark:border-emerald-500/40',
    tagClass: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200',
    flow: 'App → check cache → miss? → DB → populate cache',
    pros: ['Only stores data that is actually read', 'Cache outage: app can still hit DB'],
    cons: ['First request after miss is slow', 'Stale if DB updated without invalidation'],
  },
  {
    name: 'Write-through',
    tag: 'Strong consistency',
    accent: 'border-blue-400/60 bg-blue-500/[0.08] dark:border-blue-500/40',
    tagClass: 'bg-blue-500/20 text-blue-800 dark:text-blue-200',
    flow: 'App → write cache → synchronous write DB',
    pros: ['Cache matches DB after write', 'No stale reads from your own writes'],
    cons: ['Higher write latency (two hops)', 'May cache rows that are never read'],
  },
  {
    name: 'Write-behind (write-back)',
    tag: 'Write-optimized',
    accent: 'border-violet-400/60 bg-violet-500/[0.08] dark:border-violet-500/40',
    tagClass: 'bg-violet-500/20 text-violet-800 dark:text-violet-200',
    flow: 'App → write cache → async / batched flush to DB',
    pros: ['Fast write ACK', 'Smooths spikes; fewer DB writes'],
    cons: ['Data loss risk if cache dies before flush', 'Harder to implement correctly'],
  },
  {
    name: 'Read-through',
    tag: 'Simpler app',
    accent: 'border-amber-400/60 bg-amber-500/[0.08] dark:border-amber-500/40',
    tagClass: 'bg-amber-500/20 text-amber-900 dark:text-amber-200',
    flow: 'App → cache only; cache loads from DB on miss',
    pros: ['Thin application code', 'Loading logic centralized in cache layer'],
    cons: ['Needs library / middleware support', 'First read still pays DB cost'],
  },
];

export function CachingStrategiesVisual({ section }: Props) {
  if (section === 'kitchen') {
    return (
      <div className="not-prose my-10 grid gap-4 md:grid-cols-3">
        {lanes.map((lane) => (
          <div
            key={lane.id}
            className={clsx(
              'relative overflow-hidden rounded-2xl border-2 p-5 shadow-lg transition-transform hover:-translate-y-0.5',
              lane.border,
              lane.glow
            )}
          >
            <div
              className={clsx(
                'absolute inset-0 bg-gradient-to-br opacity-90 dark:opacity-80',
                lane.gradient
              )}
            />
            <div className="relative z-[1] text-white">
              <span className="text-3xl drop-shadow-md" aria-hidden>
                {lane.emoji}
              </span>
              <h3 className="mt-3 text-lg font-bold tracking-tight drop-shadow-sm">{lane.title}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/90">{lane.subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/95">{lane.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section === 'impact') {
    return (
      <div className="not-prose my-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-rose-300/70 bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-background p-6 shadow-md dark:border-rose-800/50 dark:from-rose-950/40">
          <h3 className="flex items-center gap-2 text-lg font-bold text-rose-800 dark:text-rose-200">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/25 text-base">✗</span>
            Without cache
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-rose-500">●</span>
              Most requests hit the database every time
            </li>
            <li className="flex gap-2">
              <span className="text-rose-500">●</span>
              DB CPU and I/O become the bottleneck early
            </li>
            <li className="flex gap-2">
              <span className="text-rose-500">●</span>
              p95 latency often hundreds of ms for hot keys
            </li>
            <li className="flex gap-2">
              <span className="text-rose-500">●</span>
              Throughput limited by how many queries/sec DB can take
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border-2 border-emerald-300/70 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-background p-6 shadow-md dark:border-emerald-800/50 dark:from-emerald-950/40">
          <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-800 dark:text-emerald-200">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/25 text-base">✓</span>
            With a healthy cache
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-emerald-500">●</span>
              Large share of reads served from RAM (goal: very high hit rate on hot keys)
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">●</span>
              Database load drops; headroom for writes and admin queries
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">●</span>
              Cached path: often sub-ms to low-ms vs tens–hundreds of ms
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">●</span>
              Many more read QPS before scaling the primary DB
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (section === 'latency') {
    return (
      <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-sky-200/60 bg-gradient-to-b from-sky-50/50 to-background p-5 shadow-lg dark:border-sky-800/40 dark:from-sky-950/30">
        <figcaption className="mb-5 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-lg text-white shadow-md">
            ⚡
          </span>
          <div>
            <h4 className="text-base font-bold text-foreground">Typical latency ladder (orders of magnitude)</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Bar length is illustrative — not to scale — but the ranking is what to remember: closer to CPU = faster.
            </p>
          </div>
        </figcaption>
        <div className="space-y-4">
          {latencyRows.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-semibold text-foreground">{row.label}</span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{row.value}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted/80 ring-1 ring-border/50">
                <div
                  className={clsx('h-full rounded-full bg-gradient-to-r shadow-sm', row.bar)}
                  style={{ width: `${row.widthPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </figure>
    );
  }

  if (section === 'patternCards') {
    return (
      <div className="not-prose my-10 grid gap-5 md:grid-cols-2">
        {patterns.map((p) => (
          <div
            key={p.name}
            className={clsx('rounded-2xl border-2 p-5 shadow-md transition-shadow hover:shadow-lg', p.accent)}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-foreground">{p.name}</h3>
              <span className={clsx('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide', p.tagClass)}>
                {p.tag}
              </span>
            </div>
            <p className="mt-3 rounded-lg bg-background/60 px-3 py-2 font-mono text-xs text-foreground/90 ring-1 ring-border/50 dark:bg-background/40">
              {p.flow}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Pros</p>
                <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                  {p.pros.map((x) => (
                    <li key={x} className="flex gap-1.5">
                      <span className="text-emerald-500">+</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Cons</p>
                <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                  {p.cons.map((x) => (
                    <li key={x} className="flex gap-1.5">
                      <span className="text-rose-500">−</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section === 'patternTable') {
    const rows: [string, string, string, string, string][] = [
      ['Cache-aside', 'Fast after warm', 'Normal', 'Eventual', 'Read-heavy; tolerate some staleness'],
      ['Write-through', 'Fast', 'Slower', 'Strong', 'Reads must see latest writes'],
      ['Write-behind', 'Fast', 'Very fast ACK', 'Eventual', 'Write-heavy; accept flush risk'],
      ['Read-through', 'Fast after warm', 'Normal', 'Eventual', 'Want cache-centric API'],
    ];
    const headers = ['Pattern', 'Read perf', 'Write perf', 'Consistency', 'Best for'] as const;
    const rowColors = [
      'border-l-4 border-l-emerald-500 bg-emerald-500/[0.04]',
      'border-l-4 border-l-blue-500 bg-blue-500/[0.04]',
      'border-l-4 border-l-violet-500 bg-violet-500/[0.04]',
      'border-l-4 border-l-amber-500 bg-amber-500/[0.04]',
    ];
    return (
      <div className="not-prose my-10 overflow-x-auto rounded-2xl border border-border shadow-lg">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-fuchsia-500/20 via-violet-500/15 to-cyan-500/20 dark:from-fuchsia-950/50 dark:via-violet-950/40 dark:to-cyan-950/40">
              {headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row[0]} className={clsx('border-b border-border/50 last:border-0', rowColors[i])}>
                <th scope="row" className="px-4 py-3.5 text-left font-bold text-foreground">
                  {row[0]}
                </th>
                <td className="px-4 py-3.5 text-muted-foreground">{row[1]}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{row[2]}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{row[3]}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (section === 'whatToCache') {
    return (
      <div className="not-prose my-10 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-teal-400/50 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-background p-6 dark:border-teal-600/40">
          <h3 className="flex items-center gap-2 text-lg font-bold text-teal-800 dark:text-teal-200">
            <span className="text-xl" aria-hidden>
              ✓
            </span>
            Good candidates
          </h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-foreground">Session &amp; profile</dt>
              <dd className="text-muted-foreground">User info, auth context — read often per request.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Computed results</dt>
              <dd className="text-muted-foreground">Heavy aggregations, recommendation features, report slices.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Reference data</dt>
              <dd className="text-muted-foreground">Countries, categories, feature flags — slow-changing.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Third-party API responses</dt>
              <dd className="text-muted-foreground">Rate-limited or slow upstreams — TTL + stale-if-error.</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl border-2 border-orange-400/50 bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-background p-6 dark:border-orange-600/40">
          <h3 className="flex items-center gap-2 text-lg font-bold text-orange-900 dark:text-orange-200">
            <span className="text-xl" aria-hidden>
              ✗
            </span>
            Avoid or be careful
          </h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-foreground">Highly dynamic data</dt>
              <dd className="text-muted-foreground">Live prices, real-time counters — stale cache misleads users.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Cold / archival data</dt>
              <dd className="text-muted-foreground">Rarely read — wastes RAM; consider DB or object storage only.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Huge blobs</dt>
              <dd className="text-muted-foreground">Video, big files — use CDN / object storage, not Redis for bulk.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Sensitive data</dt>
              <dd className="text-muted-foreground">PII / secrets — encrypt, TTL, access control, compliance review.</dd>
            </div>
          </dl>
        </div>
      </div>
    );
  }

  if (section === 'invalidation') {
    const methods = [
      {
        title: 'TTL (time-to-live)',
        color: 'from-amber-400/20 to-yellow-500/10 border-amber-400/50',
        code: "cache.set('user:123', data, ttl=300)",
        pros: ['Simple', 'Automatic expiry'],
        cons: ['Stale until TTL', 'Choosing TTL is hard'],
      },
      {
        title: 'Event-based',
        color: 'from-fuchsia-400/20 to-pink-500/10 border-fuchsia-400/50',
        code: 'on_user_update → cache.delete(key)',
        pros: ['Accurate after writes', 'No arbitrary wait'],
        cons: ['Must wire every writer', 'Hard with many cache layers'],
      },
      {
        title: 'Version / tag in key',
        color: 'from-cyan-400/20 to-sky-500/10 border-cyan-400/50',
        code: "user:123:v7 — bump version to invalidate family",
        pros: ['Bulk bust in one bump', 'Works across instances'],
        cons: ['Old keys linger until eviction', 'More memory for duplicates'],
      },
    ];
    return (
      <div className="not-prose my-10">
        <blockquote className="mb-6 rounded-xl border border-violet-300/50 bg-violet-500/5 px-4 py-3 text-sm italic text-muted-foreground dark:border-violet-800/40">
          “There are only two hard things in Computer Science: <strong className="text-foreground">cache invalidation</strong> and naming
          things.” — Phil Karlton
        </blockquote>
        <div className="grid gap-4 md:grid-cols-3">
          {methods.map((m) => (
            <div
              key={m.title}
              className={clsx(
                'rounded-2xl border-2 bg-gradient-to-br p-5 shadow-md',
                m.color
              )}
            >
              <h3 className="text-base font-bold text-foreground">{m.title}</h3>
              <code className="mt-3 block rounded-lg bg-background/80 px-2 py-2 font-mono text-[11px] text-foreground ring-1 ring-border/60">
                {m.code}
              </code>
              <div className="mt-4 space-y-2 text-xs">
                <p className="font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Upsides</p>
                <ul className="space-y-1 text-muted-foreground">
                  {m.pros.map((x) => (
                    <li key={x}>+ {x}</li>
                  ))}
                </ul>
                <p className="mt-2 font-bold uppercase tracking-wide text-rose-700 dark:text-rose-400">Downsides</p>
                <ul className="space-y-1 text-muted-foreground">
                  {m.cons.map((x) => (
                    <li key={x}>− {x}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === 'hitRate') {
    return (
      <div className="not-prose my-8 rounded-2xl border-2 border-cyan-400/40 bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-blue-500/15 p-6 shadow-md dark:border-cyan-700/40">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-black text-white shadow-lg">
            90%+
          </div>
          <div>
            <h4 className="text-lg font-bold text-foreground">Monitor cache hit rate</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              On hot keys, aim for very high hit rates (often <strong className="text-foreground">90%+</strong> is a healthy target for a
              warm cache — measure per namespace). Low hits mean wrong TTL, cold keys, or keys too granular.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
