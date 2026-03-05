'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/lib/navigation';
import { clsx } from 'clsx';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border py-6 pl-4 pr-2 md:block">
      <nav className="space-y-1">
        {navigation.map((section) => (
          <div key={section.href} className="space-y-1">
            <Link
              href={section.href}
              className={clsx(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === section.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {section.title}
            </Link>
            {section.items?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'block rounded-md px-3 py-1.5 pl-6 text-sm transition-colors',
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
