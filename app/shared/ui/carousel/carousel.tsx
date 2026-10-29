import { CaretLeftIcon } from '@phosphor-icons/react/CaretLeft';
import { CaretRightIcon } from '@phosphor-icons/react/CaretRight';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import {
  type ComponentProps,
  createContext,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { isEditableTarget, useCarouselState } from './use-carousel-state';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  slidesInView: number[];
} & CarouselProps;

// Native `disabled` removes the button from focus, so the browser sends focus to `<body>`.
const disabledControlClass =
  'aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-bg-muted aria-disabled:text-fg-muted';

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  onKeyDown,
  'aria-label': ariaLabel = 'Slides',
  ...props
}: ComponentProps<'div'> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins,
  );
  const { canScrollNext, canScrollPrev, slidesInView } = useCarouselState(api);

  const scrollPrev = useCallback(() => {
    if (!api?.canScrollPrev()) return;
    api.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    if (!api?.canScrollNext()) return;
    api.scrollNext();
  }, [api]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);

    if (event.defaultPrevented || isEditableTarget(event.target)) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollNext();
    }
  }

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  const contextValue = useMemo(
    () => ({
      carouselRef,
      api,
      opts,
      orientation,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      slidesInView,
    }),
    [
      api,
      canScrollNext,
      canScrollPrev,
      carouselRef,
      opts,
      orientation,
      scrollNext,
      scrollPrev,
      slidesInView,
    ],
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      {/* The WAI-ARIA carousel pattern puts arrow-key navigation on the region. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        className={cn('relative', className)}
        data-slot="carousel"
        role="region"
        {...props}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div className="overflow-hidden" data-slot="carousel-content" ref={carouselRef}>
      <div
        className={cn(
          'flex -ml-[16px]',
          orientation === 'vertical' && '-mt-[16px] flex-col',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: ComponentProps<'div'>) {
  const { api, orientation, slidesInView } = useCarousel();
  const [slide, setSlide] = useState<HTMLDivElement | null>(null);
  const index = slide && api ? api.slideNodes().indexOf(slide) : -1;
  const count = api?.slideNodes().length ?? 0;
  const offScreen = slidesInView.length > 0 && index >= 0 && !slidesInView.includes(index);
  const position = index >= 0 && count > 0 ? `${index + 1} of ${count}` : undefined;

  return (
    <div
      {...props}
      aria-hidden={offScreen || undefined}
      aria-label={props['aria-label'] ?? position}
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full pl-[16px]',
        orientation === 'vertical' && 'pt-[16px]',
        className,
      )}
      data-slot="carousel-item"
      inert={offScreen || undefined}
      ref={setSlide}
      role="group"
    />
  );
}

function CarouselPrevious({
  className,
  onClick,
  variant = 'outline',
  size = 'icon-sm',
  ...props
}: Omit<ComponentProps<typeof Button>, 'children'>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      className={cn(
        'absolute touch-manipulation rounded-full',
        disabledControlClass,
        orientation === 'horizontal'
          ? 'inset-y-0 -left-[48px] my-auto'
          : '-top-[48px] left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      data-ui="carousel-previous"
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented) scrollPrev();
      }}
      size={size}
      variant={variant}
      {...props}
      aria-disabled={!canScrollPrev || undefined}
    >
      <CaretLeftIcon aria-hidden weight="regular" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  onClick,
  variant = 'outline',
  size = 'icon-sm',
  ...props
}: Omit<ComponentProps<typeof Button>, 'children'>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      className={cn(
        'absolute touch-manipulation rounded-full',
        disabledControlClass,
        orientation === 'horizontal'
          ? 'inset-y-0 -right-[48px] my-auto'
          : '-bottom-[48px] left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      data-ui="carousel-next"
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented) scrollNext();
      }}
      size={size}
      variant={variant}
      {...props}
      aria-disabled={!canScrollNext || undefined}
    >
      <CaretRightIcon aria-hidden weight="regular" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
};
