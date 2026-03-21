'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

type Hop = {
  id: string;
  label: string;
  icon: string;
  ms: number;
  /** Shown after hop completes */
  cacheTag?: 'HIT' | 'MISS' | null;
};

function buildPath(cdnHit: boolean, redisHit: boolean): Hop[] {
  if (cdnHit) {
    return [
      { id: 'user', label: 'User', icon: '👤', ms: 0 },
      { id: 'dns', label: 'DNS', icon: '🌐', ms: 18 },
      { id: 'cdn', label: 'CDN', icon: '⚡', ms: 8, cacheTag: 'HIT' },
    ];
  }

  const path: Hop[] = [
    { id: 'user', label: 'User', icon: '👤', ms: 0 },
    { id: 'dns', label: 'DNS', icon: '🌐', ms: 22 },
    { id: 'cdn', label: 'CDN', icon: '⚡', ms: 12, cacheTag: 'MISS' },
    { id: 'lb', label: 'Load Balancer', icon: '⚖️', ms: 6 },
    { id: 'api', label: 'API Server', icon: '🖥️', ms: 35 },
    {
      id: 'redis',
      label: 'Redis',
      icon: '💾',
      ms: redisHit ? 2 : 4,
      cacheTag: redisHit ? 'HIT' : 'MISS',
    },
  ];

  if (!redisHit) {
    path.push({ id: 'db', label: 'Database', icon: '🗄️', ms: 75 });
  }

  return path;
}

export function RequestLifecycleSimulator() {
  const [cdnHit, setCdnHit] = useState(false);
  const [redisHit, setRedisHit] = useState(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'anim' | 'done'>('idle');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [totalMs, setTotalMs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const path = buildPath(cdnHit, redisHit);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const sendRequest = useCallback(() => {
    clearTimer();
    setRunning(true);
    setPhase('anim');
    setActiveIndex(-1);
    setTotalMs(0);

    const hops = buildPath(cdnHit, redisHit);
    let i = 0;
    let acc = 0;

    const step = () => {
      if (i >= hops.length) {
        setPhase('done');
        setRunning(false);
        setActiveIndex(hops.length - 1);
        return;
      }
      setActiveIndex(i);
      acc += hops[i].ms;
      setTotalMs(acc);
      i += 1;
      timerRef.current = setTimeout(step, 520);
    };

    timerRef.current = setTimeout(step, 200);
  }, [cdnHit, redisHit, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return (
    <div className="not-prose my-10 rounded-2xl border border-sky-200/60 bg-gradient-to-b from-sky-50/30 to-background p-4 shadow-lg shadow-sky-900/5 dark:border-sky-800/40 dark:from-sky-950/20 dark:shadow-black/20 sm:p-6">
      <div className="mb-1 flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <span className="text-lg" aria-hidden>
          ⚡
        </span>
        <h3 className="text-lg font-bold tracking-tight text-foreground">Interactive: Request lifecycle</h3>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Click <strong>Send request</strong> and watch the path. Toggle cache scenarios to see fewer hops and lower latency.
      </p>

      <div className="mb-4 flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={cdnHit}
            disabled={running}
            onChange={(e) => {
              setCdnHit(e.target.checked);
              if (e.target.checked) setRedisHit(false);
            }}
            className="rounded border-border"
          />
          <span>CDN cache hit (fastest — edge response)</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={redisHit}
            disabled={running || cdnHit}
            onChange={(e) => setRedisHit(e.target.checked)}
            className="rounded border-border"
          />
          <span>Redis cache hit (skip database)</span>
        </label>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={sendRequest}
          disabled={running}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {running ? 'Sending…' : 'Send request'}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3" aria-live="polite">
        {path.map((hop, idx) => {
          const isIdle = phase === 'idle';
          const isPast = !isIdle && (phase === 'done' || (phase === 'anim' && activeIndex > idx));
          const isActive = phase === 'anim' && activeIndex === idx;
          return (
            <div key={`${hop.id}-${idx}`} className="flex items-center gap-2">
              <div
                className={clsx(
                  'flex min-w-[5.5rem] flex-col items-center rounded-xl border px-2 py-2 text-center transition-all sm:min-w-[6.5rem]',
                  isIdle && 'border-sky-200/70 bg-sky-50/50 dark:border-sky-800/50 dark:bg-sky-950/30',
                  isActive && 'scale-105 border-sky-500 bg-sky-500/15 ring-2 ring-sky-400/50',
                  isPast && !isActive && 'border-sky-300/60 bg-sky-100/40 dark:border-sky-700 dark:bg-sky-950/40',
                  !isIdle && !isPast && !isActive && 'border-border bg-muted/20 opacity-70'
                )}
              >
                <span className="text-xl" aria-hidden>
                  {hop.icon}
                </span>
                <span className="mt-0.5 text-[11px] font-semibold leading-tight text-foreground">{hop.label}</span>
                {hop.cacheTag ? (
                  <span
                    className={clsx(
                      'mt-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                      hop.cacheTag === 'HIT'
                        ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-500/20 text-amber-900 dark:text-amber-200'
                    )}
                  >
                    {hop.cacheTag}
                  </span>
                ) : null}
              </div>
              {idx < path.length - 1 ? (
                <span className="text-muted-foreground" aria-hidden>
                  →
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-baseline gap-6 rounded-xl border border-border bg-background/80 px-4 py-3">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total latency (illustrative)</span>
          <p className="text-2xl font-bold tabular-nums text-sky-700 dark:text-sky-300">
            {phase === 'idle' ? '—' : `${totalMs}ms`}
          </p>
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Hops</span>
          <p className="text-2xl font-bold tabular-nums text-foreground">{path.length}</p>
        </div>
      </div>

      <CalloutInline />
    </div>
  );
}

function CalloutInline() {
  return (
    <p className="mt-4 text-sm text-muted-foreground">
      <span className="font-semibold text-foreground">Tip:</span> Without caching, every request pays for CDN miss, app work, and often a database round-trip — usually the slowest hop.
    </p>
  );
}
