'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

type Phase = 'idle' | 'running' | 'done';

export function SyncAsyncSimulator() {
  const [mode, setMode] = useState<'sync' | 'async'>('sync');
  const [phase, setPhase] = useState<Phase>('idle');
  const [userLabel, setUserLabel] = useState('Ready to send');
  const [queueCount, setQueueCount] = useState(0);
  const [workerBusy, setWorkerBusy] = useState(false);
  const [userResponseMs, setUserResponseMs] = useState<number | null>(null);
  const [wallMs, setWallMs] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setPhase('idle');
    setUserLabel('Ready to send');
    setQueueCount(0);
    setWorkerBusy(false);
    setUserResponseMs(null);
    setWallMs(null);
  }, [clearTimers]);

  const sendEmail = useCallback(() => {
    if (phase === 'running') return;
    clearTimers();
    setPhase('running');
    setUserResponseMs(null);
    setWallMs(null);
    setQueueCount(0);
    setWorkerBusy(false);

    const start = performance.now();
    const push = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    if (mode === 'sync') {
      setUserLabel('Blocked — waiting for server…');
      const workMs = 2800;
      push(() => {
        const elapsed = Math.round(performance.now() - start);
        setUserLabel('Email sent (you waited the whole time)');
        setUserResponseMs(elapsed);
        setWallMs(elapsed);
        setPhase('done');
      }, workMs);
      return;
    }

    // Async: fast ack to user, work happens in "queue + worker"
    setUserLabel('Request sent…');
    push(() => {
      const ack = Math.round(performance.now() - start);
      setUserLabel('Got it — you can keep working');
      setUserResponseMs(ack);
      setQueueCount(1);
    }, 55);

    push(() => {
      setWorkerBusy(true);
    }, 120);

    push(() => {
      setQueueCount(0);
    }, 400);

    push(() => {
      setWorkerBusy(false);
      setWallMs(Math.round(performance.now() - start));
      setPhase('done');
    }, 2600);
  }, [mode, phase, clearTimers]);

  const refSyncMs = 2800;
  const ratio =
    phase === 'done' && mode === 'async' && userResponseMs != null && userResponseMs > 0
      ? Math.max(1, Math.round(refSyncMs / userResponseMs))
      : null;

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <div className="not-prose my-10 rounded-2xl border border-sky-200/60 bg-gradient-to-b from-sky-50/30 to-background p-4 shadow-lg shadow-sky-900/5 dark:border-sky-800/40 dark:from-sky-950/20 dark:shadow-black/20 sm:p-6">
      <div className="mb-1 flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <span className="text-lg" aria-hidden>
          ⚡
        </span>
        <h3 className="text-lg font-bold tracking-tight text-foreground">Interactive: sync vs async</h3>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Simulate <strong>sending an email</strong>: synchronous blocks the caller until work finishes; asynchronous returns
        immediately and processes in the background.
      </p>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Mode">
        {(['sync', 'async'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            disabled={phase === 'running'}
            onClick={() => {
              reset();
              setMode(m);
            }}
            className={clsx(
              'rounded-lg border px-4 py-2 text-sm font-semibold capitalize transition-colors',
              mode === m
                ? 'border-sky-500 bg-sky-500/15 text-sky-900 dark:text-sky-100'
                : 'border-border bg-background hover:bg-muted/60'
            )}
          >
            {m === 'sync' ? 'Synchronous' : 'Asynchronous'}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={sendEmail}
          disabled={phase === 'running'}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {phase === 'running' ? 'Working…' : 'Send email'}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={phase === 'running'}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted/60 disabled:opacity-60"
        >
          Reset
        </button>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div
          className={clsx(
            'rounded-xl border p-4 transition-colors',
            mode === 'sync' ? 'border-sky-400/60 bg-sky-500/5' : 'border-border bg-muted/20'
          )}
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">User (caller)</p>
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden>
              👤
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{userLabel}</p>
              {phase === 'running' && mode === 'sync' ? (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">⏳ Blocked until the server finishes…</p>
              ) : null}
              {phase === 'running' && mode === 'async' ? (
                <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">✓ Not blocked — UI stays responsive</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/80 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Backend</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <span className="font-medium">Send path</span>
              <span className="text-muted-foreground">{mode === 'sync' ? 'Process inline' : 'Enqueue + return'}</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <span className="flex items-center gap-2 font-medium">
                <span aria-hidden>📬</span> Queue
              </span>
              <span className="tabular-nums text-muted-foreground">
                {queueCount === 0 ? 'Empty' : `${queueCount} job`}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <span className="flex items-center gap-2 font-medium">
                <span aria-hidden>⚙️</span> Worker
              </span>
              <span
                className={clsx(
                  'text-xs font-semibold uppercase',
                  workerBusy ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
                )}
              >
                {workerBusy ? 'Processing' : 'Idle'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Time to response (user)</p>
          <p className="text-xl font-bold tabular-nums text-foreground">
            {userResponseMs == null ? '—' : `${userResponseMs} ms`}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {mode === 'async' ? 'Total background time (illustrative)' : 'Same as user wait'}
          </p>
          <p className="text-xl font-bold tabular-nums text-foreground">
            {wallMs == null ? '—' : `${wallMs} ms`}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Takeaway</p>
          <p className="text-sm font-medium text-foreground">
            {phase !== 'done'
              ? '—'
              : mode === 'sync'
                ? 'Caller waited for all work.'
                : ratio != null
                  ? `~${ratio}× faster perceived response (work still finishes later).`
                  : 'Fast ack; work completed asynchronously.'}
          </p>
        </div>
      </div>
    </div>
  );
}
