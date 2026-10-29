import { scrollbarClass } from '@/shared/lib/scrollbar';
import { ThemeToggle } from '@/shared/ui/theme-toggle';
import { Typography } from '@/shared/ui/Typography';

import { AccordionSection } from './components/sections/accordion';
import { AlertSection } from './components/sections/alert';
import { AspectRatioSection } from './components/sections/aspect-ratio';
import { AvatarSection } from './components/sections/avatar';
import { BadgeSection } from './components/sections/badge';
import { BannerSection } from './components/sections/banner';
import { BreadcrumbSection } from './components/sections/breadcrumb';
import { ButtonSection } from './components/sections/button';
import { CardSection } from './components/sections/card';
import { CarouselSection } from './components/sections/carousel';
import { ChartSection } from './components/sections/chart';
import { CheckboxSection } from './components/sections/checkbox';
import { ChipSection } from './components/sections/chip';
import { ChoiceCardSection } from './components/sections/choice-card';
import { CollapsibleSection } from './components/sections/collapsible';
import { ColorsSection } from './components/sections/colors';
import { ComboboxDemo } from './components/sections/combobox';
import { CommandSection } from './components/sections/command';
import { ContextMenuSection } from './components/sections/context-menu';
import { CopyInputSection } from './components/sections/copy-input';
import { DatePickerSection } from './components/sections/date-picker';
import { DialogDemo } from './components/sections/dialog';
import { DividerSection } from './components/sections/divider';
import { DrawerDemo } from './components/sections/drawer';
import { DropdownSection } from './components/sections/dropdown';
import { DropdownMenuDemo } from './components/sections/dropdown-menu';
import { EmptyStateSection } from './components/sections/empty-state';
import { FileUploaderSection } from './components/sections/file-uploader';
import { FormPageHeaderSection } from './components/sections/form-page-header';
import { GroupContainerSection } from './components/sections/group-container';
import { HoverCardSection } from './components/sections/hover-card';
import { ImageUploaderSection } from './components/sections/image-uploader';
import { InputSection } from './components/sections/input';
import { KbdSection } from './components/sections/kbd';
import { LabelSection } from './components/sections/label';
import { MultiSelectDemo } from './components/sections/multi-select';
import { OtpSection } from './components/sections/otp';
import { PaginationSection } from './components/sections/pagination';
import { PhoneInputSection } from './components/sections/phone-input';
import { PopoverSection } from './components/sections/popover';
import { ProgressSection } from './components/sections/progress';
import { RadioSection } from './components/sections/radio';
import { ResizableSection } from './components/sections/resizable';
import { ScrollAreaSection } from './components/sections/scroll-area';
import { SearchSection } from './components/sections/search';
import { SegmentedDemo } from './components/sections/segmented';
import { SeparatorSection } from './components/sections/separator';
import { SheetSection } from './components/sections/sheet';
import { SidebarSection } from './components/sections/sidebar';
import { SkeletonSection } from './components/sections/skeleton';
import { SliderSection } from './components/sections/slider';
import { SortableSection } from './components/sections/sortable';
import { StepperSection } from './components/sections/stepper';
import { SwitchSection } from './components/sections/switch-section';
import { TableSection } from './components/sections/table';
import { TabsDemo } from './components/sections/tabs';
import { TagSection } from './components/sections/tag';
import { TextareaSection } from './components/sections/textarea';
import { TimeRangePickerSection } from './components/sections/time-range-picker';
import { ToastSection } from './components/sections/toast';
import { ToggleSection } from './components/sections/toggle';
import { ToggleGroupSection } from './components/sections/toggle-group';
import { TooltipSection } from './components/sections/tooltip';
import { TypographySection } from './components/sections/typography';
import { SidebarNav } from './components/SidebarNav';

export function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-bg-canvas text-fg-default">
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 gap-10 px-6 py-10 lg:px-10">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div
            className={[
              'sticky top-10 max-h-[calc(100vh-5rem)] overflow-y-auto pb-10',
              scrollbarClass,
            ].join(' ')}
          >
            <SidebarNav />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex flex-wrap items-start justify-between gap-4 pb-10">
            <div className="space-y-2">
              <Typography as="h1" variant="h4">
                Design System
              </Typography>
              <Typography variant="body3" className="max-w-2xl text-fg-secondary">
                SaaS Temp components, rendered with their variants, sizes, and states for visual QA.
              </Typography>
            </div>
            <ThemeToggle />
          </header>

          <TypographySection />
          <ColorsSection />
          <AvatarSection />
          <BadgeSection />
          <ChipSection />
          <TagSection />
          <DividerSection />
          <SeparatorSection />
          <EmptyStateSection />
          <SkeletonSection />
          <AccordionSection />
          <CollapsibleSection />
          <AlertSection />
          <BannerSection />
          <ButtonSection />
          <ToggleSection />
          <ToggleGroupSection />
          <LabelSection />
          <InputSection />
          <CopyInputSection />
          <SearchSection />
          <PhoneInputSection />
          <OtpSection />
          <TextareaSection />
          <KbdSection />
          <FileUploaderSection />
          <ImageUploaderSection />
          <DatePickerSection />
          <TimeRangePickerSection />
          <CheckboxSection />
          <RadioSection />
          <SwitchSection />
          <SliderSection />
          <ProgressSection />
          <StepperSection />
          <DropdownSection />
          <DropdownMenuDemo />
          <ContextMenuSection />
          <ComboboxDemo />
          <CommandSection />
          <MultiSelectDemo />
          <SegmentedDemo />
          <TabsDemo />
          <BreadcrumbSection />
          <PaginationSection />
          <CardSection />
          <ChoiceCardSection />
          <AspectRatioSection />
          <ScrollAreaSection />
          <ResizableSection />
          <PopoverSection />
          <HoverCardSection />
          <DialogDemo />
          <DrawerDemo />
          <SheetSection />
          <ToastSection />
          <TooltipSection />
          <CarouselSection />
          <ChartSection />
          <TableSection />
          <SortableSection />
          <FormPageHeaderSection />
          <GroupContainerSection />
          <SidebarSection />
        </main>
      </div>
    </div>
  );
}
