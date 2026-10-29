import { Slot } from 'radix-ui';
import {
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { Typography } from '@/shared/ui/Typography';

import { DEFAULT_SIDE_OFFSET } from './constants';
import type {
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipSide,
  TooltipTriggerProps,
} from './types';
import {
  getProviderDelay,
  TooltipContext,
  TooltipDelayContext,
  useMounted,
  useTooltip,
  useTooltipContext,
} from './use-tooltip';
import {
  composeEventHandlers,
  getArrowClassName,
  getBodyClassName,
  getContentClassName,
  getTooltipCoords,
} from './utils';

export function TooltipProvider({ children, delayDuration }: TooltipProviderProps) {
  return (
    <TooltipDelayContext.Provider value={getProviderDelay({ delayDuration })}>
      {children}
    </TooltipDelayContext.Provider>
  );
}

export function Tooltip({
  children,
  content,
  hideArrow,
  side,
  sideOffset,
  ...props
}: TooltipProps) {
  const context = useTooltip(props);

  return (
    <TooltipContext.Provider value={context}>
      {content === undefined ? (
        children
      ) : (
        <TooltipSimple content={content} hideArrow={hideArrow} side={side} sideOffset={sideOffset}>
          {children}
        </TooltipSimple>
      )}
    </TooltipContext.Provider>
  );
}

function TooltipSimple({
  children,
  content,
  hideArrow,
  side,
  sideOffset,
}: {
  children: ReactNode;
  content: ReactNode;
  hideArrow?: boolean;
  side?: TooltipSide;
  sideOffset?: number;
}) {
  return (
    <>
      {canWrapAsChild(children) ? (
        <TooltipTrigger asChild>{children}</TooltipTrigger>
      ) : (
        <TooltipTrigger>{children}</TooltipTrigger>
      )}
      <TooltipContent hideArrow={hideArrow} side={side} sideOffset={sideOffset}>
        {content}
      </TooltipContent>
    </>
  );
}

function canWrapAsChild(children: ReactNode): children is ReactElement {
  return isValidElement(children) && children.type !== Fragment;
}

export function TooltipTrigger({
  asChild = false,
  children,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  ...props
}: TooltipTriggerProps) {
  const { contentId, disabled, handleClose, handleOpen, open, triggerRef } = useTooltipContext();

  const triggerProps = {
    'aria-describedby': open ? contentId : undefined,
    'data-slot': 'tooltip-trigger',
    onBlur: composeEventHandlers(onBlur, handleClose),
    onFocus: composeEventHandlers(onFocus, handleOpen),
    onMouseEnter: composeEventHandlers(onMouseEnter, handleOpen),
    onMouseLeave: composeEventHandlers(onMouseLeave, handleClose),
  };

  if (asChild) {
    return (
      <Slot.Root {...props} {...triggerProps} ref={triggerRef}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      disabled={disabled}
      ref={triggerRef as Ref<HTMLButtonElement>}
      type="button"
      {...props}
      {...triggerProps}
    >
      {children}
    </button>
  );
}

export function TooltipContent({
  children,
  className,
  hideArrow = false,
  onMouseEnter,
  onMouseLeave,
  side = 'top',
  sideOffset = DEFAULT_SIDE_OFFSET,
  ...props
}: TooltipContentProps) {
  const { contentId, handleClose, handleOpen, open, triggerRef } = useTooltipContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const [coords, setCoords] = useState<{
    left: number;
    side: TooltipSide;
    top: number;
  } | null>(null);
  const activeCoords = open ? coords : null;
  const resolvedSide = activeCoords?.side ?? side;

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    let frame = 0;

    function updatePosition() {
      const trigger = triggerRef.current;
      const content = contentRef.current;

      if (!trigger || !content) {
        return;
      }

      setCoords(
        getTooltipCoords(
          trigger.getBoundingClientRect(),
          {
            height: content.offsetHeight,
            width: content.offsetWidth,
          },
          side,
          sideOffset,
        ),
      );
    }

    function schedulePosition() {
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
    document.addEventListener('scroll', schedulePosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedulePosition);
      document.removeEventListener('scroll', schedulePosition, true);
    };
  }, [open, resolvedSide, side, sideOffset, triggerRef]);

  if (!mounted || !open) {
    return null;
  }

  const showLeadingArrow = !hideArrow && (resolvedSide === 'bottom' || resolvedSide === 'right');
  const showTrailingArrow = !hideArrow && (resolvedSide === 'top' || resolvedSide === 'left');

  return createPortal(
    <div
      {...props}
      className={getContentClassName(resolvedSide, className)}
      data-side={resolvedSide}
      data-slot="tooltip-content"
      id={contentId}
      onMouseEnter={composeEventHandlers(onMouseEnter, handleOpen)}
      onMouseLeave={composeEventHandlers(onMouseLeave, handleClose)}
      ref={contentRef}
      role="tooltip"
      style={{
        left: activeCoords?.left ?? 0,
        position: 'fixed',
        top: activeCoords?.top ?? 0,
        visibility: activeCoords ? 'visible' : 'hidden',
      }}
    >
      {showLeadingArrow ? <TooltipArrow side={resolvedSide} /> : null}
      <div className={getBodyClassName()} data-slot="tooltip-body">
        <Typography fontWeight="medium" variant="caption">
          {children}
        </Typography>
      </div>
      {showTrailingArrow ? <TooltipArrow side={resolvedSide} /> : null}
    </div>,
    document.body,
  );
}

function TooltipArrow({ side }: { side: TooltipSide }) {
  return <span aria-hidden className={getArrowClassName(side)} data-slot="tooltip-arrow" />;
}

export type {
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipSide,
  TooltipTriggerProps,
} from './types';
