import { barClass, inputClass, trackClass } from './constants';
import { SliderThumb } from './slider-thumb';
import type { SliderProps } from './types';
import { useSlider } from './use-slider';
import { getRootClassName } from './utils';

export function Slider({ className, ...props }: SliderProps) {
  const {
    barRef,
    disabled,
    dragging,
    isInteractive,
    isPreview,
    isRange,
    max,
    min,
    name,
    pair,
    percents,
    sliderId,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleThumbKeyDown,
  } = useSlider(props);
  const labelledBy = props['aria-labelledby'];
  const startId = sliderId;
  const endId = isRange ? `${sliderId}-end` : sliderId;
  const rangeText = `${pair[0]} to ${pair[1]}`;
  const rangeWidth = Math.max(percents.end - percents.start, 0);

  return (
    <div
      aria-describedby={props['aria-describedby']}
      aria-disabled={disabled || undefined}
      aria-label={isRange && !labelledBy ? props['aria-label'] : undefined}
      aria-labelledby={isRange ? labelledBy : undefined}
      className={getRootClassName(className)}
      data-disabled={disabled || undefined}
      data-slot="slider"
      data-type={isRange ? 'range' : 'default'}
      onLostPointerCapture={isInteractive ? handlePointerUp : undefined}
      onPointerCancel={isInteractive ? handlePointerUp : undefined}
      onPointerDown={isInteractive ? handlePointerDown : undefined}
      onPointerMove={isInteractive ? handlePointerMove : undefined}
      onPointerUp={isInteractive ? handlePointerUp : undefined}
      role={isRange ? 'group' : undefined}
    >
      <div className={barClass} data-slot="slider-bar" ref={barRef}>
        <div
          className={trackClass}
          data-slot="slider-track"
          style={{ left: `${percents.start}%`, width: `${rangeWidth}%` }}
        />
        {isRange ? (
          <SliderThumb
            ariaLabel="Minimum"
            disabled={disabled}
            dragging={dragging === 'start'}
            id={startId}
            interaction={props.interaction}
            live={!isPreview}
            max={pair[1]}
            min={min}
            onKeyDown={handleThumbKeyDown('start')}
            percent={percents.start}
            value={pair[0]}
            valueText={rangeText}
            zIndex={dragging === 'start' ? 2 : 1}
          />
        ) : null}
        <SliderThumb
          ariaLabel={isRange ? 'Maximum' : props['aria-label'] || 'Slider'}
          disabled={disabled}
          dragging={dragging === 'end'}
          id={endId}
          interaction={props.interaction}
          labelledBy={isRange ? undefined : labelledBy}
          live={!isPreview}
          max={max}
          min={isRange ? pair[0] : min}
          onKeyDown={handleThumbKeyDown('end')}
          percent={percents.end}
          value={pair[1]}
          valueText={isRange ? rangeText : undefined}
          zIndex={dragging === 'end' ? 2 : 1}
        />
      </div>
      {name && !isPreview ? (
        isRange ? (
          <>
            <input
              className={inputClass}
              name={`${name}-start`}
              readOnly
              type="hidden"
              value={pair[0]}
            />
            <input
              className={inputClass}
              name={`${name}-end`}
              readOnly
              type="hidden"
              value={pair[1]}
            />
          </>
        ) : (
          <input className={inputClass} name={name} readOnly type="hidden" value={pair[1]} />
        )
      ) : null}
    </div>
  );
}
