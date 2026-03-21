'use client';

import { useMemo, useState } from 'react';
import { clsx } from 'clsx';

const PRESETS = [
  { label: '99% (two nines)', value: 99 },
  { label: '99.9% (three nines)', value: 99.9 },
  { label: '99.95%', value: 99.95 },
  { label: '99.99% (four nines)', value: 99.99 },
  { label: '99.999% (five nines)', value: 99.999 },
] as const;

const INDUSTRY = [
  { name: 'AWS EC2', sla: '99.99%', note: 'Regional — see current SLA doc' },
  { name: 'Google Cloud', sla: '99.95%', note: 'Many products — varies by SKU' },
  { name: 'Stripe API', sla: '99.99%', note: 'Typical published target' },
  { name: 'Slack', sla: '99.99%', note: 'Illustrative — check vendor terms' },
] as const;

/** Minutes of downtime allowed in a period for given availability (decimal fraction of good time). */
function allowedDowntimeMinutes(periodMinutes: number, slaPercent: number): number {
  const badFrac = 1 - slaPercent / 100;
  return periodMinutes * badFrac;
}

function formatPeriod(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return '—';
  const days = minutes / 60 / 24;
  if (days >= 1) return `${days.toFixed(2)} days`;
  const hours = minutes / 60;
  if (hours >= 1) return `${hours.toFixed(2)} hours`;
  return `${minutes.toFixed(2)} min`;
}

const MIN_YEAR = 365 * 24 * 60;
const MIN_MONTH = 30 * 24 * 60;
const MIN_WEEK = 7 * 24 * 60;
const MIN_DAY = 24 * 60;

export function SlaUptimeCalculator() {
  const [slaPct, setSlaPct] = useState(99);
  const [usedThisMonthMin, setUsedThisMonthMin] = useState(0);

  const badFrac = 1 - slaPct / 100;

  const periods = useMemo(
    () => ({
      year: allowedDowntimeMinutes(MIN_YEAR, slaPct),
      month: allowedDowntimeMinutes(MIN_MONTH, slaPct),
      week: allowedDowntimeMinutes(MIN_WEEK, slaPct),
      day: allowedDowntimeMinutes(MIN_DAY, slaPct),
    }),
    [slaPct]
  );

  const monthAllowed = periods.month;
  const remainingMin = Math.max(0, monthAllowed - usedThisMonthMin);
  const pctUsed = monthAllowed > 0 ? Math.min(100, (usedThisMonthMin / monthAllowed) * 100) : 0;
  const pctRemaining = monthAllowed > 0 ? Math.max(0, (remainingMin / monthAllowed) * 100) : 0;
  const overBudget = usedThisMonthMin > monthAllowed;

  return (
    <div className="not-prose my-10 rounded-2xl border border-sky-200/60 bg-gradient-to-b from-sky-50/40 to-background p-4 shadow-lg dark:border-sky-800/40 dark:from-sky-950/25 sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg" aria-hidden>
          📐
        </span>
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">SLA & uptime calculator</h3>
          <p className="text-sm text-muted-foreground">
            Allowed downtime from a target availability % — plus a simple monthly error-budget view.
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setSlaPct(p.value)}
            className={clsx(
              'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm',
              Math.abs(slaPct - p.value) < 0.0001
                ? 'border-sky-500 bg-sky-500/20 text-sky-900 dark:text-sky-100'
                : 'border-border bg-background hover:bg-muted/60'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block rounded-xl border border-l-4 border-border border-l-violet-500 bg-background/80 p-3">
          <span className="text-sm font-medium text-foreground">Target SLA (%)</span>
          <input
            type="number"
            min={90}
            max={99.999}
            step={0.001}
            value={slaPct}
            onChange={(e) => setSlaPct(Math.min(99.999, Math.max(90, Number(e.target.value) || 99)))}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono tabular-nums"
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            Unavailability budget: {(badFrac * 100).toFixed(badFrac < 0.001 ? 4 : 2)}%
          </span>
        </label>
        <label className="block rounded-xl border border-l-4 border-border border-l-amber-500 bg-background/80 p-3">
          <span className="text-sm font-medium text-foreground">Downtime used this month (minutes)</span>
          <input
            type="number"
            min={0}
            step={1}
            value={usedThisMonthMin}
            onChange={(e) => setUsedThisMonthMin(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono tabular-nums"
          />
          <span className="mt-1 block text-xs text-muted-foreground">30-day window, illustrative</span>
        </label>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            ['Per year', periods.year, 'emerald'],
            ['Per month', periods.month, 'sky'],
            ['Per week', periods.week, 'cyan'],
            ['Per day', periods.day, 'violet'],
          ] as const
        ).map(([label, min, tone]) => (
          <div
            key={label}
            className={clsx(
              'rounded-xl border px-3 py-3 ring-1 ring-inset',
              tone === 'emerald' &&
                'border-emerald-300/50 bg-emerald-500/10 text-emerald-950 ring-emerald-500/20 dark:border-emerald-800/40 dark:bg-emerald-500/15 dark:text-emerald-50',
              tone === 'sky' &&
                'border-sky-300/50 bg-sky-500/10 text-sky-950 ring-sky-500/20 dark:border-sky-800/40 dark:bg-sky-500/15 dark:text-sky-50',
              tone === 'cyan' &&
                'border-cyan-300/50 bg-cyan-500/10 text-cyan-950 ring-cyan-500/20 dark:border-cyan-800/40 dark:bg-cyan-500/15 dark:text-cyan-50',
              tone === 'violet' &&
                'border-violet-300/50 bg-violet-500/10 text-violet-950 ring-violet-500/20 dark:border-violet-800/40 dark:bg-violet-500/15 dark:text-violet-50'
            )}
          >
            <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">{label}</p>
            <p className="mt-1 font-mono text-lg font-bold tabular-nums">{formatPeriod(min)}</p>
            <p className="mt-0.5 font-mono text-[10px] opacity-70">{min.toFixed(1)} min max</p>
          </div>
        ))}
      </div>

      <div
        className={clsx(
          'mt-6 rounded-xl border p-4 ring-1 ring-inset',
          overBudget
            ? 'border-rose-300/60 bg-rose-500/10 ring-rose-500/25 dark:border-rose-800/50'
            : 'border-indigo-300/50 bg-indigo-500/10 ring-indigo-500/20 dark:border-indigo-800/40'
        )}
      >
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Error budget (this month)</p>
        <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-foreground">
          {overBudget ? '0%' : `${pctRemaining.toFixed(1)}%`}{' '}
          <span className="text-base font-normal text-muted-foreground">remaining</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Used:{' '}
          <span className="font-mono font-semibold text-foreground">{usedThisMonthMin.toFixed(2)} min</span> (
          {pctUsed.toFixed(1)}% of monthly allowance)
        </p>
        <p className="text-sm text-muted-foreground">
          Remaining:{' '}
          <span className="font-mono font-semibold text-foreground">{formatPeriod(remainingMin)}</span>
        </p>
        {overBudget ? (
          <p className="mt-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
            Over monthly allowance — treat as budget exhausted for planning purposes.
          </p>
        ) : null}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <p className="bg-muted/50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Industry SLA reference (illustrative)
        </p>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-sky-100/80 dark:bg-sky-900/35">
              <th className="px-3 py-2 text-left text-xs font-semibold">Vendor / product</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Typical uptime figure</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {INDUSTRY.map((row) => (
              <tr key={row.name} className="border-b border-border/50 odd:bg-background even:bg-muted/20">
                <td className="px-3 py-2 font-medium">{row.name}</td>
                <td className="px-3 py-2 font-mono text-sky-800 dark:text-sky-200">{row.sla}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
