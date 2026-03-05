'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

type Props = {
  chart: string;
  title?: string;
};

export function DiagramBlock({ chart, title }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    if (!ref.current || !chart) return;
    setError(null);
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      })
      .catch((e) => setError(e.message ?? 'Diagram failed to render'));
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
