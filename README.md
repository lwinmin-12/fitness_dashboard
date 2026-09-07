# Form Studio — reusable data table

A React + TypeScript studio timetable built with Next.js 16.3, Tailwind CSS v4, and React Icons. The reusable table supports sorting, pagination, expandable rows, and sticky columns without a table/grid library. All data is simulated and resets on refresh.

**Live website (Vercel): [https://fitnessdashboard-ten.vercel.app/](https://fitnessdashboard-ten.vercel.app/)**

## Setup instructions

Use Node.js 22.18+ and npm. Node 24 is recommended; the tests use Node's built-in TypeScript support. No environment variables, API keys, or database setup are required.

From the project directory, install dependencies and start development:

```sh
npm ci
npm run dev
```

Open the Local URL printed by Next.js (normally `http://localhost:3000`).

To build and run the production app:

```sh
npm run build
npm start
```

For environments where Turbopack cannot start its CSS worker, use `npm run build -- --webpack` as the production-build alternative.

Run the available checks:

```sh
npm run lint
npx tsc --noEmit
npm test
```

### Demo routes

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
- `src/app/globals.css`: Tailwind import, shared base styles, theme variables, and loading keyframes. Component styling lives in Tailwind classes in the TSX files; extracting the table also requires Tailwind processing and these shared variables/keyframes.
- `src/components/Icon.tsx`: shared wrapper around Lucide icons from `react-icons/lu`.

## Component API and column definitions

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

`DataTable<T, C>` separates the parent row type `T` from the optional child type `C`. The table does not depend on class or equipment fields: `getRowId` supplies identity, columns supply presentation and sorting, and `expansion` supplies child content.

Column order follows the definitions array. Each `key` must be unique and stable; it identifies sorting and column visibility. `accessor` returns the underlying sortable value, while `cell` optionally renders richer content such as an avatar or badge. Without `cell`, the table displays the accessor value as text and uses an em dash for nullish values. Set `sortable: true` to enable the header control; use `compare(a, b)` when accessor-based sorting is insufficient. Widths are in pixels and default to 180. Declare left-pinned columns first for a predictable layout.

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

## Client-side vs server-side sorting and pagination

| Concern | Client-side mode | Server-side contract |
| --- | --- | --- |
| Supplied data | All filtered rows | One already-sorted page |
| Sorting | The hook sorts a copy before pagination | Set `manualSorting` to bypass local sorting |
| Pagination | The hook slices the sorted rows | Set `manualPagination` to bypass local slicing |
| Result count | Derived from `data.length` | Supply the complete filtered `totalCount` |
| State ownership | Internal or parent-controlled | Parent-controlled sort and pagination drive requests |

The timetable uses client-side processing, including the 528-row demo. Search and filters run in the parent before rows reach the table. Sorting cycles ascending → descending → original input order and resets the page to zero. Sorting is stable and does not mutate the input array; numeric values and dates have native comparisons, strings use numeric-aware, case-insensitive collation, and a column may supply a custom comparator.

The equipment page demonstrates the server-side contract with 37 records and an 850 ms timer. Its parent owns sort and pagination state, sorts and slices the fixtures, and passes the resulting page to the table with both manual flags enabled. This is a browser-based simulation, not a deployed backend API. Effect cleanup clears obsolete timers so old requests do not replace newer results.

For a real API, the parent would send the sort key/direction, filters, page index, and page size, then supply the returned rows and total count. Reset or clamp pagination when filters change, handle loading/errors in the parent, and cancel or ignore stale responses. Sorting must happen across the full filtered dataset before slicing; sorting only the returned page would produce an incorrect global order.

## Expandable rows: inline and on-demand children

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

`getChildren` takes precedence, including an empty array. If it returns `undefined`, the first expansion calls `loadChildren`. Promises are deduplicated and successful results cached by row ID and row object for the table’s lifetime, including pagination and collapse/reopen. The loader replaces a cached entry when it runs for a different row object with the same ID. Already-mounted detail content does not provide full live-data revalidation; remount the table when replacing a dataset that needs fresh child results. Keep rows and the expansion configuration stable with memoization for efficient reuse. Failed requests are removed from the cache so retry can recover. Unmounted detail panels ignore pending updates. Remount the table with a new `key` to clear all state/cache when switching unrelated datasets.

Details span every visible column. CSS grid transitions animate both opening and closing; collapsed content is inert and hidden from assistive technology. Reduced-motion preferences disable motion. Headers, pagination and expansion use native buttons, with `aria-sort`, `aria-expanded`, `aria-controls`, `aria-busy` and semantic table markup.

## Sticky-column approach

The table sits in a horizontally scrollable, keyboard-focusable container and uses `table-layout: fixed` with explicit column widths. A `pinned: true` column applies `position: sticky` and a calculated `left` offset to both header and body cells. Offsets accumulate the widths of preceding visible pinned columns (180 px when unspecified), reserving 46 px for the expansion control when enabled. Hidden columns are excluded from this calculation.

Pinned cells have opaque backgrounds and elevated stacking order so scrolling cells pass underneath. The expansion control has its own sticky position at the left edge. A scroll-triggered gradient shadow marks pinned cells while the table is horizontally scrolled. Tailwind handles visual states; dynamic widths and offsets remain inline styles because they depend on runtime column definitions.

The implementation supports left pinning only and does not reorder columns automatically. The compact layout styles the expansion cell at 34 px while offset calculation still reserves 46 px; this fixed-width assumption should be synchronized if adapting the table's responsive sizing.

## State management decision and why

State uses React hooks without Redux, Zustand, or a global context. Table interactions are local to each table, while page-specific filters and mock requests belong to their page. Keeping these concerns local avoids a global store dependency and allows multiple independent table instances.

`useTableState` owns uncontrolled sort, pagination, and expansion state through `useState`. Each can instead be controlled with a value and change callback. Derived sorted and paginated rows use `useMemo`; expansion uses a set of stable row IDs so sorting and paging do not change row identity. Pure helpers implement sort cycling, comparisons, and pagination clamping independently of rendering.

`DataTable` owns presentation state such as horizontal scroll position, visited detail panels, and the per-instance child-promise cache. Pages own search, filters, hidden columns, notifications, and mock loading state. The equipment demo shows how the controlled API lets a parent coordinate requests without changing the table's rendering implementation.

## Tradeoffs and assumptions

- **Custom table vs a grid library:** a small generic API makes the behavior easy to inspect and reuse, but advanced features such as multi-column sorting, resizing, drag reordering, right pinning, and virtualization are outside this implementation.
- **Pagination vs virtualization:** only the current page is rendered, which suits the sample datasets. Client mode still holds and sorts the entire input in memory; larger remote datasets should use the manual sort/pagination contract.
- **Local demo data vs persistence:** classes, attendees, and equipment are fixtures. Added classes disappear on refresh; there is no authentication, database, or production API. The sample week is fixed to September 7–13, 2026.
- **Caching vs freshness:** on-demand results are cached for the table instance with no TTL, eviction policy, or background refresh. Requests are ignored after unmount rather than aborted. Remounting with a new `key` resets the cache and internal state.
- **Stable identity and definitions:** callers must provide unique row IDs and column keys. Memoized columns, expansion configuration, and stable row objects improve reuse. Keep at least one column visible and place pinned columns first.
- **Controlled-state responsibility:** parents must apply callbacks and supply a consistent page and total count in manual mode. The hook clamps invalid pagination for safe rendering but does not synchronize a parent's state during render.
- **Styling and accessibility:** Tailwind utilities preserve the studio design, so extraction requires its theme variables and animation. Semantic markup, native buttons, ARIA state, focus styles, and reduced-motion handling are included; no automated browser accessibility or performance audit has been performed.

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
