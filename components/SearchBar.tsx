'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { navigation } from '@/lib/navigation';
import { clsx } from 'clsx';

type SearchItem = { title: string; href: string; section: string };

function flattenNav(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const section of navigation) {
    if (section.items) {
      for (const item of section.items) {
        items.push({ title: item.title, href: item.href, section: section.title });
      }
    }
  }
  return items;
}

const allItems = flattenNav();

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const normalized = query.trim().toLowerCase();
  const results = normalized.length >= 2
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(normalized) ||
          item.section.toLowerCase().includes(normalized)
      ).slice(0, 8)
    : [];

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => (s < results.length - 1 ? s + 1 : 0));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => (s > 0 ? s - 1 : results.length - 1));
      }
      if (e.key === 'Enter' && results[selected]) {
        e.preventDefault();
        router.push(results[selected].href);
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, results, selected, router]);

  return (
    <div ref={ref} className="relative hidden md:block">
      <div className="flex items-center rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">
        <span className="text-muted-foreground mr-2">⌘K</span>
        <input
          type="search"
          placeholder="Search topics..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-40 bg-transparent outline-none placeholder:text-muted-foreground md:w-56"
        />
      </div>
      {open && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-auto rounded-lg border border-border bg-background py-1 shadow-lg">
          {results.map((item, i) => (
            <li key={item.href}>
              <button
                type="button"
                onClick={() => {
                  router.push(item.href);
                  setOpen(false);
                  setQuery('');
                }}
                className={clsx(
                  'flex w-full flex-col items-start px-4 py-2 text-left text-sm',
                  i === selected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                )}
              >
                <span className="font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.section}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
