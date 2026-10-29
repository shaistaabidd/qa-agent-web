import {
  type FocusEventHandler,
  type ReactNode,
  type RefObject,
  type UIEvent,
  useLayoutEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

import { useMounted } from '@/shared/lib/use-mounted';

import { MENU_VIEWPORT_PADDING } from './constants';
import {
  getMenuClassName,
  getMenuListClassName,
  getMenuPositionStyle,
  shouldLoadMore,
} from './utils';

export function DropdownMenu({
  anchorRef,
  children,
  contentWidth,
  fitContent = false,
  header,
  id,
  listAs = 'ul',
  loadingMore = false,
  menuRef,
  minWidth,
  multiple = false,
  onBlur,
  onLoadMore,
}: {
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  contentWidth?: number;
  fitContent?: boolean;
  header?: ReactNode;
  id: string;
  listAs?: 'div' | 'ul';
  loadingMore?: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  minWidth?: number;
  multiple?: boolean;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  onLoadMore?: () => void;
}) {
  const loadMoreLock = useRef(false);
  const mounted = useMounted();

  useLayoutEffect(() => {
    if (!mounted) {
      return;
    }

    function updatePosition(event?: Event) {
      const menu = menuRef.current;
      if (!menu) {
        return;
      }

      if (event?.target instanceof Node && menu.contains(event.target)) {
        return;
      }

      const next = getMenuPositionStyle(anchorRef.current, {
        fitContent: fitContent && contentWidth == null,
        minWidth,
        width: contentWidth,
      });
      if (!next) {
        return;
      }

      menu.style.top = next.top != null ? String(next.top) : 'auto';
      menu.style.bottom = next.bottom != null ? String(next.bottom) : 'auto';
      menu.style.left = next.left != null ? String(next.left) : '';
      menu.style.width = next.width != null ? String(next.width) : '';
      menu.style.minWidth = next.minWidth != null ? String(next.minWidth) : '';
      menu.style.maxWidth = next.maxWidth != null ? String(next.maxWidth) : '';
      menu.style.maxHeight = next.maxHeight != null ? String(next.maxHeight) : '';

      if (fitContent && contentWidth == null) {
        const menuWidth = menu.getBoundingClientRect().width;
        const maxLeft = window.innerWidth - menuWidth - MENU_VIEWPORT_PADDING;
        const currentLeft = menu.getBoundingClientRect().left;
        if (currentLeft > maxLeft) {
          menu.style.left = `${Math.max(MENU_VIEWPORT_PADDING, maxLeft)}px`;
        }
      }
    }

    let frame = 0;

    function schedulePosition(event?: Event) {
      if (event?.target instanceof Node && menuRef.current?.contains(event.target)) {
        return;
      }

      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updatePosition();
      });
    }

    updatePosition();
    window.addEventListener('resize', schedulePosition);
    document.addEventListener('scroll', schedulePosition, { capture: true, passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedulePosition);
      document.removeEventListener('scroll', schedulePosition, { capture: true });
    };
  }, [anchorRef, contentWidth, fitContent, menuRef, minWidth, mounted]);

  function handleScroll(event: UIEvent<HTMLElement>) {
    if (!onLoadMore || loadingMore || loadMoreLock.current) {
      return;
    }

    if (!shouldLoadMore(event.currentTarget)) {
      return;
    }

    loadMoreLock.current = true;
    onLoadMore();
    queueMicrotask(() => {
      loadMoreLock.current = false;
    });
  }

  if (!mounted) {
    return null;
  }

  const List = listAs;

  return createPortal(
    <div
      className={getMenuClassName()}
      data-slot="dropdown-menu"
      onBlur={onBlur}
      ref={menuRef}
      role="presentation"
    >
      {header ? (
        <div className="shrink-0 px-[4px] pt-[4px]" data-slot="dropdown-menu-header">
          {header}
        </div>
      ) : null}
      <List
        aria-busy={loadingMore || undefined}
        aria-multiselectable={multiple || undefined}
        className={getMenuListClassName(header ? 'pt-0' : undefined)}
        data-loading-more={loadingMore || undefined}
        data-slot="dropdown-menu-list"
        id={id}
        onScroll={handleScroll}
        role="listbox"
      >
        {children}
      </List>
    </div>,
    document.body,
  );
}
