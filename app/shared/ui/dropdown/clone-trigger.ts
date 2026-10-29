import {
  cloneElement,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type Ref,
} from 'react';

export type TriggerElement = ReactElement<{
  'aria-controls'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: string;
  'aria-label'?: string;
  disabled?: boolean;
  id?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  ref?: Ref<HTMLButtonElement>;
}>;

type CloneTriggerOptions = {
  ariaLabel?: string;
  disabled?: boolean;
  id: string;
  isOpen: boolean;
  listId: string;
  loading: boolean;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onToggle: () => void;
  setNode: (node: HTMLButtonElement | null) => void;
};

/** Wires a consumer-supplied trigger element into the dropdown, keeping the consumer's own handlers. */
export function cloneTrigger(trigger: TriggerElement, options: CloneTriggerOptions) {
  const { ariaLabel, disabled, id, isOpen, listId, loading, onKeyDown, onToggle, setNode } =
    options;

  return cloneElement(trigger, {
    'aria-controls': listId,
    'aria-expanded': isOpen,
    'aria-haspopup': 'listbox',
    'aria-label': ariaLabel ?? trigger.props['aria-label'],
    disabled,
    id,
    onClick: (event: MouseEvent<HTMLElement>) => {
      trigger.props.onClick?.(event);

      if (event.defaultPrevented || disabled || loading) {
        return;
      }

      onToggle();
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      trigger.props.onKeyDown?.(event);

      if (!event.defaultPrevented) {
        onKeyDown(event);
      }
    },
    ref: setNode,
  });
}
