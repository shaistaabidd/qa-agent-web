# Table (`Table` / `TanStackTable`)

`Table` (also exported as `TanStackTable`) renders a Tailwind `<table>` and uses [TanStack Table](https://tanstack.com/table/latest) for column definitions, sorting state, pagination, row expansion, and hierarchical (`getSubRows`) tree rows. Cell rendering uses TanStack’s `flexRender` so `header` / `cell` work like a normal TanStack setup.

Shared chrome (header `#fcfaf8` / `#725a62`, body `#0f172a`, borders `#e2e8f0`, square corners) follows the Figma pricing table and lives in `tanStackTableTableClasses.ts`.

## Import

```tsx
import { Table, type PinColumnMeta, type SortIconProps } from '@/components';
// or
import { Table, type PinColumnMeta } from '@/components/table';
import type { ColumnDef, ExpandedState, SortingState } from '@tanstack/react-table';
```

## Minimal example

```tsx
type Row = { id: string; name: string };

const columns: ColumnDef<Row>[] = [{ accessorKey: 'name', header: 'Name' }];

<Table<Row> columns={columns} data={rows} getRowId={(r) => r.id} />;
```

- **`getRowId`** is strongly recommended whenever you use **expansion**, **tree rows**, or **pagination**, so row keys stay stable across pages and reorders.
- Data rows use TanStack’s `row.id` as the React key.

## Live demos

All variations below are rendered on the **`/table`** route (`app/routes/table.tsx`) with dummy data.

| Demo                                            | Source                          |
| ----------------------------------------------- | ------------------------------- |
| Pricing · Providers (Figma)                     | `PricingProvidersTableDemo.tsx` |
| Basic, manual sorting, custom sort icon         | `BasicAndSortingDemos.tsx`      |
| Pagination + sticky header                      | `PaginationAndStickyDemos.tsx`  |
| Expandable panel accents / chevron / controlled | `ExpandableDemos.tsx`           |
| Vertical lines, pinned columns, flex/align      | `LayoutDemos.tsx`               |

---

## How each variation is used

### 1. Basic

Minimal table: columns, data, stable ids. Client-side sorting is on by default. Pagination is usually turned off for short demos.

```tsx
<TanStackTable<Person>
  columns={basicColumns}
  data={PEOPLE.slice(0, 5)}
  getRowId={(row) => row.id}
  pagination={false}
/>
```

### 2. Manual / server sorting

Pass **`sorting`** + **`onSortingChange`**. The table sets `manualSorting: true` so the header stays in sync while you reorder or refetch data.

```tsx
const [sorting, setSorting] = useState<SortingState>([]);

<TanStackTable<Person>
  columns={columns}
  data={data}
  sorting={sorting}
  onSortingChange={(next) => {
    setSorting(next);
    // sort / refetch yourself
  }}
  getRowId={(row) => row.id}
  pagination={false}
/>;
```

### 3. Custom sort icon

Override the default glyph with the table-level **`sortIcon`** prop (or per-column `meta.sortIcon`).

```tsx
<TanStackTable<Person>
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  pagination={false}
  sortIcon={({ sortOrder }) => (
    <span>{sortOrder === 'ascend' ? '↑' : sortOrder === 'descend' ? '↓' : '↕'}</span>
  )}
/>
```

### 4. Default pagination

`pagination` defaults to `true` with **`pageSize`** `10` (override via `pageSize`).

```tsx
<TanStackTable<Person> columns={columns} data={PEOPLE} getRowId={(row) => row.id} pageSize={5} />
```

### 5. Pagination disabled

```tsx
<TanStackTable<Person>
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  pagination={false}
/>
```

### 6. Custom item label

Pass `pagination={{ itemLabel, pageSize }}` for the shared table footer copy.

```tsx
<TanStackTable<Person>
  columns={columns}
  data={PEOPLE}
  getRowId={(row) => row.id}
  pagination={{
    itemLabel: 'users',
    pageSize: 4,
  }}
/>
```

### 7. Sticky header

`stickyHeader` enables vertical scroll; height comes from **`stickyHeaderScrollY`** (default `calc(100vh - 160px)`).

```tsx
<TanStackTable<Person>
  columns={columns}
  data={PEOPLE}
  getRowId={(row) => row.id}
  pagination={false}
  stickyHeader
  stickyHeaderScrollY={220}
/>
```

### 8. Expandable detail panel · primary accent

Use **`renderExpandedRow`** for a detail row under the parent. Set column **`meta.expandedPanelLeftBorder`** (and optional **`expandedPanelAccent: 'primary'`**) for the left accent bar. Rows toggle on click by default.

```tsx
<TanStackTable<Order>
  columns={orderColumns({
    expandedPanelLeftBorder: true,
    expandedPanelAccent: 'primary',
  })}
  data={ORDERS}
  getRowId={(row) => row.id}
  pagination={false}
  expandedContentClassName="px-0"
  renderExpandedRow={({ row }) => <ExpandedNote note={row.original.note} />}
/>
```

### 9. Expandable · danger accent

Same as above with **`expandedPanelAccent: 'danger'`** (dispute / refund-style panels).

```tsx
columns={orderColumns({
  expandedPanelLeftBorder: true,
  expandedPanelAccent: 'danger',
  expandedPanelClassName: 'border-l-0',
})}
```

### 10. Expandable · accent off

Keep left-border meta on a column, but pass **`showExpandedRowAccent={false}`** to hide the bar and the seam between parent and detail rows. Open parent / expanded cells use white instead of `bg-neutral-50`.

```tsx
<TanStackTable<Order>
  columns={orderColumns({ expandedPanelLeftBorder: true })}
  data={ORDERS}
  getRowId={(row) => row.id}
  pagination={false}
  showExpandedRowAccent={false}
  renderExpandedRow={({ row }) => <ExpandedNote note={row.original.note} />}
/>
```

### 11. Expandable · expand column (chevron)

Pass **`expandable={{ showExpandColumn: true }}`** for a trailing expand column. Row click still works unless you set `expandable.expandRowByClick` to false.

```tsx
<TanStackTable<Order>
  columns={orderColumns({ expandedPanelLeftBorder: true, expandedPanelAccent: 'primary' })}
  data={ORDERS}
  getRowId={(row) => row.id}
  pagination={false}
  expandable={{ showExpandColumn: true }}
  renderExpandedRow={({ row }) => <ExpandedNote note={row.original.note} />}
/>
```

### 12. Controlled expanded state (panel)

Drive panel expansion with TanStack **`ExpandedState`**.

```tsx
const [expanded, setExpanded] = useState<ExpandedState>({ o1: true });

<TanStackTable<Order>
  columns={orderColumns({ expandedPanelLeftBorder: true, expandedPanelAccent: 'primary' })}
  data={ORDERS}
  getRowId={(row) => row.id}
  pagination={false}
  expanded={expanded}
  onExpandedChange={setExpanded}
  renderExpandedRow={({ row }) => <ExpandedNote note={row.original.note} />}
/>;
```

### 13. No vertical lines

**`showVerticalLines={false}`** removes the header grid and body column dividers; horizontal row separators (`border-b`) stay.

```tsx
<TanStackTable<Person>
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  pagination={false}
  showVerticalLines={false}
/>
```

### 14. Pinned columns

Set **`meta.pin: 'left' | 'right'`**. Pinning applies at every viewport width. Wide **`minWidth`** columns also trigger horizontal scroll (`scroll.x` defaults to `'max-content'` when pin/minWidth is present).

```tsx
const columns: ColumnDef<Person, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: { pin: 'left', minWidth: 160 } satisfies PinColumnMeta,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: { pin: 'right', align: 'right', minWidth: 120 } satisfies PinColumnMeta,
  },
];

<TanStackTable<Person>
  columns={columns}
  data={WIDE_PEOPLE}
  getRowId={(row) => row.id}
  pagination={false}
/>;
```

### 15. Flex, width & alignment

Use **`meta.flex`** for relative widths, **`width` / `maxWidth` / `minWidth`** for fixed sizing, and **`align`** for cell alignment.

```tsx
meta: { flex: 2, align: 'left' } satisfies PinColumnMeta
meta: { width: 120, align: 'right', maxWidth: 140 } satisfies PinColumnMeta
```

### 16. Pricing · Providers (tree + grouped headers)

This is the Figma pricing table. It uses **tree expansion** (`getSubRows`), **not** `renderExpandedRow`. Child variation rows render as real table rows via TanStack `getExpandedRowModel`.

Key pieces:

| Concern               | How                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Hierarchy             | `getSubRows={(row) => row.variations}`                                                                                           |
| Controlled open state | `expanded` + `onExpandedChange`                                                                                                  |
| Grouped headers       | Nested TanStack column `columns: [...]` (Pharmacy Cut, Provider Markup, Provider Commission)                                     |
| Parent summary cells  | `meta.getColSpan` — parent spans a group; siblings return `0` to hide                                                            |
| Row chrome            | Auto `pricing-tree-parent-row` / `pricing-tree-child-row` classes; click parent row to expand (ignores clicks on inputs/buttons) |
| Caret                 | Custom actions column cell (`ExpandCaret`) calling `row.toggleExpanded()`                                                        |
| Sort icon             | Custom `sortIcon` (pricing asset)                                                                                                |
| Cell padding          | Pass `className` on the table root when a demo needs to override cell padding                                                    |

```tsx
const [expanded, setExpanded] = useState<ExpandedState>({
  'sema-bmimd': true,
});

<TanStackTable<PricingTableRow>
  columns={pricingProvidersColumns}
  data={PRICING_PROVIDER_ROWS}
  getRowId={(row) => row.id}
  getSubRows={(row) => row.variations}
  expanded={expanded}
  onExpandedChange={setExpanded}
  pagination={false}
  sortIcon={pricingProvidersSortIcon}
  className={PRICING_TABLE_CLASSES}
  scroll={{ x: 'max-content' }}
/>;
```

**`getColSpan` example** (parent shows one summary across five Pharmacy Cut leaves):

```tsx
meta: {
  getColSpan: ({ depth }) => (depth === 0 ? 5 : 1), // first leaf of group
} satisfies PinColumnMeta

meta: {
  getColSpan: ({ depth }) => (depth === 0 ? 0 : 1), // hide other leaves on parent
} satisfies PinColumnMeta
```

Do **not** combine `getSubRows` tree rows with `renderExpandedRow` panel expansion for the same table unless you intentionally need both models; demos keep them separate.

---

## Props (`TanStackTableProps<TData>`)

| Prop                       | Description                                                                                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `columns`                  | TanStack `ColumnDef<TData, unknown>[]`. Nested `columns` create grouped headers.                                                                                                               |
| `data`                     | Row array.                                                                                                                                                                                     |
| `sorting`                  | Controlled sort state (`SortingState`).                                                                                                                                                        |
| `onSortingChange`          | If provided, sorting is **manual** (server-driven). Update data or refetch in this callback.                                                                                                   |
| `pagination`               | `true` (default), `false`, or `{ itemLabel?, pageSize? }` for the shared footer.                                                                                                               |
| `pageSize`                 | Used when `pagination` is boolean `true`.                                                                                                                                                      |
| `stickyHeader`             | When `true`, sets vertical scroll on the table; height from `stickyHeaderScrollY`.                                                                                                             |
| `stickyHeaderScrollY`      | Override scroll area height (default `calc(100vh - 160px)`).                                                                                                                                   |
| `sortIcon`                 | Custom sort icon for columns (see `SortIconProps`).                                                                                                                                            |
| `renderExpandedRow`        | `({ row }) => ReactNode`. Enables **panel** expandable rows when set.                                                                                                                          |
| `getSubRows`               | Hierarchical sub-rows (**tree**). Expanded children render as real table rows via `getExpandedRowModel`.                                                                                       |
| `expandedContentClassName` | Optional. Merged onto the inner **`div`** around panel expanded content. Expanded **`td`** uses **`p-0!`**; add spacing here when you want inset.                                              |
| `expanded`                 | Controlled `ExpandedState` from TanStack (panel or tree).                                                                                                                                      |
| `onExpandedChange`         | Controlled expansion updates.                                                                                                                                                                  |
| `getRowCanExpand`          | Per-row gate. Default: all rows when panel expand is on; rows with `subRows.length > 0` when tree expand is on.                                                                                |
| `getRowId`                 | Forwarded to `useReactTable`.                                                                                                                                                                  |
| `showVerticalLines`        | Default **`true`**: header + body column grid (`#e2e8f0`). **`false`**: no vertical lines / header grid; horizontal body row lines stay.                                                       |
| `showExpandedRowAccent`    | Default **`true`**: when `meta.expandedPanelLeftBorder` is set, show the left accent on the parent + panel expanded row. **`false`**: no accent; seam between parent and panel row is removed. |

`className`, `scroll`, `expandable`, `onRow`, `loading`, and `locale.emptyText` are first-class props on this table. Pagination is owned by the table footer, not a built-in pager.

## Column `meta` (`PinColumnMeta`)

Attach layout and chrome via TanStack’s `meta` on a column (often with `satisfies PinColumnMeta`):

| Field                             | Description                                                                                                                                                     |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pin`                             | `'left'` \| `'right'` — sticky column at every viewport width. Renderer CSS keeps it pinned; set `meta.width` when several columns are pinned so offsets match. |
| `flex`                            | Relative flex width when any column uses `flex` (ratio across those columns).                                                                                   |
| `width` / `minWidth` / `maxWidth` | Sizing hints. Numeric widths also feed sticky pin offsets.                                                                                                      |
| `align`                           | `'left'` \| `'right'` \| `'center'` for cells (default `left`).                                                                                                 |
| `headerClassName` / `headerStyle` | Header cell overrides.                                                                                                                                          |
| `sortIcon`                        | Per-column sort icon override.                                                                                                                                  |
| `getColSpan`                      | `({ depth, isParent }) => number \| undefined`. Return `0` to skip a cell. Used for tree parent summary cells.                                                  |

**Expanded panel chrome** — the first column (in definition order) that sets any of the following fields wins:

| Field                     | Description                                                                                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `expandedPanelLeftBorder` | `true` — left accent bar on **parent row + panel expanded row** when open.                                                                                                                             |
| `expandedPanelAccent`     | `'primary'` \| `'danger'` — color for the bar (default `'primary'`).                                                                                                                                   |
| `expandedPanelClassName`  | Optional classes merged onto the inner `div` around `renderExpandedRow`. With accent **on**: open parent, expanded **`td`**, and wrapper use **`bg-neutral-50`**. With accent **off**: **`bg-white`**. |

## Sorting

- **Client-side (default):** Omit `onSortingChange`. TanStack sorts the row model, and the header icon follows that state.
- **Server-side:** Pass `onSortingChange` (and usually `sorting`). The table sets `manualSorting: true` so the header still reflects sort direction without re-sorting in the browser.
- Disable sort per column with `enableSorting: false`.

## Pagination

- `pagination={false}` disables pagination.
- `pagination={{ itemLabel: 'users', pageSize: 20 }}` uses the shared footer (`Showing 1 – 20 of 500 users`) with Figma-styled page buttons.
- Client paging is driven by TanStack `getPaginationRowModel`. The footer is the shared pagination component.

## Two expansion models

### Panel (`renderExpandedRow`)

1. Pass **`renderExpandedRow={({ row }) => ...}`**.
2. Prefer **`getRowId`**.
3. Rows toggle via **`expandRowByClick`** (default **`true`**). There is **no** trailing expand column by default; set `expandable={{ showExpandColumn: true }}` to show one.
4. Controlled mode: `expanded` + `onExpandedChange`.
5. **`showExpandedRowAccent={false}`** — no accent bar; open parent / expanded panel use white.

### Tree (`getSubRows`)

1. Pass **`getSubRows={(row) => row.children}`** (or `variations`, etc.).
2. Prefer **`getRowId`**.
3. Parent rows get `pricing-tree-parent-row`; children get `pricing-tree-child-row`. Parents with sub-rows are clickable to toggle (clicks on `input` / `button` / `a` / `textarea` / `select` are ignored).
4. Use **`meta.getColSpan`** when parent rows should show merged summary cells across leaf columns.
5. Optional custom caret column can call `row.toggleExpanded()`.

Panel mode renders an extra detail row from `renderExpandedRow`. Tree mode uses TanStack’s expanded row model for visible child rows.

## Horizontal scroll & sticky columns

If any column uses **`pin`** or **`minWidth`**, `scroll.x` defaults to `'max-content'` when you do not pass `scroll.x`, so wide tables scroll horizontally. Pricing demos also set `scroll={{ x: 'max-content' }}` explicitly.

## Styling notes

- Default chrome matches the pricing table (Inter, `bg-bg-surface` header, `border-subtle` borders, card radius).
- **`showVerticalLines={false}`** → body row separators only.
- Detail rows use `p-0` so panel content controls its own padding.
- When **`expandedPanelLeftBorder`** is on, a left accent bar paints on the open parent row and the detail row.
- Grouped headers use TanStack `colSpan` / `rowSpan`.
- Sort controls stay content-sized next to the header label.

## Related types

- **`SortIconProps`**: `{ sortOrder: 'ascend' | 'descend' | null }` — use with `sortIcon` / column `meta.sortIcon`.
- **`ExpandedState`**, **`SortingState`**, **`Row`**, **`ColumnDef`**: import from `@tanstack/react-table` as needed.
