"use client";
import { Fragment, useEffect, useId, useState } from "react";
import type { CSSProperties } from "react";
import type { DataTableProps, Expansion } from "./types";
import { useTableState } from "./useTableState";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
type ChildCache<T, C> = Map<string, { row: T; promise: Promise<readonly C[]> }>;

function Detail<T, C>({
  row,
  rowId,
  expansion,
  cache,
}: {
  row: T;
  rowId: string;
  expansion: Expansion<T, C>;
  cache: ChildCache<T, C>;
}) {
  const inline = expansion.getChildren?.(row);
  const [result, setResult] = useState<readonly C[] | undefined>(inline);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (inline !== undefined) return;
    let active = true;
    let entry = cache.get(rowId);
    if (!entry || entry.row !== row) {
      const promise = Promise.resolve().then(() =>
        expansion.loadChildren ? expansion.loadChildren(row) : [],
      );
      entry = { row, promise };
      cache.set(rowId, entry);
    }
    const current = entry;
    current.promise
      .then((data) => {
        if (active) setResult(data);
      })
      .catch((err: unknown) => {
        if (cache.get(rowId) === current) cache.delete(rowId);
        if (active)
          setError(
            err instanceof Error ? err.message : "Unable to load details.",
          );
      });
    return () => {
      active = false;
    };
  }, [row, rowId, expansion, inline, attempt, cache]);
  return (
    <div aria-busy={result === undefined && !error}>
      {error ? (
        <ErrorState
          message={error}
          onRetry={() => {
            setError(null);
            setAttempt((n) => n + 1);
          }}
        />
      ) : result === undefined ? (
        <Skeleton />
      ) : result.length === 0 ? (
        <EmptyState
          title={expansion.emptyMessage ?? "No details yet"}
          description="There are no records for this row."
        />
      ) : (
        expansion.renderChildren(result, row)
      )}
    </div>
  );
}

export function DataTable<T, C = never>(props: DataTableProps<T, C>) {
  const state = useTableState(props);
  const id = useId();
  const [scrolled, setScrolled] = useState(false);
  const [visited, setVisited] = useState(new Set<string>());
  const [childCache] = useState<ChildCache<T, C>>(() => new Map());
  const offsets = new Map<string, number>();
  let left = props.expansion ? 46 : 0;

  state.columns.forEach((c) => {
    if (c.pinned) {
      offsets.set(c.key, left);
      left += c.width ?? 180;
    }
  });
  
  const styleFor = (key: string, width?: number): CSSProperties => ({
    width: width ?? 180,
    minWidth: width ?? 180,
    ...(offsets.has(key)
      ? { position: "sticky", left: offsets.get(key), zIndex: 2 }
      : {}),
  });
  const span = Math.max(1, state.columns.length + (props.expansion ? 1 : 0));
  const start = state.total
    ? state.pagination.pageIndex * state.pagination.pageSize + 1
    : 0;
  const pages = Array.from({ length: state.pageCount }, (_, i) => i).filter(
    (i) =>
      i === 0 ||
      i === state.pageCount - 1 ||
      Math.abs(i - state.pagination.pageIndex) <= 1,
  );
  return (
    <div
      className="[&_table]:border-separate [&_table]:[border-spacing:0] [&_table]:w-full [&_table]:table-fixed [&_table]:text-left [&_th]:bg-[#f7f9f4] [&_th]:h-[43px] [&_th]:text-[10px] [&_th]:font-normal [&_th]:text-[#8a947d] [&_th]:[border-top:1px_solid_#e9eddf] [&_th]:[border-bottom:1px_solid_#e7ebde] [&_th]:[padding:0_17px] [&_td]:h-[76px] [&_td]:[padding:12px_17px] [&_td]:text-[11px] [&_td]:[border-bottom:1px_solid_#edf0e7] [&_td]:align-middle [&_td]:bg-[#fff] [&_td]:[transition:background_0.15s] [&_tr:hover_>_td]:bg-[#f8faf4] [&_tr.row-open_>_td]:bg-[#f8faf4] [&_.pinned]:bg-[#fff] [&_th.pinned]:bg-[#f7f9f4] [&_.expand-cell]:w-[46px] [&_.expand-cell]:min-w-[46px] [&_.expand-cell]:[padding:0_0_0_16px] [&_.expand-cell]:sticky [&_.expand-cell]:z-[3] [&_.detail-row_>_td]:p-0 [&_.detail-row_>_td]:h-[0] [&_.detail-row_>_td]:border-0 [&_.detail-row_>_td]:bg-[#f8faf4] min-[1500px]:[&_td]:h-[81px] max-[650px]:[&_th]:pl-[12px] max-[650px]:[&_th]:pr-[12px] max-[650px]:[&_td]:pl-[12px] max-[650px]:[&_td]:pr-[12px] max-[650px]:[&_.expand-cell]:w-[34px] max-[650px]:[&_.expand-cell]:min-w-[34px] max-[650px]:[&_.expand-cell]:pl-[8px]"
      aria-busy={props.loading || undefined}
    >
      <div
        className={`[&:focus-visible]:[outline:2px_solid_#628452] overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#d5dfca_transparent] max-w-[100%] ${scrolled ? "[&_.pinned-edge::after]:content-[''] [&_.pinned-edge::after]:absolute [&_.pinned-edge::after]:top-[0] [&_.pinned-edge::after]:bottom-[0] [&_.pinned-edge::after]:right-[-6px] [&_.pinned-edge::after]:w-[6px] [&_.pinned-edge::after]:[background:linear-gradient(90deg,_#30422515,_transparent)] [&_.pinned-edge::after]:pointer-events-none" : ""}`}
        onScroll={(e) => setScrolled(e.currentTarget.scrollLeft > 0)}
        tabIndex={0}
        role="region"
        aria-label={`${props.label}, scroll horizontally for more columns`}
      >
        <table
          style={{
            minWidth: state.columns.reduce(
              (sum, c) => sum + (c.width ?? 180),
              props.expansion ? 46 : 0,
            ),
          }}
        >
          <caption className="sr-only">{props.label}</caption>
          <thead>
            <tr>
              {props.expansion && (
                <th className="expand-cell pinned" style={{ left: 0 }}>
                  <span className="sr-only">Expand</span>
                </th>
              )}
              {state.columns.map((c) => (
                <th
                  key={c.key}
                  style={styleFor(c.key, c.width)}
                  className={c.pinned ? "pinned pinned-edge" : ""}
                  aria-sort={
                    c.sortable
                      ? state.sort?.key === c.key
                        ? state.sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                      : undefined
                  }
                >
                  {c.sortable ? (
                    <button
                      className={`border-0 bg-transparent p-0 flex items-center gap-[10px] text-[inherit] w-full h-[42px] text-left text-[10px] [&_>_span]:text-[13px] [&_>_span]:text-[#bdc6b2] [&:hover]:text-[#385630] [&&.sorted]:text-[#385630] [&&.sorted_>_span]:text-[#527546] ${state.sort?.key === c.key ? "sorted" : ""}`}
                      onClick={() => state.toggleSort(c.key)}
                    >
                      {c.header}
                      <span aria-hidden="true">
                        {state.sort?.key === c.key
                          ? state.sort.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.loading ? (
              Array.from({ length: state.pagination.pageSize }, (_, i) => (
                <tr key={i}>
                  {props.expansion && (
                    <td className="expand-cell">
                      <span className="skeleton tiny block h-[13px] w-[85%] rounded-[4px] [background:linear-gradient(90deg,_#edf0e7_25%,_#f7f9f4_50%,_#edf0e7_75%)] [background-size:200%_100%] animate-[shimmer_1.7s_infinite] [&.tiny]:w-[16px]" />
                    </td>
                  )}
                  {state.columns.map((c) => (
                    <td
                      key={c.key}
                      style={styleFor(c.key, c.width)}
                      className={c.pinned ? "pinned" : ""}
                    >
                      <span className="skeleton block h-[13px] w-[85%] rounded-[4px] [background:linear-gradient(90deg,_#edf0e7_25%,_#f7f9f4_50%,_#edf0e7_75%)] [background-size:200%_100%] animate-[shimmer_1.7s_infinite] [&.tiny]:w-[16px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : props.error ? (
              <tr>
                <td colSpan={span}>
                  <ErrorState message={props.error} onRetry={props.onRetry} />
                </td>
              </tr>
            ) : !state.rows.length ? (
              <tr>
                <td colSpan={span}>
                  <EmptyState
                    title={props.emptyTitle}
                    description={props.emptyDescription}
                  />
                </td>
              </tr>
            ) : (
              state.rows.map((row) => {
                const rowId = props.getRowId(row);
                const open = state.expanded.has(rowId);
                const panelId = `${id}-${encodeURIComponent(rowId)}`;
                return (
                  <Fragment key={rowId}>
                    <tr className={open ? "row-open" : ""}>
                      {props.expansion && (
                        <td className="expand-cell pinned" style={{ left: 0 }}>
                          <button
                            className={`w-[23px] h-[25px] border-0 bg-transparent text-[#a5b098] text-[21px] grid place-items-center [transition:transform_0.22s,_background_0.15s] rounded-[4px] [&:hover]:bg-[#e7eddf] [&:hover]:text-[#48663b] [&&.open]:[transform:rotate(90deg)] [&&.open]:text-[#567344] ${open ? "open" : ""}`}
                            aria-label={`${open ? "Collapse" : "Expand"} ${String(state.columns[0]?.accessor(row) ?? "row")}`}
                            aria-expanded={open}
                            aria-controls={panelId}
                            onClick={() => {
                              setVisited((previous) =>
                                new Set(previous).add(rowId),
                              );
                              state.toggleExpanded(rowId);
                            }}
                          >
                            ›
                          </button>
                        </td>
                      )}
                      {state.columns.map((c) => (
                        <td
                          key={c.key}
                          style={styleFor(c.key, c.width)}
                          className={c.pinned ? "pinned pinned-edge" : ""}
                        >
                          {c.cell
                            ? c.cell(row)
                            : String(c.accessor(row) ?? "—")}
                        </td>
                      ))}
                    </tr>
                    {props.expansion && (
                      <tr className="detail-row" aria-hidden={!open}>
                        <td colSpan={span}>
                          <div
                            className={`grid grid-rows-[0fr] [transition:grid-template-rows_0.26s_ease,_visibility_0.26s] invisible [&.expanded]:grid-rows-[1fr] [&.expanded]:visible ${open ? "expanded" : ""}`}
                            id={panelId}
                            inert={!open}
                          >
                            <div className="overflow-hidden min-h-0">
                              <div className="[padding:19px_32px_24px_62px] [border-bottom:1px_solid_var(--border)] max-[650px]:pl-[20px]">
                                {(open || visited.has(rowId)) && (
                                  <Detail
                                    row={row}
                                    rowId={rowId}
                                    expansion={props.expansion}
                                    cache={childCache}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="[padding:16px_22px] flex items-center justify-between gap-[15px] max-[650px]:[padding:13px_12px] max-[650px]:items-start max-[650px]:flex-col max-[650px]:gap-[12px]">
        <div className="text-[9px] text-[#9ca68e] [&_strong]:font-medium [&_strong]:text-[#77866a]">
          Showing{" "}
          <strong>
            {start}–
            {Math.min(
              state.pagination.pageIndex * state.pagination.pageSize +
                state.rows.length,
              state.total,
            )}
          </strong>{" "}
          of <strong>{state.total}</strong> results
        </div>
        <div className="flex items-center gap-[5px] [&_>_label]:text-[9px] [&_>_label]:text-[#9aa68b] [&_>_label]:flex [&_>_label]:gap-[8px] [&_>_label]:items-center [&_>_label]:mr-[12px] [&_select]:[border:1px_solid_#e5eadc] [&_select]:rounded-[5px] [&_select]:text-[10px] [&_select]:text-[#7c8d6c] [&_select]:bg-[#fff] [&_select]:p-[5px] max-[650px]:w-full max-[650px]:gap-[3px] max-[650px]:[&_>_label]:mr-[auto] max-[650px]:[&_>_label]:text-[8px] max-[650px]:[&_>_label]:gap-[5px]">
          <label>
            Rows per page{" "}
            <select
              aria-label="Rows per page"
              value={state.pagination.pageSize}
              onChange={(e) =>
                state.setPagination({
                  pageIndex: 0,
                  pageSize: Number(e.target.value),
                })
              }
            >
              {[
                ...new Set([
                  ...(props.pageSizes ?? [8, 16, 32, 64]),
                  state.pagination.pageSize,
                ]),
              ]
                .sort((a, b) => a - b)
                .map((size) => (
                  <option key={size}>{size}</option>
                ))}
            </select>
          </label>
          <button
            className="[border:1px_solid_transparent] rounded-[5px] h-[27px] min-w-[27px] bg-transparent text-[#8b9a7b] text-[10px] [&:first-of-type]:text-[17px] [&:last-of-type]:text-[17px] [&&.active]:bg-[#eff4e8] [&&.active]:border-[#e2ead7] [&&.active]:text-[#5d7847] [&:hover:not(:disabled)]:bg-[#edf2e5] max-[650px]:h-[25px] max-[650px]:min-w-[24px]"
            aria-label="Previous page"
            disabled={!state.pagination.pageIndex || props.loading}
            onClick={() =>
              state.setPagination({
                ...state.pagination,
                pageIndex: state.pagination.pageIndex - 1,
              })
            }
          >
            ‹
          </button>
          {pages.map((page, i) => (
            <Fragment key={page}>
              {i > 0 && page - pages[i - 1] > 1 && (
                <span className="text-[10px] text-[#a4ad97]">…</span>
              )}
              <button
                className={`[border:1px_solid_transparent] rounded-[5px] h-[27px] min-w-[27px] bg-transparent text-[#8b9a7b] text-[10px] [&:first-of-type]:text-[17px] [&:last-of-type]:text-[17px] [&&.active]:bg-[#eff4e8] [&&.active]:border-[#e2ead7] [&&.active]:text-[#5d7847] [&:hover:not(:disabled)]:bg-[#edf2e5] max-[650px]:h-[25px] max-[650px]:min-w-[24px] ${page === state.pagination.pageIndex ? "active" : ""}`}
                aria-label={`Page ${page + 1}`}
                aria-current={
                  page === state.pagination.pageIndex ? "page" : undefined
                }
                disabled={props.loading}
                onClick={() =>
                  state.setPagination({ ...state.pagination, pageIndex: page })
                }
              >
                {page + 1}
              </button>
            </Fragment>
          ))}
          <button
            className="[border:1px_solid_transparent] rounded-[5px] h-[27px] min-w-[27px] bg-transparent text-[#8b9a7b] text-[10px] [&:first-of-type]:text-[17px] [&:last-of-type]:text-[17px] [&&.active]:bg-[#eff4e8] [&&.active]:border-[#e2ead7] [&&.active]:text-[#5d7847] [&:hover:not(:disabled)]:bg-[#edf2e5] max-[650px]:h-[25px] max-[650px]:min-w-[24px]"
            aria-label="Next page"
            disabled={
              state.pagination.pageIndex >= state.pageCount - 1 || props.loading
            }
            onClick={() =>
              state.setPagination({
                ...state.pagination,
                pageIndex: state.pagination.pageIndex + 1,
              })
            }
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
