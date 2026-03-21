import { clsx } from 'clsx';

function ArrowDown({ className }: { className?: string }) {
  return (
    <div className={clsx('flex justify-center py-1 text-sky-500 dark:text-sky-400', className)} aria-hidden>
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center px-1 text-sky-500 dark:text-sky-400', className)} aria-hidden>
      <svg className="h-6 w-6 shrink-0 rotate-[-90deg] sm:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </div>
  );
}

function StepCard({
  step,
  title,
  detail,
  variant = 'default',
  badge,
}: {
  step?: number;
  title: string;
  detail: string;
  variant?: 'default' | 'blocked' | 'fast' | 'queue' | 'later';
  /** Override step number (e.g. parallel path label) */
  badge?: string;
}) {
  const label = badge ?? (step != null ? String(step) : null);
  return (
    <div
      className={clsx(
        'relative w-full max-w-sm rounded-xl border px-4 py-3 text-center shadow-sm',
        variant === 'blocked' &&
          'border-amber-300/80 bg-amber-50/90 dark:border-amber-700/50 dark:bg-amber-950/35',
        variant === 'fast' && 'border-emerald-300/80 bg-emerald-50/90 dark:border-emerald-700/50 dark:bg-emerald-950/35',
        variant === 'queue' && 'border-violet-300/80 bg-violet-50/80 dark:border-violet-700/50 dark:bg-violet-950/30',
        variant === 'later' && 'border-sky-300/80 bg-sky-50/80 dark:border-sky-800/50 dark:bg-sky-950/30',
        variant === 'default' && 'border-sky-200/70 bg-white/90 dark:border-sky-800/50 dark:bg-sky-950/20'
      )}
    >
      {label ? (
        <span className="absolute -left-1 -top-2 flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-sky-600 px-1 text-xs font-bold text-white shadow dark:bg-sky-500">
          {label}
        </span>
      ) : null}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

export function SyncAsyncWorkflow() {
  return (
    <figure className="not-prose my-8">
      <figcaption className="sr-only">Workflow comparison: synchronous versus asynchronous request handling</figcaption>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Synchronous */}
        <div className="rounded-2xl border border-sky-200/60 bg-gradient-to-b from-sky-50/40 to-background p-5 dark:border-sky-800/40 dark:from-sky-950/25">
          <div className="mb-4 flex items-center gap-2 border-b border-sky-200/50 pb-3 dark:border-sky-800/50">
            <span className="text-lg" aria-hidden>
              ⏳
            </span>
            <div>
              <h4 className="text-base font-bold text-foreground">Synchronous workflow</h4>
              <p className="text-xs text-muted-foreground">Caller is blocked until the full operation completes.</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <StepCard
              step={1}
              title="Send request"
              detail="Client invokes the server (HTTP, RPC, etc.)"
            />
            <ArrowDown />
            <StepCard
              step={2}
              title="Server processes"
              detail="All work runs before any response is returned"
              variant="blocked"
            />
            <ArrowDown />
            <StepCard
              step={3}
              title="Complete response"
              detail="Client receives the final result — timeline is one straight line"
              variant="default"
            />
            <p className="mt-4 max-w-xs text-center text-xs font-medium text-amber-800 dark:text-amber-200">
              Caller idle on the wire: cannot do useful work in this thread until step 3.
            </p>
          </div>
        </div>

        {/* Asynchronous */}
        <div className="rounded-2xl border border-sky-200/60 bg-gradient-to-b from-cyan-50/30 to-background p-5 dark:border-sky-800/40 dark:from-cyan-950/15">
          <div className="mb-4 flex items-center gap-2 border-b border-sky-200/50 pb-3 dark:border-sky-800/50">
            <span className="text-lg" aria-hidden>
              🔀
            </span>
            <div>
              <h4 className="text-base font-bold text-foreground">Asynchronous workflow</h4>
              <p className="text-xs text-muted-foreground">Fast handoff; completion arrives on a separate beat.</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <StepCard
              step={1}
              title="Send request"
              detail="Same entry point — client still initiates work"
            />
            <ArrowDown />
            <StepCard
              step={2}
              title="Immediate acknowledgment"
              detail="202 Accepted, job id, or empty ack — caller unblocks quickly"
              variant="fast"
            />
            <ArrowDown />
            <p className="mb-2 w-full max-w-md text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              After ack — parallel paths
            </p>
            <div className="flex w-full max-w-lg flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:justify-center">
              <div className="flex flex-1 flex-col items-center">
                <span className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Caller path
                </span>
                <StepCard
                  badge="✓"
                  title="Caller continues"
                  detail="UI or thread takes other work; not blocked on the slow job"
                  variant="fast"
                />
              </div>
              <div className="hidden shrink-0 items-center self-center pt-8 sm:flex">
                <ArrowRight />
              </div>
              <ArrowDown className="sm:hidden" />
              <div className="flex flex-1 flex-col items-center">
                <span className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Background path
                </span>
                <StepCard
                  step={3}
                  title="Enqueue work"
                  detail="Broker / queue accepts the job durably"
                  variant="queue"
                />
                <ArrowDown />
                <StepCard
                  step={4}
                  title="Worker processes"
                  detail="Consumers run business logic off the hot path"
                  variant="queue"
                />
                <ArrowDown />
                <StepCard
                  step={5}
                  title="Deliver result"
                  detail="Webhook, event bus, poll, or push notification"
                  variant="later"
                />
              </div>
            </div>
            <p className="mt-4 max-w-xs text-center text-xs font-medium text-emerald-800 dark:text-emerald-200">
              Perceived latency is low at step 2; correctness still depends on retries & idempotency.
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}
