import { clsx } from 'clsx';

function PreventedPossible({ value }: { value: 'Prevented' | 'Possible' }) {
  const isPrev = value === 'Prevented';
  return (
    <span
      className={clsx(
        'inline-flex min-w-[5.5rem] justify-center rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide',
        isPrev
          ? 'bg-emerald-500/20 text-emerald-900 dark:bg-emerald-500/25 dark:text-emerald-100'
          : 'bg-amber-500/25 text-amber-950 dark:bg-amber-500/20 dark:text-amber-100'
      )}
    >
      {value}
    </span>
  );
}

function PerfBadge({ label }: { label: string }) {
  const map: Record<string, string> = {
    Fastest: 'from-lime-500/30 to-emerald-500/20 text-emerald-900 dark:text-emerald-100',
    Fast: 'from-sky-500/25 to-cyan-500/15 text-sky-950 dark:text-sky-100',
    Medium: 'from-amber-500/25 to-orange-500/15 text-amber-950 dark:text-amber-100',
    Slowest: 'from-rose-500/30 to-red-500/20 text-rose-950 dark:text-rose-100',
  };
  const cls = map[label] ?? 'bg-muted text-foreground';
  return (
    <span
      className={clsx(
        'inline-flex min-w-[5rem] justify-center rounded-md bg-gradient-to-r px-2 py-1 text-xs font-bold',
        cls
      )}
    >
      {label}
    </span>
  );
}

/** Colored matrix: dirty read / non-repeatable / phantom / performance */
export function IsolationComparisonTable() {
  const rows = [
    {
      level: 'Read Uncommitted',
      levelClass: 'border-l-4 border-l-slate-400 bg-slate-500/5',
      dirty: 'Possible' as const,
      nrr: 'Possible' as const,
      phantom: 'Possible' as const,
      perf: 'Fastest',
    },
    {
      level: 'Read Committed',
      levelClass: 'border-l-4 border-l-sky-500 bg-sky-500/5',
      dirty: 'Prevented' as const,
      nrr: 'Possible' as const,
      phantom: 'Possible' as const,
      perf: 'Fast',
    },
    {
      level: 'Repeatable Read',
      levelClass: 'border-l-4 border-l-violet-500 bg-violet-500/5',
      dirty: 'Prevented' as const,
      nrr: 'Prevented' as const,
      phantom: 'Possible' as const,
      perf: 'Medium',
    },
    {
      level: 'Serializable',
      levelClass: 'border-l-4 border-l-rose-500 bg-rose-500/5',
      dirty: 'Prevented' as const,
      nrr: 'Prevented' as const,
      phantom: 'Prevented' as const,
      perf: 'Slowest',
    },
  ];

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-b from-violet-50/30 to-background shadow-lg dark:border-violet-900/40 dark:from-violet-950/20">
      <figcaption className="border-b border-violet-200/50 bg-gradient-to-r from-violet-500/12 to-fuchsia-500/8 px-5 py-4 dark:border-violet-800/50">
        <h4 className="text-base font-bold text-foreground">Comparison table</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">Prevented</span> vs{' '}
          <span className="font-semibold text-amber-800 dark:text-amber-200">Possible</span> anomalies; performance trend left to
          right.
        </p>
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-violet-100/90 to-fuchsia-100/70 dark:from-violet-950/60 dark:to-fuchsia-950/40">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-foreground">
                Isolation level
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-widest text-foreground">Dirty read</th>
              <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-widest text-foreground">
                Non-repeatable
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-widest text-foreground">Phantom</th>
              <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-widest text-foreground">Performance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.level} className={clsx('border-b border-border/50 last:border-0', r.levelClass)}>
                <th scope="row" className="px-4 py-3.5 text-left font-bold text-foreground">
                  {r.level}
                </th>
                <td className="px-3 py-3.5 text-center">
                  <PreventedPossible value={r.dirty} />
                </td>
                <td className="px-3 py-3.5 text-center">
                  <PreventedPossible value={r.nrr} />
                </td>
                <td className="px-3 py-3.5 text-center">
                  <PreventedPossible value={r.phantom} />
                </td>
                <td className="px-3 py-3.5 text-center">
                  <PerfBadge label={r.perf} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

const levelBlocks = [
  {
    title: 'Read Uncommitted',
    border: 'border-amber-400/70 bg-amber-500/[0.08] dark:border-amber-600/50',
    accent: 'text-amber-900 dark:text-amber-100',
    body: [
      'Transactions can read uncommitted changes from other transactions (dirty reads).',
      'Problem allowed: Dirty read — read data that might be rolled back.',
      'Use case: Almost never used. Analytics on non-critical data.',
    ],
  },
  {
    title: 'Read Committed',
    border: 'border-sky-400/70 bg-sky-500/[0.08] dark:border-sky-600/50',
    accent: 'text-sky-900 dark:text-sky-100',
    body: [
      'Only read committed data. Most common default (PostgreSQL, Oracle).',
      'Problem allowed: Non-repeatable read — same query returns different results within transaction.',
      'Use case: Default for most applications. Good balance.',
    ],
  },
  {
    title: 'Repeatable Read',
    border: 'border-violet-400/70 bg-violet-500/[0.08] dark:border-violet-600/50',
    accent: 'text-violet-900 dark:text-violet-100',
    body: [
      'Same query always returns same results within transaction. MySQL default.',
      'Problem allowed: Phantom read — new rows can appear in range queries.',
      'Use case: Financial calculations, reports.',
    ],
  },
  {
    title: 'Serializable',
    border: 'border-rose-400/70 bg-rose-500/[0.08] dark:border-rose-700/50',
    accent: 'text-rose-900 dark:text-rose-100',
    body: [
      'Transactions execute as if serial (one after another). Highest isolation.',
      'Problem allowed: None, but very slow. Lots of locking/retries.',
      'Use case: Critical financial transactions, inventory systems.',
    ],
  },
];

export function IsolationLevelCards() {
  return (
    <div className="not-prose my-10 grid gap-4 md:grid-cols-2">
      {levelBlocks.map((b) => (
        <div key={b.title} className={clsx('rounded-2xl border-2 p-5 shadow-md', b.border)}>
          <h3 className={clsx('text-lg font-bold', b.accent)}>{b.title}</h3>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
            {b.body.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
