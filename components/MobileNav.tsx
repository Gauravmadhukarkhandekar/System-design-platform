'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/lib/navigation';
import { clsx } from 'clsx';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-20 z-40 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium md:hidden"
        aria-label="Open menu"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Menu
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-full w-64 overflow-y-auto border-r border-border bg-background py-6 pl-4 pr-2 md:hidden">
            <div className="flex items-center justify-between px-3 pb-4">
              <span className="font-semibold">Topics</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-2 text-muted-foreground hover:bg-accent"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-1">
              {navigation.map((section) => (
                <div key={section.href} className="space-y-1">
                  <Link
                    href={section.href}
                    onClick={() => setOpen(false)}
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
                      onClick={() => setOpen(false)}
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
        </>
      )}
    </>
  );
}
