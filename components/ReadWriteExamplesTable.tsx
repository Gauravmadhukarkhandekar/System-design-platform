type ExampleRow = {
  system: string;
  /** Shown in the ratio column, e.g. "1000 : 1 (or higher)" */
  ratioLabel: string;
  reads: number;
  writes: number;
  /** Context line under the horizontal bar */
  caption: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  rows: ExampleRow[];
};

function MiniBar({
  reads,
  writes,
  ariaLabel,
  caption,
}: {
  reads: number;
  writes: number;
  ariaLabel: string;
  caption: string;
}) {
  const total = reads + writes;
  const readPct = total > 0 ? (reads / total) * 100 : 50;
  const writePct = total > 0 ? (writes / total) * 100 : 50;
  const ratio = `${reads} : ${writes}`;

  return (
    <div className="min-w-[10rem] max-w-lg">
      <div
        className="flex h-3 w-full overflow-hidden rounded-md bg-muted/80 ring-1 ring-border/40"
        role="img"
        aria-label={`${ariaLabel}: read weight ${readPct.toFixed(1)}%, write weight ${writePct.toFixed(1)}% from ratio ${ratio}`}
      >
        <span
          className="h-full bg-sky-500 dark:bg-sky-400"
          style={{ width: `${readPct}%` }}
          title={`Read share ${readPct.toFixed(1)}%`}
        />
        <span
          className="h-full bg-amber-500 dark:bg-amber-400"
          style={{ width: `${writePct}%` }}
          title={`Write share ${writePct.toFixed(1)}%`}
        />
      </div>
      <p className="mt-2 text-xs leading-snug text-muted-foreground">{caption}</p>
    </div>
  );
}

/**
 * Read/write ratio examples: third column is horizontal stacked bars (sky = read, amber = write)
 * plus a short caption — replaces plain-text “notes” with the bar as the primary visual.
 */
export function ReadWriteExamplesTable({ title, subtitle, rows }: Props) {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-sky-200/60 bg-gradient-to-b from-sky-50/40 via-background to-background shadow-lg shadow-sky-900/5 dark:border-sky-800/40 dark:from-sky-950/25 dark:shadow-black/20">
      {(title || subtitle) && (
        <figcaption className="border-b border-sky-200/50 bg-gradient-to-r from-sky-500/10 via-cyan-500/5 to-transparent px-5 py-4 dark:border-sky-800/50 dark:from-sky-600/15">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:bg-sky-400/20 dark:text-sky-300">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              <div>
                {title ? (
                  <h4 className="text-base font-bold tracking-tight text-foreground">{title}</h4>
                ) : null}
                {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-sm bg-sky-500 dark:bg-sky-400" aria-hidden />
                Read weight
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-sm bg-amber-500 dark:bg-amber-400" aria-hidden />
                Write weight
              </span>
            </div>
          </div>
        </figcaption>
      )}

      <div className="overflow-x-auto px-1 pb-1">
        <table className="w-full min-w-[min(100%,42rem)] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-sky-100/90 via-sky-50/80 to-cyan-50/60 dark:from-sky-900/50 dark:via-sky-950/40 dark:to-cyan-950/30">
              <th
                scope="col"
                className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-sky-900 dark:text-sky-100"
              >
                System
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-sky-900 dark:text-sky-100"
              >
                Rough reads : writes
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-sky-900 dark:text-sky-100"
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.system}
                className="border-b border-border/40 transition-colors odd:bg-background/80 even:bg-muted/25 last:border-b-0 hover:bg-sky-100/40 dark:hover:bg-sky-950/35"
              >
                <th scope="row" className="px-4 py-3.5 align-top font-semibold text-foreground">
                  {row.system}
                </th>
                <td className="px-4 py-3.5 align-top font-mono text-xs tabular-nums text-muted-foreground">
                  {row.ratioLabel}
                </td>
                <td className="px-4 py-3.5 align-top text-muted-foreground">
                  <MiniBar
                    reads={row.reads}
                    writes={row.writes}
                    ariaLabel={row.system}
                    caption={row.caption}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
