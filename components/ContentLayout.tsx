import { Sidebar } from './Sidebar';
import { TableOfContents } from './TableOfContents';
import { MobileNav } from './MobileNav';

type Props = {
  children: React.ReactNode;
  toc?: { id: string; text: string; level: number }[];
};

export function ContentLayout({ children, toc = [] }: Props) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <MobileNav />
      <Sidebar />
      <main className="min-w-0 flex-1 py-8 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
      {toc.length > 0 && (
        <aside className="hidden xl:block w-56 shrink-0 py-8 pr-6">
          <TableOfContents items={toc} />
        </aside>
      )}
    </div>
  );
}
