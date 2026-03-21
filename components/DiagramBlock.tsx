'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  chart: string;
  title?: string;
};

export function DiagramBlock({ chart, title }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current || !chart) return;

    let cancelled = false;
    setError(null);
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;

    void (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
          securityLevel: 'loose',
        });
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Diagram failed to render';
        if (!cancelled) setError(msg);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-muted/40 dark:bg-muted/20 p-6 shadow-sm">
      {title && (
        <p className="mb-4 text-sm font-medium text-muted-foreground border-b border-border pb-3">
          {title}
        </p>
      )}
      <div ref={ref} className="flex justify-center overflow-x-auto rounded-lg [&>svg]:max-w-full [&>svg]:min-w-[280px]" />
      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
