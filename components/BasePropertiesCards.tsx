/** BASE model — three cards (Basically Available, Soft state, Eventual consistency) */
export function BasePropertiesCards() {
  const items = [
    {
      letter: 'BA',
      name: 'Basically Available',
      color: 'from-teal-500/20 to-cyan-500/10 border-teal-400/40 ring-teal-500/15 dark:border-teal-600/40',
      badge: 'bg-teal-600 text-white',
      desc: 'The system stays up and answers requests. Responses might be stale or degraded, but callers get something back.',
      example: 'Feed loads during a partition; cart page returns even if inventory is briefly wrong.',
    },
    {
      letter: 'S',
      name: 'Soft state',
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-400/40 ring-amber-500/15 dark:border-amber-600/40',
      badge: 'bg-amber-600 text-white',
      desc: 'State can drift between replicas without new writes — until background sync catches up.',
      example: 'Two regions show different like counts for a few seconds after a spike.',
    },
    {
      letter: 'E',
      name: 'Eventually consistent',
      color: 'from-rose-500/20 to-orange-500/10 border-rose-400/40 ring-rose-500/15 dark:border-rose-600/40',
      badge: 'bg-rose-600 text-white',
      desc: 'If writes stop, replicas converge to the same value given enough time and connectivity.',
      example: 'Counters and read models settle after replication lag drains.',
    },
  ];

  return (
    <div className="not-prose my-8 grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.letter}
          className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ring-1 ring-inset ${item.color}`}
        >
          <div className="mb-3 flex items-center gap-3">
            <span className={`flex h-12 min-w-[2.75rem] items-center justify-center rounded-xl px-2 text-lg font-black ${item.badge}`}>
              {item.letter}
            </span>
            <h4 className="text-base font-bold leading-tight text-foreground">{item.name}</h4>
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
