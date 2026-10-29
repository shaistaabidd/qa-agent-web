import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { textareaMinHeightPx } from './constants';
import type { TextareaProps, TextareaSize } from './types';

type UseTextareaLayoutOptions = {
  autoHeight: boolean;
  size: TextareaSize;
  value: TextareaProps['value'];
};

export function useTextareaLayout({ autoHeight, size, value }: UseTextareaLayoutOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const syncHeight = useCallback(() => {
    const container = containerRef.current;
    const textarea = textareaRef.current;

    if (!container || !textarea || !autoHeight) {
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const previousHeight = textarea.style.height;

    textarea.style.height = '0px';

    const styles = getComputedStyle(container);
    const borderY =
      (Number.parseFloat(styles.borderTopWidth) || 0) +
      (Number.parseFloat(styles.borderBottomWidth) || 0);
    const contentHeight = textarea.scrollHeight + borderY;

    textarea.style.height = previousHeight;

    if (document.activeElement === textarea && selectionStart !== null && selectionEnd !== null) {
      textarea.setSelectionRange(selectionStart, selectionEnd);
    }

    container.style.height = `${Math.round(Math.max(contentHeight, textareaMinHeightPx[size]))}px`;
  }, [autoHeight, size]);

  useLayoutEffect(() => {
    if (!autoHeight) {
      return;
    }

    syncHeight();
  }, [autoHeight, syncHeight, value]);

  // An uncontrolled textarea changes value on form.reset() without an input event.
  useEffect(() => {
    const form = textareaRef.current?.form;

    if (!form || !autoHeight) {
      return;
    }

    let frame = 0;
    const onReset = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncHeight);
    };

    form.addEventListener('reset', onReset);

    return () => {
      cancelAnimationFrame(frame);
      form.removeEventListener('reset', onReset);
    };
  }, [autoHeight, syncHeight]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !autoHeight || typeof ResizeObserver === 'undefined') {
      return;
    }

    let lastWidth = container.clientWidth;
    const observer = new ResizeObserver(() => {
      if (container.clientWidth === lastWidth) {
        return;
      }

      lastWidth = container.clientWidth;
      syncHeight();
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [autoHeight, syncHeight]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || autoHeight) {
      return;
    }

    container.style.height = '';
  }, [autoHeight]);

  return { containerRef, syncHeight, textareaRef };
}
