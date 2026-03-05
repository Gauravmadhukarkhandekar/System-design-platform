'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

type Item = { id: string; text: string; level: number };

type Props = {
  items: Item[];
};

export function TableOfContents({ items }: Props) {
  const pathname = usePathname();

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
      <ul className="space-y-1 border-l border-border pl-4">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: (item.level - 1) * 12 }}
            className={clsx(
              'border-l-2 -ml-px pl-3 text-sm transition-colors',
              'border-transparent hover:border-primary/50'
            )}
          >
            <Link
              href={`${pathname}#${item.id}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
