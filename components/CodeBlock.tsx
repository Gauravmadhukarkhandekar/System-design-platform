'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

type Props = {
  children: string;
  className?: string;
  title?: string;
};

export function CodeBlock({ children, className, title }: Props) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace(/^language-/, '') ?? 'text';

  const copy = () => {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-zinc-900 dark:bg-zinc-950 shadow-lg shadow-black/5 dark:shadow-black/20">
      {title && (
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-400">
          <span>{title}</span>
          <span className="font-mono text-xs uppercase tracking-wider">{lang}</span>
        </div>
      )}
      <div className="relative">
        <pre className={clsx('overflow-x-auto p-5 text-sm text-zinc-100', !title && 'pt-5')}>
          <code className={clsx(className, '!bg-transparent !p-0 !text-inherit')}>{children}</code>
        </pre>
        <button
          type="button"
          onClick={copy}
          className="absolute right-3 top-3 rounded-md border border-white/10 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
