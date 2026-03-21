'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

export function CapacityHeadroomBar() {
  const [util, setUtil] = useState(65);

  const zone =
    util < 70 ? 'comfortable' : util < 85 ? 'tight' : util < 95 ? 'risky' : 'critical';

  const zoneLabel = {
    comfortable: 'Comfortable headroom (~20–40% free)',
    tight: 'Tight — plan scaling soon',
    risky: 'Risky — spikes may cause saturation',
    critical: 'Critical — add capacity or shed load now',
  }[zone];

  const zoneColor = {
    comfortable: 'text-emerald-700 dark:text-emerald-300',
    tight: 'text-amber-700 dark:text-amber-300',
    risky: 'text-orange-700 dark:text-orange-300',
    critical: 'text-rose-700 dark:text-rose-300',
  }[zone];

  return (
    <div className="not-prose my-10 rounded-2xl border border-sky-200/60 bg-gradient-to-b from-sky-50/35 to-background p-4 shadow-lg dark:border-sky-800/40 dark:from-sky-950/25 sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg" aria-hidden>
          📊
        </span>
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">The ~80% rule (interactive)</h3>
          <p className="text-sm text-muted-foreground">
            Drag utilization — plan to stay out of the red so spikes and failures have room to breathe.
          </p>
        </div>
      </div>

      <label className="mt-4 block text-sm font-medium text-foreground">
        Simulated average utilization:{' '}
        <span className="font-mono tabular-nums text-sky-700 dark:text-sky-300">{util}%</span>
        <input
          type="range"
          min={20}
          max={99}
          value={util}
          onChange={(e) => setUtil(Number(e.target.value))}
          className="mt-2 w-full accent-sky-600"
          aria-valuemin={20}
          aria-valuemax={99}
          aria-valuenow={util}
        />
      </label>

      <div className="relative mt-4 h-10 w-full overflow-hidden rounded-xl border border-border shadow-inner">
        <div className="absolute inset-y-0 left-0 w-[70%] bg-gradient-to-r from-emerald-400/90 to-emerald-500/70 dark:from-emerald-600/80 dark:to-emerald-700/60" />
        <div className="absolute inset-y-0 left-[70%] w-[15%] bg-gradient-to-r from-amber-400/85 to-amber-500/70 dark:from-amber-600/75 dark:to-amber-700/55" />
        <div className="absolute inset-y-0 left-[85%] w-[10%] bg-gradient-to-r from-orange-400/80 to-orange-500/65 dark:from-orange-600/70 dark:to-orange-700/50" />
        <div className="absolute inset-y-0 left-[95%] w-[5%] bg-gradient-to-r from-rose-500/85 to-rose-600/75 dark:from-rose-600/80 dark:to-rose-700/65" />
        <div
          className="absolute top-0 h-full w-1 -translate-x-1/2 bg-foreground shadow-md ring-2 ring-background"
          style={{ left: `${util}%` }}
          aria-hidden
        />
      </div>
      <div className="mt-2 flex flex-wrap justify-between gap-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
        <span className="text-emerald-700 dark:text-emerald-400">0–70% target band</span>
        <span className="text-amber-700 dark:text-amber-400">70–85%</span>
        <span className="text-orange-700 dark:text-orange-400">85–95%</span>
        <span className="text-rose-700 dark:text-rose-400">95%+</span>
      </div>

      <p className={clsx('mt-4 text-sm font-semibold', zoneColor)}>{zoneLabel}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Illustrative bands only — your SLOs, autoscaling speed, and burst shape matter more than a single percentage.
      </p>
    </div>
  );
}
