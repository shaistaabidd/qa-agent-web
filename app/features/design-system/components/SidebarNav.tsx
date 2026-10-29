import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';

import { NAV_GROUPS } from '@/features/design-system/constants';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

export function SidebarNav() {
  const { pathname } = useLocation();
  const allIds = useMemo(
    () =>
      NAV_GROUPS.flatMap((group) => group.items.filter((item) => !item.to).map((item) => item.id)),
    [],
  );
  const [activeId, setActiveId] = useState<string>(allIds[0] ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [allIds]);

  return (
    <nav aria-label="Component sections" className="space-y-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.title} className="space-y-1.5">
          <Typography
            variant="caption"
            fontWeight="semibold"
            className="px-2 tracking-wide uppercase text-fg-secondary"
          >
            {group.title}
          </Typography>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.id}>
                {item.to ? (
                  <Link
                    className={cn(
                      'block rounded-md px-2 py-1 transition-colors',
                      pathname === item.to
                        ? 'bg-bg-muted font-medium text-fg-default'
                        : 'text-fg-secondary hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] hover:text-fg-default',
                    )}
                    to={item.to}
                  >
                    <Typography as="span" variant="body3">
                      {item.label}
                    </Typography>
                  </Link>
                ) : (
                  <a
                    className={cn(
                      'block rounded-md px-2 py-1 transition-colors',
                      activeId === item.id
                        ? 'bg-bg-muted font-medium text-fg-default'
                        : 'text-fg-secondary hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] hover:text-fg-default',
                    )}
                    href={`#${item.id}`}
                  >
                    <Typography as="span" variant="body3">
                      {item.label}
                    </Typography>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
