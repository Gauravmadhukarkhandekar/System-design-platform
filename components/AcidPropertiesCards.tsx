/** Four ACID property cards for database fundamentals */
export function AcidPropertiesCards() {
  const items = [
    {
      letter: 'A',
      name: 'Atomicity',
      color: 'from-sky-500/20 to-cyan-500/10 border-sky-400/40 ring-sky-500/15 dark:border-sky-600/40',
      badge: 'bg-sky-600 text-white',
      desc: 'All or nothing — the whole transaction commits or every change is rolled back.',
      example:
        'Bank transfer: debit one account and credit another. If either step fails, neither side sticks.',
    },
    {
      letter: 'C',
      name: 'Consistency',
      color: 'from-violet-500/20 to-fuchsia-500/10 border-violet-400/40 ring-violet-500/15 dark:border-violet-600/40',
      badge: 'bg-violet-600 text-white',
      desc: 'The database only moves through valid states — constraints, invariants, and rules stay true.',
      example:
        'If balance cannot go negative, a withdrawal that would break that rule is rejected.',
    },
    {
      letter: 'I',
      name: 'Isolation',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-400/40 ring-amber-500/15 dark:border-amber-600/40',
      badge: 'bg-amber-600 text-white',
      desc: 'Concurrent transactions see a coherent story — no dirty reads of half-finished work (per isolation level).',
      example:
        'Two buyers race for the last item: only one wins; the other sees “out of stock,” not oversell.',
    },
    {
      letter: 'D',
      name: 'Durability',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-400/40 ring-emerald-500/15 dark:border-emerald-600/40',
      badge: 'bg-emerald-600 text-white',
      desc: 'After commit, data survives crashes — written through the storage path your engine guarantees.',
      example:
        'Order confirmed → survives process kill or power loss once committed (WAL / replication policy).',
    },
  ];

  return (
    <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.letter}
          className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ring-1 ring-inset ${item.color}`}
        >
          <div className="mb-3 flex items-center gap-3">
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-black ${item.badge}`}>
              {item.letter}
            </span>
            <h4 className="text-lg font-bold text-foreground">{item.name}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{item.desc}</p>
          <div className="mt-3 rounded-lg border border-border/70 bg-background/80 px-3 py-2 text-xs leading-relaxed text-foreground">
            <span className="font-semibold text-muted-foreground">Example: </span>
            {item.example}
          </div>
        </div>
      ))}
    </div>
  );
}
