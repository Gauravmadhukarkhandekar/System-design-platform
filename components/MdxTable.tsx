import { clsx } from 'clsx';
import type { TableHTMLAttributes } from 'react';

/** Wraps GFM markdown tables: horizontal scroll, sky-themed rows, readable on narrow screens. */
export function MdxTable({
  children,
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="not-prose my-8 w-full overflow-x-auto rounded-2xl border border-sky-200/50 shadow-sm dark:border-sky-800/40">
      <table
        {...props}
        className={clsx(
          'w-full min-w-[min(100%,18rem)] max-w-full border-collapse text-left text-sm',
          '[&_thead_tr]:bg-sky-100/85 [&_thead_tr]:dark:bg-sky-900/35',
          '[&_th]:border-b [&_th]:border-sky-200/60 [&_th]:px-3 [&_th]:py-2.5 sm:px-4 sm:py-3',
          '[&_th]:text-left [&_th]:text-[11px] [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-sky-950 dark:[&_th]:border-sky-800/50 dark:[&_th]:text-sky-50',
          '[&_tbody_tr]:border-b [&_tbody_tr]:border-border/50 [&_tbody_tr:last-child]:border-b-0',
          '[&_tbody_tr:nth-child(odd)]:bg-background [&_tbody_tr:nth-child(even)]:bg-muted/20',
          '[&_td]:px-3 [&_td]:py-2.5 sm:px-4 sm:py-3 [&_td]:align-top [&_td]:break-words [&_td]:text-foreground/90',
          '[&_tbody_th]:px-3 [&_tbody_th]:py-2.5 sm:px-4 sm:py-3 [&_tbody_th]:align-top [&_tbody_th]:break-words [&_tbody_th]:font-semibold [&_tbody_th]:text-foreground',
          className
        )}
      >
        {children}
      </table>
    </div>
  );
}
