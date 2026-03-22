'use client';

import { useCallback, useMemo, useState } from 'react';
import { clsx } from 'clsx';

const CAPACITY = 4;
const KEYS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

type Policy = 'LRU' | 'FIFO' | 'LFU' | 'Random';

type LogEntry = { type: 'hit' | 'miss' | 'evict'; key: string; victim?: string };

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function CacheEvictionSimulator() {
  const [policy, setPolicy] = useState<Policy>('LRU');
  /** LRU: order[0] = LRU, order[last] = MRU */
  const [lruOrder, setLruOrder] = useState<string[]>([]);
  /** FIFO: order of insertion */
  const [fifoOrder, setFifoOrder] = useState<string[]>([]);
  /** LFU: key -> { freq, insertSeq } */
  const [lfuData, setLfuData] = useState<Record<string, { freq: number; insertSeq: number }>>({});
  const [randomSet, setRandomSet] = useState<string[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);

  const currentKeys = useMemo(() => {
    if (policy === 'LRU') return [...lruOrder];
    if (policy === 'FIFO') return [...fifoOrder];
    if (policy === 'LFU')
      return Object.keys(lfuData).sort((a, b) => lfuData[a]!.insertSeq - lfuData[b]!.insertSeq);
    return [...randomSet];
  }, [policy, lruOrder, fifoOrder, lfuData, randomSet]);

  const reset = useCallback(() => {
    setLruOrder([]);
    setFifoOrder([]);
    setLfuData({});
    setRandomSet([]);
    setLog([]);
  }, []);

  const access = useCallback(
    (key: string) => {
      const pushLog = (e: LogEntry) => setLog((L) => [...L.slice(-11), e]);

      if (policy === 'LRU') {
        setLruOrder((prev) => {
          const filtered = prev.filter((k) => k !== key);
          const hit = filtered.length < prev.length;
          let next = filtered;
          if (hit) {
            pushLog({ type: 'hit', key });
          } else {
            pushLog({ type: 'miss', key });
            if (next.length >= CAPACITY) {
              const victim = next[0]!;
              next = next.slice(1);
              pushLog({ type: 'evict', key, victim });
            }
          }
          return [...next, key];
        });
        return;
      }

      if (policy === 'FIFO') {
        setFifoOrder((prev) => {
          if (prev.includes(key)) {
            pushLog({ type: 'hit', key });
            return prev;
          }
          pushLog({ type: 'miss', key });
          let next = [...prev];
          if (next.length >= CAPACITY) {
            const victim = next.shift()!;
            pushLog({ type: 'evict', key, victim });
          }
          next.push(key);
          return next;
        });
        return;
      }

      if (policy === 'LFU') {
        setLfuData((prev) => {
          const copy = { ...prev };
          if (copy[key]) {
            copy[key] = { ...copy[key]!, freq: copy[key]!.freq + 1 };
            pushLog({ type: 'hit', key });
            return copy;
          }
          pushLog({ type: 'miss', key });
          const keys = Object.keys(copy);
          if (keys.length >= CAPACITY) {
            let minF = Infinity;
            for (const k of keys) minF = Math.min(minF, copy[k]!.freq);
            const tied = keys.filter((k) => copy[k]!.freq === minF);
            tied.sort((a, b) => copy[a]!.insertSeq - copy[b]!.insertSeq);
            const victim = tied[0]!;
            delete copy[victim];
            pushLog({ type: 'evict', key, victim });
          }
          const maxIns = Object.values(copy).reduce((m, v) => Math.max(m, v.insertSeq), 0);
          copy[key] = { freq: 1, insertSeq: maxIns + 1 };
          return copy;
        });
        return;
      }

      // Random
      setRandomSet((prev) => {
        if (prev.includes(key)) {
          pushLog({ type: 'hit', key });
          return prev;
        }
        pushLog({ type: 'miss', key });
        let next = [...prev];
        if (next.length >= CAPACITY) {
          const victim = pickRandom(next);
          next = next.filter((k) => k !== victim);
          pushLog({ type: 'evict', key, victim });
        }
        next.push(key);
        return next;
      });
    },
    [policy]
  );

  const policyTabs: { id: Policy; label: string; color: string }[] = [
    { id: 'LRU', label: 'LRU', color: 'from-emerald-500 to-teal-600' },
    { id: 'FIFO', label: 'FIFO', color: 'from-sky-500 to-blue-600' },
    { id: 'LFU', label: 'LFU', color: 'from-violet-500 to-purple-600' },
    { id: 'Random', label: 'Random', color: 'from-orange-500 to-rose-600' },
  ];

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-b from-violet-50/40 via-background to-background shadow-lg dark:border-violet-900/40 dark:from-violet-950/25">
      <div className="border-b border-violet-200/50 bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-transparent px-5 py-4 dark:border-violet-800/50">
        <h4 className="text-base font-bold text-foreground">Eviction policy demo</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          Capacity <span className="font-mono font-semibold text-foreground">{CAPACITY}</span> slots. Tap keys{' '}
          <span className="font-mono">A–F</span> in any order — watch hits, misses, and evictions.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {policyTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setPolicy(t.id);
                reset();
              }}
              className={clsx(
                'rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all',
                policy === t.id
                  ? `bg-gradient-to-r ${t.color} text-white shadow-md`
                  : 'bg-muted/80 text-muted-foreground ring-1 ring-border hover:bg-muted'
              )}
            >
              {t.label}
            </button>
          ))}
          <button
            type="button"
            onClick={reset}
            className="ml-auto rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-5 py-4">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => access(k)}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 text-lg font-black text-white shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95 dark:from-slate-500 dark:to-slate-700"
          >
            {k}
          </button>
        ))}
      </div>

      <div className="px-5 pb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Cache ({currentKeys.length}/{CAPACITY})
        </p>
        <div className="mt-2 flex min-h-[4.5rem] flex-wrap gap-2">
          {currentKeys.length === 0 ? (
            <span className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">Empty — tap a key</span>
          ) : (
            currentKeys.map((k, i) => {
              let hint = '';
              if (policy === 'LRU') {
                if (currentKeys.length === 1) hint = 'only entry';
                else if (i === 0) hint = 'LRU next';
                else if (i === currentKeys.length - 1) hint = 'MRU';
              }
              if (policy === 'FIFO' && i === 0) hint = 'Oldest in';
              if (policy === 'LFU') {
                const d = lfuData[k];
                hint = d ? `freq ${d.freq}` : '';
              }
              const lruSingle = policy === 'LRU' && currentKeys.length === 1;
              return (
                <div
                  key={`${k}-${i}`}
                  className={clsx(
                    'relative flex min-w-[4.5rem] flex-col items-center justify-center rounded-xl border-2 px-3 py-2 font-mono text-lg font-bold shadow-sm',
                    lruSingle && 'border-violet-400 bg-violet-500/10 dark:border-violet-500',
                    policy === 'LRU' && !lruSingle && i === 0 && 'border-rose-400 bg-rose-500/10 dark:border-rose-600',
                    policy === 'LRU' && !lruSingle && i === currentKeys.length - 1 && 'border-emerald-400 bg-emerald-500/10 dark:border-emerald-600',
                    policy === 'FIFO' && i === 0 && 'border-amber-400 bg-amber-500/10',
                    policy === 'LFU' && 'border-violet-400/60 bg-violet-500/10',
                    policy === 'Random' && 'border-sky-400/60 bg-sky-500/10',
                    hint === '' && policy !== 'LFU' && !(policy === 'LRU' && (i === 0 || i === currentKeys.length - 1)) && 'border-border bg-card'
                  )}
                >
                  {k}
                  {hint ? <span className="mt-1 text-[10px] font-normal uppercase tracking-wide text-muted-foreground">{hint}</span> : null}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="max-h-36 overflow-y-auto border-t border-border/50 bg-muted/20 px-5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event log</p>
        <ul className="mt-2 space-y-1 font-mono text-xs">
          {log.length === 0 ? (
            <li className="text-muted-foreground">No events yet.</li>
          ) : (
            log.map((e, i) => (
              <li key={i}>
                {e.type === 'hit' && <span className="text-emerald-600 dark:text-emerald-400">HIT</span>}
                {e.type === 'miss' && <span className="text-sky-600 dark:text-sky-400">MISS</span>}
                {e.type === 'evict' && (
                  <span className="text-rose-600 dark:text-rose-400">EVICT {e.victim}</span>
                )}{' '}
                <span className="text-foreground">{e.key}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
