'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = [
    { href: '/', label: 'Home' },
    ...segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return { href, label };
    }),
  ];

  return (
    <nav aria-label="Breadcrumb">
      <div className="container py-2 flex flex-wrap items-center gap-1 text-sm bg-muted text-muted-foreground">
        {crumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            <Link
              href={crumb.href}
              className="text-muted-foreground hover:text-primary hover:underline transition-colors"
            >
              {crumb.label}
            </Link>
          </span>
        ))}
      </div>
    </nav>
  );
}
