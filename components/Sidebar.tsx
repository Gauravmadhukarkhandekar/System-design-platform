'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation, type NavItem } from '@/lib/navigation';
import { clsx } from 'clsx';

function SidebarItem({ item, pathname }: { item: NavItem; pathname: string | null }) {
  const hasSubItems = item.items && item.items.length > 0;

  if (hasSubItems) {
    return (
      <div key={item.title} className="space-y-0.5">
        {item.href ? (
          <Link
            href={item.href}
            className={clsx(
              'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {item.title}
          </Link>
        ) : (
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {item.title}
          </p>
        )}
        <div className="pl-2">
          {item.items?.map((sub) => (
            <SidebarItem key={sub.href || sub.title} item={sub} pathname={pathname} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      key={item.href}
      href={item.href}
      className={clsx(
        'block rounded-md px-3 py-1.5 pl-6 text-sm transition-colors',
        pathname === item.href ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {item.title}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border py-6 pl-4 pr-2 md:block">
      <nav className="space-y-1">
        <div className="mb-4 flex gap-1 rounded-lg bg-sky-100 dark:bg-sky-900/40 p-1">
          <Link
            href="/learn/hld"
            className={clsx(
              'flex-1 rounded-md px-3 py-2 text-center text-sm font-medium transition-colors',
              pathname?.startsWith('/learn/hld') ? 'bg-sky-400 text-white dark:bg-sky-500 dark:text-white shadow-sm' : 'text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800 hover:text-sky-900 dark:hover:text-white'
            )}
          >
            HLD
          </Link>
          <Link
            href="/learn/lld"
            className={clsx(
              'flex-1 rounded-md px-3 py-2 text-center text-sm font-medium transition-colors',
              pathname?.startsWith('/learn/lld') ? 'bg-sky-400 text-white dark:bg-sky-500 dark:text-white shadow-sm' : 'text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800 hover:text-sky-900 dark:hover:text-white'
            )}
          >
            LLD
          </Link>
        </div>
        {navigation.map((section) => (
          <div key={section.href} className="space-y-0.5">
            <Link
              href={section.href}
              className={clsx(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === section.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {section.title}
            </Link>
            {section.items?.map((item) => (
              <div key={item.title} className="pl-2">
                <SidebarItem item={item} pathname={pathname} />
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
