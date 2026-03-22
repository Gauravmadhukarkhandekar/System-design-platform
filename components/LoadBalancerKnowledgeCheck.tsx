'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

const OPTIONS = [
  { id: 'A', label: 'Round Robin' },
  { id: 'B', label: 'Weighted Round Robin' },
  { id: 'C', label: 'Least Connections' },
  { id: 'D', label: 'IP Hash' },
] as const;

export function LoadBalancerKnowledgeCheck() {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-b from-violet-50/40 to-background p-6 shadow-lg dark:border-violet-900/40 dark:from-violet-950/25">
      <h4 className="text-lg font-bold text-foreground">Knowledge check</h4>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Your e-commerce application has 3 servers with different specs: Server A (32 cores), Server B (16 cores), Server C (8
        cores). Which algorithm should you use to ensure traffic is distributed proportionally to their capacity?
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {OPTIONS.map((o) => {
          const isCorrect = o.id === 'B';
          const show = revealed;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setSelected(o.id)}
              className={clsx(
                'flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all',
                selected === o.id && !show && 'border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30',
                selected !== o.id && !show && 'border-border bg-card hover:border-violet-300/50',
                show &&
                  isCorrect &&
                  'border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-100',
                show && !isCorrect && selected === o.id && 'border-rose-400 bg-rose-500/10',
                show && !isCorrect && selected !== o.id && 'border-border opacity-60'
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-xs font-black">
                {o.id}
              </span>
              {o.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="mt-4 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
      >
        Check answer
      </button>
      {revealed ? (
        <div className="mt-4 rounded-xl border border-emerald-300/60 bg-emerald-500/10 p-4 text-sm text-emerald-950 dark:border-emerald-800/50 dark:text-emerald-100">
          <p className="font-bold">Correct: B — Weighted Round Robin</p>
          <p className="mt-2 text-muted-foreground dark:text-emerald-200/90">
            Assign weights proportional to capacity (e.g. A:4, B:2, C:1) so larger servers receive more requests than plain round
            robin would give each.
          </p>
        </div>
      ) : null}
    </div>
  );
}
