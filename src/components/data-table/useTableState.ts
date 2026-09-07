"use client";
import { useMemo, useState } from "react";
import type {
  ExpandState,
  PaginationState,
  SortState,
  TableStateOptions,
} from "./types";
import { clampPagination, nextSort, sortRows } from "./state";

export function useTableState<T>(options: TableStateOptions<T>) {
  const [internalSort, setInternalSort] = useState<SortState>(
    options.defaultSortState ?? null,
  );
  const [internalPage, setInternalPage] = useState<PaginationState>(
    options.defaultPaginationState ?? { pageIndex: 0, pageSize: 8 },
  );
  const [internalExpanded, setInternalExpanded] = useState<ExpandState>(
    new Set(),
  );
  const requestedSort =
    options.sortState === undefined ? internalSort : options.sortState;
  const sort = options.columns.some(
    (c) => c.key === requestedSort?.key && c.sortable,
  )
    ? requestedSort
    : null;

  const sorted = useMemo(
    () =>
      options.manualSorting
        ? options.data
        : sortRows(options.data, options.columns, sort),
    [options.data, options.columns, options.manualSorting, sort],
  );
  
  const total = options.manualPagination
    ? Math.max(0, options.totalCount ?? options.data.length)
    : options.data.length;
  const pagination = clampPagination(
    options.paginationState ?? internalPage,
    total,
  );
  const expanded = options.expandedState ?? internalExpanded;
  const rows = useMemo(
    () =>
      options.manualPagination
        ? sorted
        : sorted.slice(
            pagination.pageIndex * pagination.pageSize,
            (pagination.pageIndex + 1) * pagination.pageSize,
          ),
    [
      sorted,
      options.manualPagination,
      pagination.pageIndex,
      pagination.pageSize,
    ],
  );
  const columns = options.columns.filter(
    (c) => !options.hiddenColumns?.includes(c.key),
  );
  function setPagination(next: PaginationState) {
    const safe = clampPagination(next, total);
    if (options.paginationState === undefined) setInternalPage(safe);
    options.onPaginationChange?.(safe);
    if (safe.pageIndex !== pagination.pageIndex)
      options.onPageChange?.(safe.pageIndex);
    if (safe.pageSize !== pagination.pageSize)
      options.onPageSizeChange?.(safe.pageSize);
  }
  function toggleSort(key: string) {
    if (!options.columns.some((c) => c.key === key && c.sortable)) return;
    const next = nextSort(sort, key);
    if (options.sortState === undefined) setInternalSort(next);
    options.onSortChange?.(next);
    setPagination({ ...pagination, pageIndex: 0 });
  }
  function toggleExpanded(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    if (options.expandedState === undefined) setInternalExpanded(next);
    options.onExpandedChange?.(next);
  }
  return {
    rows,
    columns,
    sort,
    pagination,
    expanded,
    total,
    pageCount: Math.max(1, Math.ceil(total / pagination.pageSize)),
    setPagination,
    toggleSort,
    toggleExpanded,
  };
}
