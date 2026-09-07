import type { ColumnDef, PaginationState, SortState, SortValue } from "./types";
export function nextSort(current: SortState, key: string): SortState {
  return current?.key !== key
    ? { key, direction: "asc" }
    : current.direction === "asc"
      ? { key, direction: "desc" }
      : null;
}
function compareValues(a: SortValue, b: SortValue): number {
  if (a == null) return b == null ? 0 : 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}
export function sortRows<T>(
  data: readonly T[],
  columns: readonly ColumnDef<T>[],
  sort: SortState,
): readonly T[] {
  const column = columns.find((c) => c.key === sort?.key && c.sortable);
  if (!column || !sort) return data;
  return [...data].sort(
    (a, b) =>
      (column.compare
        ? column.compare(a, b)
        : compareValues(column.accessor(a), column.accessor(b))) *
      (sort.direction === "asc" ? 1 : -1),
  );
}
export function clampPagination(
  value: PaginationState,
  count: number,
): PaginationState {
  const pageSize = Number.isFinite(value.pageSize)
    ? Math.max(1, Math.floor(value.pageSize))
    : 10;
  const max = Math.max(0, Math.ceil(Math.max(0, count) / pageSize) - 1);
  return {
    pageSize,
    pageIndex: Math.min(
      max,
      Math.max(
        0,
        Number.isFinite(value.pageIndex) ? Math.floor(value.pageIndex) : 0,
      ),
    ),
  };
}
