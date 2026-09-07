# Form Studio — reusable data table

A self-contained React + TypeScript studio timetable, built with Next.js 16.3. No backend or table/grid library. All data is simulated and resets on refresh.

## Run

```sh
npm install
npm run dev
# Open the Local URL printed by Next.js
npm run build
npm start
npm run lint
npm test
```

Node 22.18+ is needed for the dependency-free TypeScript state tests (Node 24 recommended).

- `/` and `/timetable-dashboard`: class timetable, attendee expansion, search, filters, column visibility, CSV export and a local add-class dialog.
- `/secondary-dataset-demo`: equipment inventory with an unrelated row shape and maintenance notes. Toggle **Mock server mode** to exercise controlled server sorting/pagination with visible latency.
- The sample week is September 7–13, 2026. The day shortcut returns to Monday in this fixed demo week.

## Structure

- `src/components/data-table/types.ts`: public generic interfaces.
- `src/components/data-table/state.ts`: pure sorting and pagination helpers.
- `src/components/data-table/useTableState.ts`: headless controlled/uncontrolled state.
- `src/components/data-table/DataTable.tsx`: semantic table, pinned columns, lazy child cache, animation and pagination UI.
- `Skeleton.tsx`, `EmptyState.tsx`, `ErrorState.tsx`: shared feedback components.
- `src/mock-data/`: class/attendee fixtures and mock APIs.
- `src/app/globals.css`: shared styling, including the table classes. Include these table styles when extracting the component.

## Public API

```tsx
interface Product { sku: string; title: string; stock: number }
const columns: ColumnDef<Product>[] = [
  { key: 'title', header: 'Product', accessor: p => p.title,
    sortable: true, width: 240, pinned: true,
    cell: p => <strong>{p.title}</strong> },
  { key: 'stock', header: 'Stock', accessor: p => p.stock, sortable: true },
];
<DataTable<Product>
  label="Products"
  data={products}
  columns={columns}
  getRowId={p => p.sku}
  defaultPaginationState={{ pageIndex: 0, pageSize: 8 }}
/>
```

Import `DataTable` from `@/components/data-table/DataTable` and types from `@/components/data-table/types`.

| Prop | Behavior |
| --- | --- |
| `data`, `columns`, `getRowId`, `label` | Required rows, column definitions, stable unique row identity, and accessible table caption. |
| `ColumnDef<T>` | `key`, string `header`, typed `accessor`; optional `cell`, `sortable`, numeric pixel `width` (default 180), left `pinned`, and custom `compare(a,b)`. Accessor values may be strings, numbers, booleans, dates, null or undefined. |
| `sortState`, `onSortChange` | Optional controlled sort (`{key, direction: 'asc' \| 'desc'}` or `null`). Omit `sortState` for internal state. `defaultSortState` initializes uncontrolled sorting. Click cycles asc → desc → none. |
| `paginationState`, `onPaginationChange` | Optional controlled `{pageIndex, pageSize}`; indexes are zero-based. Omit state for internal pagination; initialize with `defaultPaginationState`. |
| `onPageChange`, `onPageSizeChange` | Additional notifications when the corresponding effective value changes. Use `onPaginationChange` to atomically update both values. |
| `expandedState`, `onExpandedChange` | Optional controlled `ReadonlySet<string>` of row IDs; otherwise internal expansion. |
| `hiddenColumns` | Optional parent-managed list of keys to omit. Timetable exposes a Columns menu; keep at least one column visible. |
| `manualSorting` | Bonus: bypass local sorting; parent supplies already-sorted rows. |
| `manualPagination`, `totalCount` | Bonus: parent supplies one page and full filtered result count. Combine with controlled pagination. |
| `pageSizes` | Optional size choices; defaults to 8, 16, 32, 64. Current size is always included. |
| `loading`, `error`, `onRetry` | Column-aligned skeleton rows, error message and retry callback. |
| `emptyTitle`, `emptyDescription` | Configurable empty dataset text. |
| `expansion` | `Expansion<T,C>` described below. Child type can be inferred or passed as `DataTable<Parent,Child>`. |

Controlled state requires the parent to apply change callbacks. Controlled state alone still uses client-side transformations; only `manualSorting` / `manualPagination` bypass them. Invalid sort keys are ignored, malformed sizes are normalized and pages are clamped to the available range. A clamped controlled value is rendered safely without invoking callbacks during render; server parents should use the exported `clampPagination` helper before requesting their page.

## Expansion

```tsx
<DataTable<Parent, Child>
  {...props}
  expansion={{
    getChildren: row => row.children, // undefined means lazy; [] means empty
    loadChildren: row => fetchChildren(row.id),
    renderChildren: (children, parent) => <ChildList rows={children} />,
    emptyMessage: 'No children yet',
  }}
/>
```

`getChildren` takes precedence, including an empty array. If it returns `undefined`, the first expansion calls `loadChildren`. Promises are deduplicated and successful results cached by row ID and row object for the table’s lifetime, including pagination and collapse/reopen. Replacing a row object invalidates its lazy cache on next load. Keep rows and the expansion configuration stable with memoization for efficient reuse. Failed requests are removed from the cache so retry can recover. Unmounted detail panels ignore pending updates. Remount the table with a new `key` to clear all state/cache when switching unrelated datasets.

Details span every visible column. CSS grid transitions animate both opening and closing; collapsed content is inert and hidden from assistive technology. Reduced-motion preferences disable motion. Headers, pagination and expansion use native buttons, with `aria-sort`, `aria-expanded`, `aria-controls`, `aria-busy` and semantic table markup. Multiple left-pinned columns accumulate pixel offsets; the scroll container adds a shadow when horizontally scrolled.

## Exercise the edge cases

Open **Demo controls** beneath the timetable:

1. **Reload / loading**: 1.1-second column-aligned skeletons.
2. **Empty dataset**: empty state. Search/filter combinations can also return no results.
3. **Request failure**: failed initial fetch; **Try again** restores normal data.
4. **528 classes**: all 528 rows on Monday, paginated locally. Sort and navigate to the last page.
5. **Fail next attendee request**: then expand an uncached lazy row, such as Reformer Foundations. A 1.4-second skeleton precedes the forced failure; **Try again** recovers. This flag only affects lazy requests, not inline/cached rows.
6. **Morning Flow** has inline attendees. **Reformer Foundations** loads attendees on demand. **Barre & Balance** has an empty inline list.
7. Hide columns, narrow the viewport, and scroll horizontally; the class name remains pinned.
8. Equipment demo: toggle server mode, sort, change page size and search. Its parent supplies only the requested page after 850 ms.

`npm test` checks sorting cycles, immutable/stable sorting, numeric collation, invalid sort keys, non-sortable columns, custom comparators, null values, malformed/out-of-range pagination and complete 528-row traversal. TypeScript, lint and production build provide additional validation. No automated browser performance or accessibility audit is included.
