type Props = {
  title?: string;
  children: React.ReactNode;
};

export function SummaryBox({ title = 'Summary', children }: Props) {
  return (
    <div className="not-prose my-8 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        {title}
      </h3>
      <div className="space-y-2 text-sm text-muted-foreground [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>p]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
