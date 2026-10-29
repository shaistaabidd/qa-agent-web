import { useId } from 'react';

import { cn } from '@/shared/lib/utils';

import { InputHelper } from '../input/input-helper';
import { fieldClass } from './constants';
import type { TextareaProps } from './types';
import { useTextareaLayout } from './useTextareaLayout';
import {
  focusTextareaFromContainer,
  getContainerClassName,
  getControlClassName,
  isInvalidValue,
  mergeRefs,
} from './utils';

export function Textarea({
  autoHeight = false,
  className,
  disabled,
  error = false,
  helperIcon,
  helperText,
  id,
  onInput,
  ref,
  required,
  resize = false,
  size = 'lg',
  value,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const helperId = `${textareaId}-helper`;
  const isInvalid = isInvalidValue(error, ariaInvalid);
  const describedBy =
    [helperText ? helperId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;
  const { containerRef, syncHeight, textareaRef } = useTextareaLayout({
    autoHeight: autoHeight && !resize,
    size,
    value,
  });

  return (
    <div
      className={cn(fieldClass, resize && '@container min-w-40', className)}
      data-slot="textarea-field"
      data-size={size}
    >
      <div
        className={getContainerClassName(size, { autoHeight, resize })}
        data-invalid={isInvalid || undefined}
        data-slot="textarea-container"
        onMouseDown={resize ? undefined : focusTextareaFromContainer}
        ref={containerRef}
      >
        <textarea
          {...props}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          className={getControlClassName(size, { autoHeight, resize })}
          data-invalid={isInvalid || undefined}
          data-slot="textarea"
          disabled={disabled}
          id={textareaId}
          onInput={(event) => {
            onInput?.(event);

            if (autoHeight && !resize) {
              syncHeight();
            }
          }}
          ref={mergeRefs(ref, textareaRef)}
          required={required}
          {...(value !== undefined ? { value } : {})}
        />
      </div>

      {helperText ? (
        <InputHelper id={helperId} icon={helperIcon} invalid={isInvalid}>
          {helperText}
        </InputHelper>
      ) : null}
    </div>
  );
}
