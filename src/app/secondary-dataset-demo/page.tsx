"use client";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { StudioShell } from "@/components/StudioShell";
import { Icon } from "@/components/Icon";
import { clampPagination, sortRows } from "@/components/data-table/state";
import type {
  ColumnDef,
  PaginationState,
  SortState,
} from "@/components/data-table/types";
interface Equipment {
  serial: string;
  product: string;
  location: string;
  quantity: number;
  condition: string;
  purchased: number;
  notes: string[];
}
const equipment: Equipment[] = Array.from({ length: 37 }, (_, i) => ({
  serial: `EQ-${String(1001 + i)}`,
  product: [
    "Pilates reformer",
    "Yoga mat",
    "Kettlebell set",
    "Resistance bands",
    "Foam roller",
    "Barre rail",
    "Balance ball",
  ][i % 7],
  location: ["Studio A", "Studio B", "Reformer Room"][i % 3],
  quantity: [1, 16, 8, 20, 12, 2, 10][i % 7],
  condition: i % 9 === 0 ? "Needs attention" : "Ready to use",
  purchased: 2023 + (i % 4),
  notes:
    i % 5 === 0
      ? []
      : [
          "Inspected and cleaned after the last session.",
          "Next maintenance check: October 1, 2026.",
        ],
}));
const columns: ColumnDef<Equipment>[] = [
  {
    key: "product",
    header: "Equipment",
    accessor: (r) => r.product,
    sortable: true,
    pinned: true,
    width: 250,
    cell: (r) => (
      <div className="flex items-center gap-[11px] [&_strong]:text-[11px] [&_strong]:font-[550] [&_strong]:tracking-[-0.1px] [&_small]:block [&_small]:text-[#9da58e] [&_small]:text-[9px] [&_small]:mt-[6px] [&_small_>_span]:[margin:0_3px] max-[650px]:gap-[8px] max-[650px]:[&_strong]:text-[10px] max-[650px]:[&_small]:text-[8px]">
        <span className="h-[35px] w-[35px] rounded-[8px] grid place-items-center shrink-0 max-[650px]:h-[29px] max-[650px]:w-[29px] bg-[#eaf0e3] text-[#7a9066]">
          <Icon name="grid" />
        </span>
        <div className="font-medium text-[12px] [&_small]:block [&_small]:text-[9px] [&_small]:text-[#98a28b] [&_small]:mt-[5px]">
          {r.product}
          <small>{r.serial}</small>
        </div>
      </div>
    ),
  },
  {
    key: "location",
    header: "Location",
    accessor: (r) => r.location,
    sortable: true,
    width: 185,
  },
  {
    key: "quantity",
    header: "Quantity",
    accessor: (r) => r.quantity,
    sortable: true,
    width: 120,
  },
  {
    key: "condition",
    header: "Condition",
    accessor: (r) => r.condition,
    sortable: true,
    width: 180,
    cell: (r) => (
      <span
        className={`inline-flex items-center gap-[5px] whitespace-nowrap rounded-[5px] [padding:5px_7px] text-[9px] [border:1px_solid_transparent] [&_i]:w-[4px] [&_i]:h-[4px] [&_i]:rounded-full [&_i]:[background:currentColor] [&.scheduled]:bg-[#edf3e6] [&.scheduled]:border-[#e2ecd6] [&.scheduled]:text-[#849d6c] [&.full]:bg-[#f7f0e2] [&.full]:border-[#f0e7d3] [&.full]:text-[#b39964] [&.cancelled]:bg-[#f7ece7] [&.cancelled]:border-[#f0e2da] [&.cancelled]:text-[#bf9c88] [&.neutral]:bg-[#f1f3ec] [&.neutral]:text-[#89927e] ${r.condition === "Ready to use" ? "scheduled" : "full"}`}
      >
        <i />
        {r.condition}
      </span>
    ),
  },
  {
    key: "purchased",
    header: "Purchase year",
    accessor: (r) => r.purchased,
    sortable: true,
    width: 140,
  },
];
export default function EquipmentPage() {
  const [sort, setSort] = useState<SortState>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [server, setServer] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<readonly Equipment[]>([]);
  const filtered = useMemo(
    () =>
      equipment.filter((r) =>
        `${r.product} ${r.location} ${r.serial}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );
  useEffect(() => {
    if (!server) return;
    let active = true;
    const timer = setTimeout(() => {
      const safe = clampPagination(pagination, filtered.length);
      if (active) {
        setPage(
          sortRows(filtered, columns, sort).slice(
            safe.pageIndex * safe.pageSize,
            (safe.pageIndex + 1) * safe.pageSize,
          ),
        );
        setLoading(false);
      }
    }, 850);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [server, sort, pagination, filtered]);
  return (
    <StudioShell active="equipment">
      <div className="flex items-center justify-between gap-[20px] mb-[31px] [&_p]:text-[#8a9283] [&_p]:text-[11px] [&_p]:mt-[12px] [&_p]:leading-[1.6] min-[1500px]:mb-[36px] max-[950px]:[&_p]:max-w-[350px] max-[950px]:gap-[12px] max-[650px]:block max-[650px]:mb-[23px] max-[650px]:[&_p]:text-[10px] max-[650px]:[&_p]:max-w-[290px]">
        <div>
          <div className="text-[9px] tracking-[1.8px] text-[#8b957e] font-semibold mb-[11px] max-[650px]:text-[8px]">
            THE TOOLS THAT KEEP YOU MOVING
          </div>
          <h1>
            Studio equipment<span>.</span>
          </h1>
          <p>
            A different dataset. The same flexible table. Everything in its
            place.
          </p>
        </div>
        <span className="text-[9px] text-[#9aa18f] [border-left:1px_solid_#dce2d4] pl-[12px] max-[650px]:text-[8px] max-[650px]:pl-[8px]">
          37 equipment records
        </span>
      </div>
      <section className="bg-[#fff] [border:1px_solid_var(--border)] rounded-[10px] shadow-[0_3px_5px_#26321a02] overflow-visible">
        <div className="flex items-center justify-between [padding:22px_22px_20px] gap-[10px] [&_h2]:text-[14px] [&_h2]:flex [&_h2]:items-center [&_h2]:gap-[10px] [&_p]:text-[10px] [&_p]:text-[#929b86] [&_p]:mt-[8px] max-[1200px]:[padding:20px_18px] max-[650px]:[padding:18px_13px] max-[650px]:[&_h2]:text-[12px] max-[650px]:[&_h2]:flex-wrap max-[650px]:[&_h2]:gap-[6px] max-[650px]:[&_p]:text-[9px] max-[650px]:[&_p]:leading-[1.5]">
          <div>
            <h2>Equipment inventory</h2>
            <p>
              Track your studio essentials and expand a row for maintenance
              notes.
            </p>
          </div>
          <label className="flex gap-[8px] items-center text-[11px] text-[#7e8b70] [&_input]:accent-[#345c43] max-[650px]:text-[10px]">
            <input
              type="checkbox"
              checked={server}
              onChange={(e) => {
                setServer(e.target.checked);
                setLoading(e.target.checked);
                setPagination({ pageIndex: 0, pageSize: 8 });
              }}
            />
            Mock server mode
          </label>
        </div>
        <div className="flex items-center gap-[10px] [padding:0_22px_19px] max-[1200px]:pl-[18px] max-[1200px]:pr-[18px] max-[950px]:flex-wrap max-[650px]:[padding:0_12px_14px] max-[650px]:gap-[7px]">
          <div className="flex items-center gap-[8px] [border:1px_solid_#e2e6da] rounded-[6px] h-[35px] [padding:0_11px] text-[#9da58f] max-w-[305px] w-full mr-[2px] [&_input]:border-0 [&_input]:bg-transparent [&_input]:min-w-0 [&_input]:w-full [&_input]:text-[10px] [&_input]:text-[var(--text)] [&_input]:[outline:none] [&:focus-within]:border-[#8ba474] [&:focus-within]:shadow-[0_0_0_2px_#e8efdf] [&_input::placeholder]:text-[#a0a693] [&_button]:border-0 [&_button]:[background:none] [&_button]:p-[2px] [&_button]:text-[17px] max-[950px]:max-w-[none] max-[950px]:flex-1 max-[950px]:min-w-[160px] max-[650px]:[flex-basis:100%] max-[650px]:h-[33px]">
            <Icon name="search" size={16} />
            <input
              aria-label="Search equipment"
              placeholder="Search equipment or location..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
                if (server) setLoading(true);
              }}
            />
          </div>
        </div>
        <div className="[padding:18px_22px] bg-[#f6f8f1] [border-bottom:1px_solid_var(--border)] text-[#8a987b] text-[11px] leading-[1.7] max-[650px]:text-[10px]">
          {server
            ? "Server mode: the parent sorts and supplies one page after an 850 ms mock request. Sort and pagination are controlled."
            : "Client mode: all 37 records are supplied to DataTable<Equipment>. Sorting and pagination happen inside the generic headless hook."}
        </div>
        <DataTable
          key={server ? "server" : "client"}
          label="Studio equipment"
          data={server ? page : filtered}
          columns={columns}
          getRowId={(r) => r.serial}
          sortState={sort}
          onSortChange={(next) => {
            setSort(next);
            if (server) setLoading(true);
          }}
          paginationState={pagination}
          onPaginationChange={(next) => {
            setPagination(next);
            if (server) setLoading(true);
          }}
          manualSorting={server}
          manualPagination={server}
          totalCount={filtered.length}
          loading={server && loading}
          emptyTitle="No equipment found"
          expansion={{
            getChildren: (r) => r.notes,
            renderChildren: (notes) => (
              <div className="[padding:8px_0] text-[12px] leading-[1.8] [&_strong]:block [&_strong]:mb-[6px]">
                <strong>Maintenance notes</strong>
                {notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            ),
            emptyMessage: "No maintenance notes",
          }}
        />
      </section>
    </StudioShell>
  );
}
