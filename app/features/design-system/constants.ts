export const CRUD_PATH = '/crud';

export type NavItem = {
  id: string;
  label: string;
  to?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Typography',
    items: [{ id: 'typography', label: 'Typography' }],
  },
  {
    title: 'Colors',
    items: [{ id: 'colors', label: 'Colors' }],
  },
  {
    title: 'Components',
    items: [
      { id: 'avatar', label: 'Avatar' },
      { id: 'badge', label: 'Badge' },
      { id: 'chip', label: 'Chip' },
      { id: 'tag', label: 'Tag' },
      { id: 'divider', label: 'Divider' },
      { id: 'separator', label: 'Separator' },
      { id: 'empty-state', label: 'Empty State' },
      { id: 'skeleton', label: 'Skeleton' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'collapsible', label: 'Collapsible' },
      { id: 'alert', label: 'Alert' },
      { id: 'banner', label: 'Banner' },
      { id: 'button', label: 'Button' },
      { id: 'toggle', label: 'Toggle' },
      { id: 'toggle-group', label: 'Toggle Group' },
      { id: 'label', label: 'Label' },
      { id: 'input', label: 'Input' },
      { id: 'copy-input', label: 'Copy Input' },
      { id: 'search', label: 'Search' },
      { id: 'phone-input', label: 'Phone Input' },
      { id: 'otp', label: 'OTP' },
      { id: 'textarea', label: 'Textarea' },
      { id: 'kbd', label: 'Kbd' },
      { id: 'file-uploader', label: 'File Uploader' },
      { id: 'image-uploader', label: 'Image Uploader' },
      { id: 'date-picker', label: 'Date Picker' },
      { id: 'time-range-picker', label: 'Time Range Picker' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'radio', label: 'Radio' },
      { id: 'switch', label: 'Switch' },
      { id: 'slider', label: 'Slider' },
      { id: 'progress', label: 'Progress' },
      { id: 'stepper', label: 'Stepper' },
      { id: 'dropdown', label: 'Dropdown' },
      { id: 'dropdown-menu', label: 'Dropdown Menu' },
      { id: 'context-menu', label: 'Context Menu' },
      { id: 'combobox', label: 'Combobox' },
      { id: 'command', label: 'Command' },
      { id: 'multi-select', label: 'Multi Select' },
      { id: 'segmented', label: 'Segmented' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'breadcrumb', label: 'Breadcrumb' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'card', label: 'Card' },
      { id: 'choice-card', label: 'Choice Card' },
      { id: 'aspect-ratio', label: 'Aspect Ratio' },
      { id: 'scroll-area', label: 'Scroll Area' },
      { id: 'resizable', label: 'Resizable' },
      { id: 'popover', label: 'Popover' },
      { id: 'hover-card', label: 'Hover Card' },
      { id: 'dialog', label: 'Dialog' },
      { id: 'drawer', label: 'Drawer' },
      { id: 'sheet', label: 'Sheet' },
      { id: 'toast', label: 'Toast' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'carousel', label: 'Carousel' },
      { id: 'chart', label: 'Chart' },
      { id: 'table', label: 'Table' },
      { id: 'crud', label: 'CRUD', to: CRUD_PATH },
      { id: 'sortable', label: 'Sortable' },
      { id: 'form-page-header', label: 'Form Page Header' },
      { id: 'group-container', label: 'Group Container' },
      { id: 'sidebar', label: 'Sidebar' },
    ],
  },
];
