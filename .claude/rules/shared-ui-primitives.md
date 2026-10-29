---
paths:
  - "app/shared/ui/**/*.{ts,tsx}"
---

# Interactive primitives

A new `app/shared/ui` component that traps focus, locks scroll, moves a highlight with the keyboard, or opens a popup wraps the matching Radix primitive. Style it with the existing tokens. Do not write that behavior from scratch.

Buttons, inputs, and other simple controls stay as they are.

These already do that work by hand. Leave them. Do not move one onto Radix unless someone asks:

- Accordion, Combobox, Dialog, Drawer, Dropdown, Date picker
- OTP, Segmented, Slider, Stepper, Tabs, Tooltip
