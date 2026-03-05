'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { SearchBar } from './SearchBar';

export function Navbar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = typeof window !== 'undefined' && (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches));
    document.documentElement.classList.toggle('dark', isDark);
    setDark(isDark);
  }, []);

  const toggleDark = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    if (typeof window !== 'undefined') localStorage.setItem('theme', next ? 'dark' : 'light');
    setDark(next);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-primary">System Design</span>
          <span className="text-muted-foreground text-sm font-normal hidden sm:inline">Learning Platform</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={clsx(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            Home
          </Link>
          <SearchBar />
          <Link
            href="/learn/fundamentals/what-is-system-design"
            className={clsx(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors hidden sm:block',
              pathname?.startsWith('/learn') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            Learn
          </Link>
          <Link
            href="/learn/case-studies/design-url-shortener"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground hidden md:block"
          >
            Case Studies
          </Link>

          <button
            type="button"
            onClick={toggleDark}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
