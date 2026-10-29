import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';

export function CarouselSection() {
  return (
    <ComponentSection
      description="Embla-based slide carousel with prev/next controls."
      id="carousel"
      title="Carousel"
    >
      <Example contentClassName="block px-[56px]" title="Basic">
        <Carousel aria-label="Sample slides" className="w-full max-w-[360px]">
          <CarouselContent>
            {['One', 'Two', 'Three'].map((label) => (
              <CarouselItem key={label}>
                <div className="flex h-[140px] items-center justify-center rounded-[12px] border border-subtle bg-bg-canvas text-sm font-medium text-fg-default">
                  Slide {label}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Example>
    </ComponentSection>
  );
}
