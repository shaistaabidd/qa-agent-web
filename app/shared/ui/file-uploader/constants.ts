export const DEFAULT_ACCEPT = '.pdf,.png,.jpg,.jpeg,.gif';

export const DEFAULT_MAX_SIZE_BYTES = 10 * 1024 * 1024;

export const DEFAULT_UPLOAD_URL = '/file-upload';

export const DEFAULT_TITLE = 'Drag & drop files here';

export const DEFAULT_BROWSE_LABEL = 'Browse Files';

export const DEFAULT_HELPER_TEXT = 'Supported formats: PDF, PNG, JPG, GIF (Max 10MB)';

export const idleClass = [
  'relative box-border flex h-[188px] w-full cursor-pointer flex-col items-center',
  'justify-center gap-[4px] rounded-[16px] px-[16px] py-[24px] text-center outline-none select-none',
  'border border-dashed border-default',
  'hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  'has-[:focus-visible]:border-focus has-[:focus-visible]:border-solid has-[:focus-visible]:shadow-focus',
].join(' ');

export const idleStateClass: Record<'default' | 'drag-over', string> = {
  default: 'bg-transparent',
  'drag-over': 'border-solid border-focus bg-bg-primary-subtle',
};

export const idleDisabledClass =
  'pointer-events-none cursor-not-allowed border-transparent bg-bg-muted text-fg-muted';

export const idleIconClass =
  'mb-[8px] flex size-[40px] shrink-0 items-center justify-center overflow-clip rounded-full [&_svg]:size-[20px]';

export const idleIconStateClass: Record<'default' | 'drag-over', string> = {
  default: 'bg-bg-muted text-fg-default',
  'drag-over': 'bg-bg-muted text-fg-default',
};

export const textGroupClass = 'flex w-full flex-col items-center gap-[4px]';

export const sublineRowClass = 'flex items-center gap-[4px]';

export const browseClass = 'text-fg-primary';

export const fileClass =
  'flex w-full items-start gap-[12px] rounded-[12px] border border-solid border-subtle bg-bg-surface p-[12px]';

export const fileIconClass =
  'flex size-[40px] shrink-0 items-center justify-center overflow-clip rounded-[8px] bg-bg-muted text-fg-secondary [&_svg]:size-[20px]';

export const fileContentClass = 'flex min-w-0 flex-1 flex-col items-start gap-[4px]';

export const fileActionsClass = 'flex shrink-0 items-center gap-[4px]';

export const inputClass = 'sr-only';
