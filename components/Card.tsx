import Link from 'next/link';
import { clsx } from 'clsx';

type Props = {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
};

export function Card({ title, description, href, icon, className }: Props) {
  return (
    <Link
      href={href}
      className={clsx(
        'block rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-accent/50',
        className
      )}
    >
      {icon && <div className="mb-3 text-primary">{icon}</div>}
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
