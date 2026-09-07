import type { ReactNode } from "react";
export type SortState = { key: string; direction: "asc" | "desc" } | null;
export type PaginationState = { pageIndex: number; pageSize: number };
export type ExpandState = ReadonlySet<string>;
export type SortValue = string | number | boolean | Date | null | undefined;
export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor: (row: T) => SortValue;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: number;
  pinned?: boolean;
  compare?: (a: T, b: T) => number;
}
export interface TableStateOptions<T> {
  data: readonly T[];
  columns: readonly ColumnDef<T>[];
  getRowId: (row: T) => string;
  sortState?: SortState;
  defaultSortState?: SortState;
  onSortChange?: (sort: SortState) => void;
  paginationState?: PaginationState;
  defaultPaginationState?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  expandedState?: ExpandState;
  onExpandedChange?: (expanded: ExpandState) => void;
  manualSorting?: boolean;
  manualPagination?: boolean;
  totalCount?: number;
  hiddenColumns?: readonly string[];
}
export interface Expansion<T, C> {
  getChildren?: (row: T) => readonly C[] | undefined;
  loadChildren?: (row: T) => Promise<readonly C[]>;
  renderChildren: (children: readonly C[], row: T) => ReactNode;
  emptyMessage?: string;
}
export interface DataTableProps<T, C = never> extends TableStateOptions<T> {
  label: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  expansion?: Expansion<T, C>;
  pageSizes?: readonly number[];
}
