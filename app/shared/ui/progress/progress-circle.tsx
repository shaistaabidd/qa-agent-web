import { CIRCLE_SIZE, CIRCLE_STROKE_WIDTH, circleClass } from './constants';

const RADIUS = (CIRCLE_SIZE - CIRCLE_STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressCircle({ percent }: { percent: number }) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <svg
      aria-hidden="true"
      className={circleClass}
      fill="none"
      viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
    >
      <circle
        className="stroke-bg-muted"
        cx={CIRCLE_SIZE / 2}
        cy={CIRCLE_SIZE / 2}
        r={RADIUS}
        strokeWidth={CIRCLE_STROKE_WIDTH}
      />
      <circle
        className="stroke-bg-primary -rotate-90 transition-[stroke-dashoffset] duration-200"
        cx={CIRCLE_SIZE / 2}
        cy={CIRCLE_SIZE / 2}
        r={RADIUS}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth={CIRCLE_STROKE_WIDTH}
        style={{ transformOrigin: '50% 50%' }}
      />
    </svg>
  );
}
