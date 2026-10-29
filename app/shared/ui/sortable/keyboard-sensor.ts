import { KeyboardSensor, type KeyboardSensorOptions } from '@dnd-kit/core';

type Coordinates = { x: number; y: number };

type CollisionRect = { left: number; top: number } | null;

type KeyboardSensorHandlers = {
  finished?: boolean;
  referenceCoordinates?: Coordinates;
  props: {
    event: Event;
    active: Parameters<NonNullable<KeyboardSensorOptions['coordinateGetter']>>[1]['active'];
    options: KeyboardSensorOptions;
    context: { current: { collisionRect: CollisionRect } };
  };
  listeners: {
    add: (eventName: string, handler: (event: Event) => void) => void;
  };
  windowListeners: {
    add: (eventName: string, handler: (event: Event) => void) => void;
  };
  handleStart: () => void;
  handleKeyDown: (event: Event) => void;
  handleMove: (event: Event, coordinates: Coordinates) => void;
  handleEnd: (event: Event) => void;
  handleCancel: (event: Event) => void;
};

const endKeys = ['Space', 'Enter', 'Tab'];
const cancelKeys = ['Escape'];

class SortableKeyboardSensor extends KeyboardSensor {}

// dnd-kit attaches its key listener on the next task, so a second key in the
// same moment (Space, Arrow, Escape) never ends the drag. Listen immediately
// and ignore only the key that started it.
function attach(this: KeyboardSensorHandlers) {
  this.handleStart();
  this.windowListeners.add('resize', this.handleCancel);
  this.windowListeners.add('visibilitychange', this.handleCancel);

  const activationEvent = this.props.event;

  this.listeners.add('keydown', (event) => {
    if (event === activationEvent) return;
    this.handleKeyDown(event);
  });
}

// The built-in handler smooth-scrolls the page when the next row sits in the
// lower half of the viewport, and it does not move the row. A following Space
// then drops the row where it started. Move to the next row instead.
function handleKeyDown(this: KeyboardSensorHandlers, event: Event) {
  if (!(event instanceof KeyboardEvent)) return;

  const codes = this.props.options.keyboardCodes;

  if ((codes?.end ?? endKeys).includes(event.code)) {
    event.preventDefault();
    const endEvent = event;
    // The row under the drag is saved in an effect. Ending in this same turn
    // still sees the previous row, so drop on the next task.
    setTimeout(() => {
      if (this.finished) return;
      this.finished = true;
      this.handleEnd(endEvent);
    }, 0);
    return;
  }

  if ((codes?.cancel ?? cancelKeys).includes(event.code)) {
    if (this.finished) return;
    this.finished = true;
    this.handleCancel(event);
    return;
  }

  const collisionRect = this.props.context.current.collisionRect;
  if (!collisionRect) return;

  const currentCoordinates = { x: collisionRect.left, y: collisionRect.top };
  if (!this.referenceCoordinates) {
    this.referenceCoordinates = currentCoordinates;
  }

  const coordinateGetter = this.props.options.coordinateGetter;
  if (!coordinateGetter) return;

  const next = coordinateGetter(event, {
    active: this.props.active,
    currentCoordinates,
    context: this.props.context.current as Parameters<typeof coordinateGetter>[1]['context'],
  });
  if (!next) return;

  const origin = this.referenceCoordinates;
  this.handleMove(event, { x: next.x - origin.x, y: next.y - origin.y });
}

const prototype = SortableKeyboardSensor.prototype as unknown as {
  attach: typeof attach;
  handleKeyDown: typeof handleKeyDown;
};

prototype.attach = attach;
prototype.handleKeyDown = handleKeyDown;

export { SortableKeyboardSensor };
