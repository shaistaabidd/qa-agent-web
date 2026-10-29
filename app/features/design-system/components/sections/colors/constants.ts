export type ColorStep = {
  hex: string;
  step: string;
};

export type ColorScale = {
  name: string;
  prefix: string;
  steps: ColorStep[];
};

export type ColorSwatchItem = {
  hex: string;
  name: string;
  token: string;
  utility: string;
};

export type ColorGroup = {
  description: string;
  swatches: ColorSwatchItem[];
  title: string;
};

const SCALE_STEPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;

function scale(
  name: string,
  prefix: string,
  values: Record<(typeof SCALE_STEPS)[number], string>,
  extra: ColorStep[] = [],
): ColorScale {
  return {
    name,
    prefix,
    steps: [...extra, ...SCALE_STEPS.map((step) => ({ hex: values[step], step }))],
  };
}

export const PRIMITIVE_SCALES: ColorScale[] = [
  scale(
    'Brand',
    'brand',
    {
      '50': '#ebfcf6',
      '100': '#d8f9ec',
      '200': '#baf2de',
      '300': '#8be4c3',
      '400': '#4ad9a4',
      '500': '#14b87c',
      '600': '#067c57',
      '700': '#065d3d',
      '800': '#08452e',
      '900': '#082b1e',
      '950': '#071b13',
    },
    [{ hex: '#f6fdfb', step: '25' }],
  ),
  scale('Slate', 'slate', {
    '50': '#f8fafc',
    '100': '#f1f5f9',
    '200': '#e2e8f0',
    '300': '#cbd5e1',
    '400': '#94a3b8',
    '500': '#64748b',
    '600': '#475569',
    '700': '#334155',
    '800': '#1e293b',
    '900': '#0f172a',
    '950': '#020617',
  }),
  scale('Blue', 'blue', {
    '50': '#eff6ff',
    '100': '#dbeafe',
    '200': '#bfdbfe',
    '300': '#93c5fd',
    '400': '#60a5fa',
    '500': '#3b82f6',
    '600': '#2563eb',
    '700': '#1d4ed8',
    '800': '#1e40af',
    '900': '#1e3a8a',
    '950': '#172554',
  }),
  scale('Green', 'green', {
    '50': '#f0fdf4',
    '100': '#dcfce7',
    '200': '#bbf7d0',
    '300': '#86efac',
    '400': '#4ade80',
    '500': '#22c55e',
    '600': '#16a34a',
    '700': '#15803d',
    '800': '#166534',
    '900': '#14532d',
    '950': '#052e16',
  }),
  scale('Red', 'red', {
    '50': '#fef2f2',
    '100': '#fee2e2',
    '200': '#fecaca',
    '300': '#fca5a5',
    '400': '#f87171',
    '500': '#ef4444',
    '600': '#dc2626',
    '700': '#b91c1c',
    '800': '#991b1b',
    '900': '#7f1d1d',
    '950': '#450a0a',
  }),
  scale('Yellow', 'yellow', {
    '50': '#fefce8',
    '100': '#fef9c3',
    '200': '#fef08a',
    '300': '#fde047',
    '400': '#facc15',
    '500': '#eab308',
    '600': '#ca8a04',
    '700': '#a16207',
    '800': '#854d0e',
    '900': '#713f12',
    '950': '#422006',
  }),
  scale('Rosy', 'rosy', {
    '50': '#fdf2f6',
    '100': '#f8e4eb',
    '200': '#eecdd8',
    '300': '#d9abba',
    '400': '#bb8b9b',
    '500': '#99707e',
    '600': '#725a62',
    '700': '#59424a',
    '800': '#402e34',
    '900': '#271c1f',
    '950': '#1b1316',
  }),
  scale('Amber', 'amber', {
    '50': '#fcfaf8',
    '100': '#fbf5ee',
    '200': '#fbecdb',
    '300': '#fadebc',
    '400': '#faca8e',
    '500': '#f6ab51',
    '600': '#e98c1c',
    '700': '#a7681b',
    '800': '#6b4619',
    '900': '#3c2a13',
    '950': '#251b0e',
  }),
];

export const BASE_SWATCHES: ColorSwatchItem[] = [
  {
    hex: '#ffffff',
    name: 'White',
    token: '--color-white',
    utility: 'bg-white / text-white',
  },
  {
    hex: '#000000',
    name: 'Black',
    token: '--color-black',
    utility: 'bg-black / text-black',
  },
];

export const SEMANTIC_GROUPS: ColorGroup[] = [
  {
    title: 'Text',
    description: 'text-high, text-medium, and related body colors.',
    swatches: [
      { hex: '#067c57', name: 'Primary', token: '--color-primary', utility: 'text-primary' },
      { hex: '#0f172a', name: 'High', token: '--color-high', utility: 'text-high' },
      { hex: '#725a62', name: 'Medium', token: '--color-medium', utility: 'text-medium' },
      { hex: '#bb8b9b', name: 'Low', token: '--color-low', utility: 'text-low' },
      { hex: '#64748b', name: 'Disabled', token: '--color-disabled', utility: 'text-disabled' },
      { hex: '#b91c1c', name: 'Error', token: '--color-error', utility: 'text-error' },
    ],
  },
  {
    title: 'Brand',
    description: 'Primary brand alias used by components.',
    swatches: [
      {
        hex: '#067c57',
        name: 'Primary',
        token: '--color-brand-primary',
        utility: 'bg-brand-primary',
      },
    ],
  },
  {
    title: 'Surface',
    description: 'Page, card, and variant fills.',
    swatches: [
      {
        hex: '#fcfaf8',
        name: 'Background',
        token: '--color-surface-background',
        utility: 'bg-surface-background',
      },
      {
        hex: '#f1f5f9',
        name: 'Background variant',
        token: '--color-surface-background-variant',
        utility: 'bg-surface-background-variant',
      },
      {
        hex: '#ffffff',
        name: 'White',
        token: '--color-surface-white',
        utility: 'bg-surface-white',
      },
    ],
  },
  {
    title: 'Border',
    description: 'border-low, border-primary, and related strokes.',
    swatches: [
      {
        hex: '#067c57',
        name: 'Primary',
        token: '--border-color-primary',
        utility: 'border-primary',
      },
      {
        hex: '#94a3b8',
        name: 'Medium',
        token: '--border-color-medium',
        utility: 'border-medium',
      },
      { hex: '#e2e8f0', name: 'Low', token: '--border-color-low', utility: 'border-low' },
    ],
  },
  {
    title: 'Icon',
    description: 'Phosphor and other glyph colors.',
    swatches: [
      {
        hex: '#067c57',
        name: 'Primary',
        token: '--color-icon-primary',
        utility: 'text-icon-primary',
      },
      { hex: '#0f172a', name: 'High', token: '--color-icon-high', utility: 'text-icon-high' },
      {
        hex: '#725a62',
        name: 'Medium',
        token: '--color-icon-medium',
        utility: 'text-icon-medium',
      },
    ],
  },
];
