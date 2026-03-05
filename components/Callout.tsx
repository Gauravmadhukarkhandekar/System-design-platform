import { clsx } from 'clsx';

type Variant = 'info' | 'tip' | 'warning' | 'note';

const icons: Record<Variant, React.ReactNode> = {
  info: (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  tip: (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  note: (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
};

const styles: Record<Variant, string> = {
  info: 'border-blue-500/40 bg-blue-500/5 dark:bg-blue-500/10 text-blue-800 dark:text-blue-200 [&>div]:text-blue-700 dark:[&>div]:text-blue-300',
  tip: 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 [&>div]:text-emerald-700 dark:[&>div]:text-emerald-300',
  warning: 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10 text-amber-800 dark:text-amber-200 [&>div]:text-amber-700 dark:[&>div]:text-amber-300',
  note: 'border-violet-500/40 bg-violet-500/5 dark:bg-violet-500/10 text-violet-800 dark:text-violet-200 [&>div]:text-violet-700 dark:[&>div]:text-violet-300',
};

type Props = {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
};

export function Callout({ variant = 'note', title, children }: Props) {
  return (
    <div
      className={clsx(
        'not-prose my-6 flex gap-3 rounded-xl border-l-4 p-4 shadow-sm',
        styles[variant]
      )}
    >
      <span className="mt-0.5">{icons[variant]}</span>
      <div className="min-w-0 flex-1">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div className="text-sm [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:my-2">{children}</div>
      </div>
    </div>
  );
}
