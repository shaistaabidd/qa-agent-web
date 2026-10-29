import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  useMemo,
} from 'react';

import { Divider } from '@/shared/ui/divider';

import { StepperContext } from './stepper-context';
import type { StepperItemProps, StepperProps } from './types';
import { getConnectorWrapClassName, getRootClassName, usesOverlayConnectors } from './utils';

function isStepperItem(child: unknown): child is ReactElement<StepperItemProps> {
  return isValidElement(child);
}

export function Stepper({
  children,
  className,
  direction = 'horizontal',
  itemDirection = 'horizontal',
  ...props
}: StepperProps) {
  const items = Children.toArray(children).filter(isStepperItem);
  const context = useMemo(() => ({ direction, itemDirection }), [direction, itemDirection]);
  const overlayConnectors = usesOverlayConnectors(direction, itemDirection);

  return (
    <StepperContext.Provider value={context}>
      <div
        className={getRootClassName(direction, itemDirection, className)}
        data-direction={direction}
        data-item-direction={itemDirection}
        data-slot="stepper"
        {...props}
      >
        {items.map((child, index) => (
          <Fragment key={child.key ?? index}>
            {index > 0 && !overlayConnectors ? (
              <div
                aria-hidden
                className={getConnectorWrapClassName(direction, itemDirection)}
                data-slot="stepper-connector"
              >
                <Divider
                  orientation={direction === 'vertical' ? 'vertical' : 'horizontal'}
                  tone="default"
                />
              </div>
            ) : null}
            {cloneElement(child, {
              isLast: child.props.isLast ?? index === items.length - 1,
              step: child.props.step ?? index + 1,
            })}
          </Fragment>
        ))}
      </div>
    </StepperContext.Provider>
  );
}
