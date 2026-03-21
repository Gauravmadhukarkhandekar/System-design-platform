type Props = {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: string[][];
  /** Highlight last column (e.g. targets / thresholds) */
  accentLastColumn?: boolean;
  /** Tighter padding and type — use for wide / dense tables (e.g. nines). */
  compact?: boolean;
};

export function MetricTable({
  title,
  subtitle,
  columns,
  rows,
  accentLastColumn,
  compact,
}: Props) {
  const cellPad = compact ? 'px-3 py-2 sm:px-3.5 sm:py-2.5' : 'px-4 py-3.5';
  const headPad = compact ? 'px-3 py-2 sm:px-3.5 sm:py-2.5' : 'px-4 py-3.5';
  const headText = compact
    ? 'text-[10px] sm:text-[11px]'
    : 'text-[11px]';

  /** 4+ columns: fixed layout + column hints so downtime cells stay scannable on narrow viewports. */
  const useFixedLayout = columns.length >= 4;

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-sky-200/60 bg-gradient-to-b from-sky-50/40 via-background to-background shadow-lg shadow-sky-900/5 dark:border-sky-800/40 dark:from-sky-950/25 dark:shadow-black/20">
      <figcaption className="border-b border-sky-200/50 bg-gradient-to-r from-sky-500/10 via-cyan-500/5 to-transparent px-5 py-4 dark:border-sky-800/50 dark:from-sky-600/15">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:bg-sky-400/20 dark:text-sky-300">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </span>
          <div>
            <h4 className="text-base font-bold tracking-tight text-foreground">{title}</h4>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>
      </figcaption>

      <div className="overflow-x-auto px-1 pb-1">
        <table
          className={`w-full border-collapse ${compact ? 'text-[13px] sm:text-sm' : 'text-sm'} min-w-0 max-w-full ${useFixedLayout ? 'table-fixed' : 'min-w-[min(100%,36rem)]'}`}
        >
          {useFixedLayout ? (
            <colgroup>
              {columns.map((_, i) => (
                <col
                  key={i}
                  style={{
                    width:
                      i === 0
                        ? '20%'
                        : i === columns.length - 1
                          ? '26%'
                          : `${54 / Math.max(1, columns.length - 2)}%`,
                  }}
                />
              ))}
            </colgroup>
          ) : null}
          <thead>
            <tr className="bg-gradient-to-r from-sky-100/90 via-sky-50/80 to-cyan-50/60 dark:from-sky-900/50 dark:via-sky-950/40 dark:to-cyan-950/30">
              {columns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`${headPad} ${headText} border-b border-sky-200/70 text-left font-bold uppercase tracking-widest text-sky-900 dark:border-sky-700/50 dark:text-sky-100`}
                >
                  {col || '\u00a0'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="border-b border-border/40 transition-colors hover:bg-sky-100/40 dark:hover:bg-sky-950/35 last:border-b-0 odd:bg-background/80 even:bg-muted/25"
              >
                {row.map((cell, ci) => {
                  const isLast = ci === row.length - 1;
                  const cellClass = `${cellPad} min-w-0 align-top break-words leading-relaxed ${
                    ci === 0
                      ? 'font-semibold text-foreground'
                      : accentLastColumn && isLast
                        ? 'font-medium text-sky-800 dark:text-sky-200'
                        : 'text-muted-foreground'
                  }`;
                  if (ci === 0) {
                    return (
                      <th key={ci} scope="row" className={cellClass}>
                        {cell}
                      </th>
                    );
                  }
                  return (
                    <td key={ci} className={cellClass}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
