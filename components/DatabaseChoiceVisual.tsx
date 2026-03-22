import { clsx } from 'clsx';

const typeStyles: Record<string, string> = {
  SQL: 'bg-sky-500/20 text-sky-900 dark:text-sky-100',
  Document: 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-100',
  'Key-Value': 'bg-rose-500/20 text-rose-900 dark:text-rose-100',
  'Wide-Column': 'bg-violet-500/20 text-violet-900 dark:text-violet-100',
  Graph: 'bg-fuchsia-500/20 text-fuchsia-900 dark:text-fuchsia-100',
  Search: 'bg-amber-500/25 text-amber-950 dark:text-amber-100',
};

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={clsx(
        'inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide',
        typeStyles[type] ?? 'bg-muted text-foreground'
      )}
    >
      {type}
    </span>
  );
}

const refRows = [
  {
    db: 'PostgreSQL',
    type: 'SQL',
    border: 'border-l-sky-500',
    best: 'Complex queries, JSON, GIS',
    avoid: 'Need massive horizontal scale',
  },
  {
    db: 'MySQL',
    type: 'SQL',
    border: 'border-l-sky-400',
    best: 'Read-heavy, web apps',
    avoid: 'Complex JSON operations',
  },
  {
    db: 'MongoDB',
    type: 'Document',
    border: 'border-l-emerald-500',
    best: 'Flexible schema, rapid dev',
    avoid: 'Complex transactions',
  },
  {
    db: 'Redis',
    type: 'Key-Value',
    border: 'border-l-rose-500',
    best: 'Caching, sessions, queues',
    avoid: 'Complex queries, large data',
  },
  {
    db: 'Cassandra',
    type: 'Wide-Column',
    border: 'border-l-violet-500',
    best: 'Massive writes, time-series',
    avoid: 'Ad-hoc queries, JOINs',
  },
  {
    db: 'DynamoDB',
    type: 'Key-Value',
    border: 'border-l-orange-500',
    best: 'Serverless, auto-scale',
    avoid: 'Complex queries, cost-sensitive',
  },
  {
    db: 'Neo4j',
    type: 'Graph',
    border: 'border-l-fuchsia-500',
    best: 'Relationships, recommendations',
    avoid: 'Simple CRUD operations',
  },
  {
    db: 'Elasticsearch',
    type: 'Search',
    border: 'border-l-amber-500',
    best: 'Full-text search, logs',
    avoid: 'Primary data store',
  },
];

/** Colored quick reference: database × type badge × best for × avoid */
export function DatabaseQuickReferenceTable() {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-cyan-200/60 bg-gradient-to-b from-cyan-50/40 to-background shadow-lg dark:border-cyan-900/40 dark:from-cyan-950/20">
      <figcaption className="border-b border-cyan-200/50 bg-gradient-to-r from-cyan-500/12 to-teal-500/8 px-5 py-4 dark:border-cyan-800/50">
        <h4 className="text-base font-bold text-foreground">Quick reference table</h4>
        <p className="mt-1 text-sm text-muted-foreground">Type colors group similar engines — same decision rules still apply.</p>
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-100/80 to-teal-100/60 dark:from-cyan-950/50 dark:to-teal-950/40">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Database</th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-widest">Type</th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-widest">Best for</th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-widest">Avoid when</th>
            </tr>
          </thead>
          <tbody>
            {refRows.map((r) => (
              <tr
                key={r.db}
                className={clsx(
                  'border-b border-border/40 bg-background/50 last:border-0 dark:bg-background/30',
                  'border-l-4 pl-0',
                  r.border
                )}
              >
                <th scope="row" className="px-4 py-3 font-bold text-foreground">
                  {r.db}
                </th>
                <td className="px-3 py-3">
                  <TypeBadge type={r.type} />
                </td>
                <td className="px-3 py-3 text-muted-foreground">{r.best}</td>
                <td className="px-3 py-3 text-muted-foreground">{r.avoid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

const stackItems = [
  {
    name: 'PostgreSQL',
    role: 'Orders, users, products (ACID)',
    gradient: 'from-sky-500/90 to-blue-600/90',
    border: 'border-sky-400/50',
  },
  {
    name: 'Redis',
    role: 'Sessions, cart, cache',
    gradient: 'from-rose-500/90 to-red-600/90',
    border: 'border-rose-400/50',
  },
  {
    name: 'Elasticsearch',
    role: 'Product search',
    gradient: 'from-amber-500/90 to-orange-600/90',
    border: 'border-amber-400/50',
  },
  {
    name: 'S3',
    role: 'Product images',
    gradient: 'from-teal-500/90 to-emerald-700/90',
    border: 'border-teal-400/50',
  },
];

/** Example polyglot stack as colored cards */
export function PolyglotPersistenceStack() {
  return (
    <div className="not-prose my-8">
      <p className="mb-4 text-sm font-semibold text-foreground">Example: e-commerce platform</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {stackItems.map((s) => (
          <div
            key={s.name}
            className={clsx(
              'overflow-hidden rounded-xl border-2 shadow-md',
              s.border
            )}
          >
            <div className={clsx('bg-gradient-to-r px-4 py-2 text-sm font-bold text-white', s.gradient)}>{s.name}</div>
            <div className="bg-card px-4 py-3 text-sm text-muted-foreground">{s.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
