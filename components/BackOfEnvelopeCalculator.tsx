'use client';

import { useMemo, useState } from 'react';
import { clsx } from 'clsx';

const SECONDS_PER_DAY = 86_400;

/** Value “pill” + optional row tint for quick visual scan */
const tones = {
  violet:
    'bg-violet-500/15 text-violet-800 ring-violet-500/35 dark:bg-violet-500/20 dark:text-violet-100 dark:ring-violet-400/25',
  sky: 'bg-sky-500/15 text-sky-800 ring-sky-500/35 dark:bg-sky-500/20 dark:text-sky-100 dark:ring-sky-400/25',
  amber:
    'bg-amber-500/15 text-amber-900 ring-amber-500/35 dark:bg-amber-500/20 dark:text-amber-100 dark:ring-amber-400/25',
  emerald:
    'bg-emerald-500/15 text-emerald-900 ring-emerald-500/35 dark:bg-emerald-500/20 dark:text-emerald-100 dark:ring-emerald-400/25',
  cyan: 'bg-cyan-500/15 text-cyan-900 ring-cyan-500/35 dark:bg-cyan-500/20 dark:text-cyan-100 dark:ring-cyan-400/25',
  rose: 'bg-rose-500/15 text-rose-900 ring-rose-500/35 dark:bg-rose-500/20 dark:text-rose-100 dark:ring-rose-400/25',
  indigo:
    'bg-indigo-500/15 text-indigo-900 ring-indigo-500/35 dark:bg-indigo-500/20 dark:text-indigo-100 dark:ring-indigo-400/25',
} as const;

type Tone = keyof typeof tones;

const rowBg: Record<Tone, string> = {
  violet: 'bg-violet-500/[0.06] dark:bg-violet-500/[0.08]',
  sky: 'bg-sky-500/[0.06] dark:bg-sky-500/[0.08]',
  amber: 'bg-amber-500/[0.06] dark:bg-amber-500/[0.08]',
  emerald: 'bg-emerald-500/[0.06] dark:bg-emerald-500/[0.08]',
  cyan: 'bg-cyan-500/[0.06] dark:bg-cyan-500/[0.08]',
  rose: 'bg-rose-500/[0.06] dark:bg-rose-500/[0.08]',
  indigo: 'bg-indigo-500/[0.06] dark:bg-indigo-500/[0.08]',
};

const inputAccent: Record<Tone, string> = {
  violet: 'border-l-violet-500 focus-within:ring-violet-500/30',
  sky: 'border-l-sky-500 focus-within:ring-sky-500/30',
  amber: 'border-l-amber-500 focus-within:ring-amber-500/30',
  emerald: 'border-l-emerald-500 focus-within:ring-emerald-500/30',
  cyan: 'border-l-cyan-500 focus-within:ring-cyan-500/30',
  rose: 'border-l-rose-500 focus-within:ring-rose-500/30',
  indigo: 'border-l-indigo-500 focus-within:ring-indigo-500/30',
};

function formatCompact(n: number): string {
  if (!Number.isFinite(n) || n < 0) return '—';
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(0);
}

function formatBytesPerYear(tbDecimal: number): string {
  if (!Number.isFinite(tbDecimal) || tbDecimal < 0) return '—';
  if (tbDecimal >= 1000) return `${(tbDecimal / 1000).toFixed(1)} PB`;
  return `${tbDecimal.toFixed(1)} TB`;
}

function ValuePill({ value, tone }: { value: string; tone: Tone }) {
  return (
    <span
      className={clsx(
        'inline-block min-w-[6rem] rounded-lg px-3 py-1.5 text-right font-mono text-lg font-bold tabular-nums shadow-sm ring-1 ring-inset',
        tones[tone]
      )}
    >
      {value}
    </span>
  );
}

export function BackOfEnvelopeCalculator() {
  const [dau, setDau] = useState(1_000_000);
  const [actionsPerDay, setActionsPerDay] = useState(10);
  const [peakMult, setPeakMult] = useState(3);
  const [kbPerRequest, setKbPerRequest] = useState(1);
  const [qpsPerServer, setQpsPerServer] = useState(1000);

  const derived = useMemo(() => {
    const dailyRequests = dau * actionsPerDay;
    const avgQps = dailyRequests / SECONDS_PER_DAY;
    const peakQps = avgQps * peakMult;
    const bytesPerRequest = kbPerRequest * 1000;
    const dailyBytes = dailyRequests * bytesPerRequest;
    const yearlyBytes = dailyBytes * 365;
    const yearlyTbDecimal = yearlyBytes / 1e12;
    const avgBps = avgQps * bytesPerRequest;
    const peakBps = peakQps * bytesPerRequest;
    const avgMbps = (avgBps * 8) / 1e6;
    const peakMbps = (peakBps * 8) / 1e6;
    const servers = Math.max(1, Math.ceil(peakQps / Math.max(1, qpsPerServer)));

    return {
      dailyRequests,
      avgQps,
      peakQps,
      yearlyTbDecimal,
      avgMbps,
      peakMbps,
      servers,
    };
  }, [dau, actionsPerDay, peakMult, kbPerRequest, qpsPerServer]);

  const rows: { label: string; value: string; hint?: string; tone: Tone }[] = [
    {
      label: 'Daily requests',
      value: formatCompact(derived.dailyRequests),
      hint: `${derived.dailyRequests.toLocaleString()} total`,
      tone: 'violet',
    },
    { label: 'Avg QPS', value: `${derived.avgQps.toFixed(0)}`, hint: '÷ 86,400 s/day', tone: 'sky' },
    {
      label: 'Peak QPS',
      value: `${derived.peakQps.toFixed(0)}`,
      hint: `× ${peakMult} peak multiplier`,
      tone: 'amber',
    },
    {
      label: 'Storage / year',
      value: formatBytesPerYear(derived.yearlyTbDecimal),
      hint: 'requests × size × 365',
      tone: 'emerald',
    },
    {
      label: 'Avg bandwidth',
      value: `${derived.avgMbps.toFixed(1)} Mbps`,
      hint: 'avg QPS × payload × 8 bits',
      tone: 'cyan',
    },
    {
      label: 'Peak bandwidth',
      value: `${derived.peakMbps.toFixed(1)} Mbps`,
      hint: 'peak QPS × payload',
      tone: 'rose',
    },
    {
      label: 'Servers (illustrative)',
      value: `${derived.servers}`,
      hint: `ceil(peak QPS ÷ ${qpsPerServer.toLocaleString()} per server)`,
      tone: 'indigo',
    },
  ];

  const formulas: { title: string; body: string; tone: Tone }[] = [
    { title: 'Avg QPS', body: '= daily requests ÷ 86,400', tone: 'sky' },
    { title: 'Peak QPS', body: '≈ avg QPS × peak multiplier', tone: 'amber' },
    { title: 'Storage / year', body: '≈ daily requests × bytes/request × 365', tone: 'emerald' },
    { title: 'Bandwidth (Mbps)', body: '≈ QPS × bytes × 8 ÷ 10⁶', tone: 'cyan' },
    { title: 'Servers', body: '≈ ⌈peak QPS ÷ per-server QPS⌉', tone: 'indigo' },
  ];

  return (
    <div className="not-prose my-10 rounded-2xl border border-sky-200/60 bg-gradient-to-b from-sky-50/40 to-background p-4 shadow-lg shadow-sky-900/5 dark:border-sky-800/40 dark:from-sky-950/25 dark:shadow-black/20 sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg" aria-hidden>
          🧮
        </span>
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">Back-of-envelope calculator</h3>
          <p className="text-sm text-muted-foreground">
            Each result uses a <strong className="text-foreground">color key</strong> so you can spot QPS vs storage vs bandwidth at a glance.
          </p>
        </div>
      </div>

      {/* Color legend */}
      <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-medium sm:text-xs">
        <span className={clsx('rounded-full px-2 py-0.5 ring-1 ring-inset', tones.violet)}>Volume</span>
        <span className={clsx('rounded-full px-2 py-0.5 ring-1 ring-inset', tones.sky)}>Avg QPS</span>
        <span className={clsx('rounded-full px-2 py-0.5 ring-1 ring-inset', tones.amber)}>Peak QPS</span>
        <span className={clsx('rounded-full px-2 py-0.5 ring-1 ring-inset', tones.emerald)}>Storage</span>
        <span className={clsx('rounded-full px-2 py-0.5 ring-1 ring-inset', tones.cyan)}>Avg BW</span>
        <span className={clsx('rounded-full px-2 py-0.5 ring-1 ring-inset', tones.rose)}>Peak BW</span>
        <span className={clsx('rounded-full px-2 py-0.5 ring-1 ring-inset', tones.indigo)}>Servers</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label
          className={clsx(
            'block rounded-lg border border-y border-r border-border border-l-4 bg-background/80 p-3 ring-0 transition-shadow focus-within:ring-2',
            inputAccent.violet
          )}
        >
          <span className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="h-2 w-2 shrink-0 rounded-full bg-violet-500" aria-hidden />
            Daily Active Users (DAU)
          </span>
          <input
            type="number"
            min={1}
            step={1000}
            value={dau}
            onChange={(e) => setDau(Math.max(1, Number(e.target.value) || 0))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
          <span className="mt-1 block font-mono text-xs font-semibold text-violet-700 dark:text-violet-300">
            {formatCompact(dau)} users
          </span>
        </label>

        <label
          className={clsx(
            'block rounded-lg border border-y border-r border-border border-l-4 bg-background/80 p-3 focus-within:ring-2',
            inputAccent.sky
          )}
        >
          <span className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" aria-hidden />
            Actions per user / day
          </span>
          <input
            type="number"
            min={1}
            step={1}
            value={actionsPerDay}
            onChange={(e) => setActionsPerDay(Math.max(1, Number(e.target.value) || 0))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>

        <label
          className={clsx(
            'block rounded-lg border border-y border-r border-border border-l-4 bg-background/80 p-3 focus-within:ring-2',
            inputAccent.amber
          )}
        >
          <span className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" aria-hidden />
            Peak multiplier
          </span>
          <input
            type="number"
            min={1}
            step={0.5}
            value={peakMult}
            onChange={(e) => setPeakMult(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
          <span className="mt-1 block font-mono text-xs font-semibold text-amber-800 dark:text-amber-200">
            Peak ≈ {peakMult}× avg QPS
          </span>
        </label>

        <label
          className={clsx(
            'block rounded-lg border border-y border-r border-border border-l-4 bg-background/80 p-3 focus-within:ring-2',
            inputAccent.emerald
          )}
        >
          <span className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
            Data per request (KB)
          </span>
          <input
            type="number"
            min={0.001}
            step={0.5}
            value={kbPerRequest}
            onChange={(e) => setKbPerRequest(Math.max(0.001, Number(e.target.value) || 0))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
          <span className="mt-1 block text-xs text-muted-foreground">1 KB = 10³ B (interview rounding)</span>
        </label>

        <label
          className={clsx(
            'block rounded-lg border border-y border-r border-border border-l-4 bg-background/80 p-3 focus-within:ring-2 sm:col-span-2 lg:col-span-1',
            inputAccent.indigo
          )}
        >
          <span className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" aria-hidden />
            Capacity per server (QPS)
          </span>
          <input
            type="number"
            min={1}
            step={100}
            value={qpsPerServer}
            onChange={(e) => setQpsPerServer(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </label>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-sky-200/50 dark:border-sky-800/40">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-sky-100/95 via-violet-100/40 to-cyan-100/50 dark:from-sky-900/50 dark:via-violet-950/30 dark:to-cyan-950/25">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-foreground">
                Metric
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-foreground">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className={clsx('border-t border-border/40', rowBg[r.tone])}>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <span
                      className={clsx('h-2.5 w-2.5 shrink-0 rounded-full', {
                        'bg-violet-500': r.tone === 'violet',
                        'bg-sky-500': r.tone === 'sky',
                        'bg-amber-500': r.tone === 'amber',
                        'bg-emerald-500': r.tone === 'emerald',
                        'bg-cyan-500': r.tone === 'cyan',
                        'bg-rose-500': r.tone === 'rose',
                        'bg-indigo-500': r.tone === 'indigo',
                      })}
                      aria-hidden
                    />
                    {r.label}
                  </span>
                  {r.hint ? (
                    <p className="mt-1 pl-4 text-xs text-muted-foreground">{r.hint}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-right align-middle">
                  <ValuePill value={r.value} tone={r.tone} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-muted/25 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Quick formulas (same colors)</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {formulas.map((f) => (
            <li
              key={f.title}
              className={clsx(
                'flex flex-col rounded-lg border border-transparent px-3 py-2 ring-1 ring-inset',
                tones[f.tone]
              )}
            >
              <span className="font-mono text-sm font-bold">{f.title}</span>
              <span className="font-mono text-xs opacity-90">{f.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
