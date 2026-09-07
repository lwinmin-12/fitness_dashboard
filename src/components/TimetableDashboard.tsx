"use client";
import { palette } from "./palette";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StudioShell } from "./StudioShell";
import { Icon } from "./Icon";
import { DataTable } from "./data-table/DataTable";
import type { ColumnDef, Expansion } from "./data-table/types";
import { fetchClasses, formatTime, type ClassRow } from "@/mock-data/classes";
import { fetchAttendees, type Attendee } from "@/mock-data/attendees";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const classColumns: ColumnDef<ClassRow>[] = [
  {
    key: "name",
    header: "Class name",
    accessor: (r) => r.name,
    sortable: true,
    width: 180,
    pinned: true,
    cell: (r) => (
      <div className="flex items-center gap-[11px] [&_strong]:text-[11px] [&_strong]:font-[550] [&_strong]:tracking-[-0.1px] [&_small]:block [&_small]:text-[#9da58e] [&_small]:text-[9px] [&_small]:mt-[6px] [&_small_>_span]:[margin:0_3px] max-[650px]:gap-[8px] max-[650px]:[&_strong]:text-[10px] max-[650px]:[&_small]:text-[8px]">
        <span
          className={`h-[35px] w-[35px] rounded-[8px] grid place-items-center shrink-0 max-[650px]:h-[29px] max-[650px]:w-[29px] ${palette[r.color]}`}
        >
          <Icon
            name={
              r.category === "Yoga"
                ? "leaf"
                : r.category === "Strength"
                  ? "chart"
                  : "grid"
            }
            size={19}
          />
        </span>
        <div>
          <strong>{r.name}</strong>
          <small>
            {r.category} <span>·</span> {r.room}
          </small>
        </div>
      </div>
    ),
  },
  {
    key: "instructor",
    header: "Instructor",
    accessor: (r) => r.instructor,
    sortable: true,
    width: 175,
    cell: (r) => (
      <div className="flex gap-[8px] items-center text-[10px] text-[#718064]">
        <span
          className={`w-[29px] h-[29px] rounded-full inline-grid place-items-center text-[9px] font-semibold shrink-0 ${palette[r.color]}`}
        >
          {r.initials}
        </span>
        {r.instructor}
      </div>
    ),
  },
  {
    key: "time",
    header: "Time",
    accessor: (r) => r.start,
    sortable: true,
    width: 190,
    cell: (r) => (
      <div className="text-[10px] text-[#758367] whitespace-nowrap [&_>_span]:text-[#bcc5af] [&_>_span]:[margin:0_3px] [&_small]:text-[9px] [&_small]:text-[#a6ae99] [&_small]:block [&_small]:mt-[6px]">
        {formatTime(r.start)} <span>–</span> {formatTime(r.start + r.duration)}
        <small>{r.duration} min</small>
      </div>
    ),
  },
  {
    key: "attendance",
    header: "Attendance",
    accessor: (r) => r.attendance / r.capacity,
    sortable: true,
    width: 155,
    cell: (r) => (
      <div className="max-w-[112px] [&_>_span]:text-[10px] [&_>_span]:text-[#a1aa93] [&_>_span]:flex [&_>_span]:items-baseline [&_>_span]:gap-[3px] [&_strong]:text-[#637953] [&_strong]:font-medium [&_small]:ml-auto [&_small]:text-[8px] [&_small]:text-[#a3ab98]">
        <span>
          <strong>{r.attendance}</strong> / {r.capacity}
          <small>
            {r.attendance === r.capacity
              ? "Full class"
              : `${r.capacity - r.attendance} spots left`}
          </small>
        </span>
        <div className="h-[4px] bg-[#eef2e6] rounded-[3px] mt-[8px] overflow-hidden [&_i]:block [&_i]:bg-[#aec698] [&_i]:h-full [&_i]:rounded-[3px] [&_i.full]:bg-[#cebca1]">
          <i
            style={{ width: `${(r.attendance / r.capacity) * 100}%` }}
            className={r.attendance === r.capacity ? "full" : ""}
          />
        </div>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    accessor: (r) => r.status,
    sortable: true,
    width: 130,
    cell: (r) => (
      <span
        className={`inline-flex items-center gap-[5px] whitespace-nowrap rounded-[5px] [padding:5px_7px] text-[9px] [border:1px_solid_transparent] [&_i]:w-[4px] [&_i]:h-[4px] [&_i]:rounded-full [&_i]:[background:currentColor] [&.scheduled]:bg-[#edf3e6] [&.scheduled]:border-[#e2ecd6] [&.scheduled]:text-[#849d6c] [&.full]:bg-[#f7f0e2] [&.full]:border-[#f0e7d3] [&.full]:text-[#b39964] [&.cancelled]:bg-[#f7ece7] [&.cancelled]:border-[#f0e2da] [&.cancelled]:text-[#bf9c88] [&.neutral]:bg-[#f1f3ec] [&.neutral]:text-[#89927e] ${r.status.toLowerCase()}`}
      >
        <i />
        {r.status}
      </span>
    ),
  },
];

function Attendees({
  rows,
  parent,
}: {
  rows: readonly Attendee[];
  parent: ClassRow;
}) {
  return (
    <div className="max-w-[1000px] [&&_table]:min-w-[570px]! [&&_table]:[border:1px_solid_#e4eadb] [&&_table]:rounded-[6px] [&&_table]:overflow-hidden [&&_th]:h-[32px] [&&_th]:text-[9px] [&&_th]:[border-top:0] [&&_td]:h-[51px] [&&_td]:[padding:9px_17px] [&&_td]:text-[10px] [&&_td_small]:block [&&_td_small]:text-[9px] [&&_td_small]:text-[#a0a991] [&&_td_small]:mt-[3px] [&&_td_strong]:font-normal [&&_tr:last-child_td]:[border-bottom:0]">
      <div className="flex items-center justify-between mb-[14px] [&_strong]:text-[11px] [&_strong]:font-medium [&_strong_>_span]:bg-[#e5eddc] [&_strong_>_span]:[padding:2px_6px] [&_strong_>_span]:text-[9px] [&_strong_>_span]:rounded-[4px] [&_strong_>_span]:ml-[6px] [&_small]:text-[#98a18b] [&_small]:text-[9px] [&_small_>_span]:[margin:0_5px]">
        <strong>
          Class attendees <span>{rows.length}</span>
        </strong>
        <small>
          {parent.attendees ? "Included with class" : "Loaded on demand"}{" "}
          <span>·</span> {parent.room}
        </small>
      </div>
      <table aria-label={`${parent.name} attendees`}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Payment type</th>
            <th>Booking status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id}>
              <td>
                <div className="flex gap-[8px] items-center text-[10px] text-[#718064]">
                  <span className="w-[29px] h-[29px] rounded-full inline-grid place-items-center text-[9px] font-semibold shrink-0 bg-[#f2f0e1] text-[#a49d65]">
                    {a.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>{a.name}</strong>
                    <small>{a.email}</small>
                  </div>
                </div>
              </td>
              <td>{a.payment}</td>
              <td>
                <span
                  className={`inline-flex items-center gap-[5px] whitespace-nowrap rounded-[5px] [padding:5px_7px] text-[9px] [border:1px_solid_transparent] [&_i]:w-[4px] [&_i]:h-[4px] [&_i]:rounded-full [&_i]:[background:currentColor] [&.scheduled]:bg-[#edf3e6] [&.scheduled]:border-[#e2ecd6] [&.scheduled]:text-[#849d6c] [&.full]:bg-[#f7f0e2] [&.full]:border-[#f0e7d3] [&.full]:text-[#b39964] [&.cancelled]:bg-[#f7ece7] [&.cancelled]:border-[#f0e2da] [&.cancelled]:text-[#bf9c88] [&.neutral]:bg-[#f1f3ec] [&.neutral]:text-[#89927e] ${a.status === "Checked-in" ? "scheduled" : "neutral"}`}
                >
                  {a.status === "Checked-in" && <Icon name="check" size={12} />}{" "}
                  {a.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NewClassDialog({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const before = document.activeElement;
    const container = ref.current;
    container?.querySelector<HTMLInputElement>("input")?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const controls = container?.querySelectorAll<HTMLElement>(
        "button, input, select",
      );
      if (!controls?.length) return;
      const first = controls[0],
        last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (before instanceof HTMLElement) before.focus();
    };
  }, [onClose]);
  return (
    <div
      ref={ref}
      className="w-[440px] bg-[#fbfcf8] [border:1px_solid_#e3e8da] rounded-[13px] p-[29px] shadow-[0_20px_70px_#172c2230] max-h-[90vh] overflow-auto [&_p]:text-[11px] [&_p]:text-[#8a967d] [&_p]:[margin:12px_0_24px] [&_label]:flex [&_label]:flex-col [&_label]:gap-[8px] [&_label]:text-[11px] [&_label]:[margin:16px_0] [&_label]:text-[#6f7c62] [&_input]:h-[38px] [&_input]:[border:1px_solid_#dde4d4] [&_input]:rounded-[6px] [&_input]:[padding:0_11px] [&_input]:bg-[#fff] [&_input]:min-w-0 [&_input]:text-[#485b3d] [&_select]:h-[38px] [&_select]:[border:1px_solid_#dde4d4] [&_select]:rounded-[6px] [&_select]:[padding:0_11px] [&_select]:bg-[#fff] [&_select]:min-w-0 [&_select]:text-[#485b3d] [&_form_>_small]:text-[10px] [&_form_>_small]:text-[#9aa68c] max-[650px]:p-[23px]"
      role="dialog"
      aria-modal="true"
      aria-label="Add a class"
    >
      {children}
    </div>
  );
}

export function TimetableDashboard() {
  const [data, setData] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [day, setDay] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All class types");
  const [status, setStatus] = useState("All statuses");
  const [hidden, setHidden] = useState<string[]>([]);
  const [mode, setMode] = useState<"normal" | "empty" | "error" | "large">(
    "normal",
  );
  const [toast, setToast] = useState("");
  const [showNew, setShowNew] = useState(false);
  const closeDialog = useCallback(() => setShowNew(false), []);
  const [name, setName] = useState("");
  const [newType, setNewType] = useState("Yoga");
  const [newTime, setNewTime] = useState("12:00");
  const [capacity, setCapacity] = useState(16);
  const failChild = useRef(false);
  const generation = useRef(0);

  const load = useCallback(async (next: typeof mode = "normal") => {
    const request = ++generation.current;
    setLoading(true);
    setError(null);
    setMode(next);
    setDay(0);
    try {
      const rows = await fetchClasses(next);
      if (request === generation.current) setData(rows);
    } catch (e) {
      if (request === generation.current)
        setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      if (request === generation.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const request = ++generation.current;
    fetchClasses()
      .then((rows) => {
        if (active && request === generation.current) {
          setData(rows);
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (active && request === generation.current) {
          setError(e instanceof Error ? e.message : "Please try again.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const expansion = useMemo<Expansion<ClassRow, Attendee>>(
    () => ({
      getChildren: (row) => row.attendees,
      loadChildren: (row) => {
        const fail = failChild.current;
        failChild.current = false;
        return fetchAttendees(row.id, row.attendance, fail);
      },
      renderChildren: (rows, row) => <Attendees rows={rows} parent={row} />,
      emptyMessage: "No bookings just yet",
    }),
    [],
  );

  const today = data.filter((r) => r.day === day);

  const filtered = today.filter(
    (r) =>
      `${r.name} ${r.instructor} ${r.room}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (category === "All class types" || r.category === category) &&
      (status === "All statuses" || r.status === status),
  );

  const booked = today.reduce((sum, r) => sum + r.attendance, 0);

  const places = today
    .filter((r) => r.status !== "Cancelled")
    .reduce((sum, r) => sum + r.capacity, 0);

  function exportData() {
    const csv = [
      ["Class", "Instructor", "Time", "Attendance", "Capacity", "Status"],
      ...filtered.map((r) => [
        r.name,
        r.instructor,
        formatTime(r.start),
        r.attendance,
        r.capacity,
        r.status,
      ]),
    ]
      .map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-class-schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Your schedule has been exported.");
  }

  return (
    <StudioShell>
      <div className="flex items-center justify-between gap-[20px] mb-[31px] [&_p]:text-[#8a9283] [&_p]:text-[11px] [&_p]:mt-[12px] [&_p]:leading-[1.6] min-[1500px]:mb-[36px] max-[950px]:[&_p]:max-w-[350px] max-[950px]:gap-[12px] max-[650px]:block max-[650px]:mb-[23px] max-[650px]:[&_p]:text-[10px] max-[650px]:[&_p]:max-w-[290px]">
        <div>
          <div className="text-[9px] tracking-[1.8px] text-[#8b957e] font-semibold mb-[11px] max-[650px]:text-[8px]">
            YOUR STUDIO, IN SYNC
          </div>
          <h1>
            Class timetable<span>.</span>
          </h1>
          <p>
            A little structure. A lot of movement. Here’s what’s on at your
            studio.
          </p>
        </div>

        <div className="flex gap-[9px] pt-[19px] max-[950px]:gap-[6px] max-[950px]:[&_.button]:text-[10px] max-[950px]:[&_.button]:[padding:0_10px] max-[650px]:pt-[17px] max-[650px]:[&_.button]:min-h-[34px] max-[650px]:[&_.button]:[padding:0_12px]">
          <button
            className="button inline-flex items-center justify-center gap-[8px] min-h-[36px] [border:1px_solid_#dfe4d8] bg-[#fff] rounded-[6px] [padding:0_13px] text-[11px] font-medium whitespace-nowrap [&:hover]:bg-[#f0f4eb] [&:hover]:border-[#c4cfb7] [&.primary]:bg-[#345c43] [&.primary]:border-[#345c43] [&.primary]:text-[#fff] [&.primary:hover]:bg-[#264c34]"
            onClick={exportData}
            disabled={loading || !!error}
          >
            <Icon name="download" size={17} />
            Export
          </button>
          <button
            className="button primary inline-flex items-center justify-center gap-[8px] min-h-[36px] [border:1px_solid_#dfe4d8] bg-[#fff] rounded-[6px] [padding:0_13px] text-[11px] font-medium whitespace-nowrap [&:hover]:bg-[#f0f4eb] [&:hover]:border-[#c4cfb7] [&.primary]:bg-[#345c43] [&.primary]:border-[#345c43] [&.primary]:text-[#fff] [&.primary:hover]:bg-[#264c34]"
            onClick={() => setShowNew(true)}
            disabled={loading || !!error}
          >
            <Icon name="plus" size={18} />
            Add class
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(4,_1fr)] gap-[15px] mb-[33px] min-[1500px]:mb-[36px] max-[950px]:gap-[10px] max-[650px]:grid-cols-[repeat(2,_1fr)] max-[650px]:gap-[10px] max-[650px]:mb-[26px]">
        <div className="bg-[var(--surface)] [border:1px_solid_var(--border)] rounded-[9px] [padding:17px_19px_18px] shadow-[0_2px_2px_#28352302] min-w-0 min-[1500px]:p-[22px] max-[1200px]:[padding:15px_13px] max-[650px]:[padding:12px_13px]">
          <div className="flex items-center justify-between text-[11px] text-[#75806c] max-[950px]:text-[10px] max-[650px]:text-[10px]">
            Total classes
            <span className="w-[29px] h-[29px] grid place-items-center rounded-[7px] max-[950px]:w-[25px] max-[950px]:h-[25px] max-[650px]:w-[24px] max-[650px]:h-[24px] max-[650px]:[&_svg]:w-[15px] bg-[#eaf0e3] text-[#7a9066]">
              <Icon name="calendar" />
            </span>
          </div>
          <div className="text-[31px] tracking-[-1px] mt-[10px] flex items-baseline gap-[9px] max-[950px]:text-[29px] max-[650px]:mt-[8px] max-[650px]:text-[28px]">
            {loading || error ? "—" : today.length}
            <span className="text-[9px] tracking-normal text-[#98a08e] font-normal max-[1200px]:text-[8px] max-[950px]:hidden max-[650px]:hidden">
              on the schedule
            </span>
          </div>
          <div className="mt-[12px] text-[9px] text-[#98a08e] max-[950px]:text-[8px] max-[650px]:mt-[9px] max-[650px]:leading-[1.4]">
            <span className="text-[#7d9666]">A day full of possibility</span>
          </div>
        </div>
        <div className="bg-[var(--surface)] [border:1px_solid_var(--border)] rounded-[9px] [padding:17px_19px_18px] shadow-[0_2px_2px_#28352302] min-w-0 min-[1500px]:p-[22px] max-[1200px]:[padding:15px_13px] max-[650px]:[padding:12px_13px]">
          <div className="flex items-center justify-between text-[11px] text-[#75806c] max-[950px]:text-[10px] max-[650px]:text-[10px]">
            Total bookings
            <span className="w-[29px] h-[29px] grid place-items-center rounded-[7px] max-[950px]:w-[25px] max-[950px]:h-[25px] max-[650px]:w-[24px] max-[650px]:h-[24px] max-[650px]:[&_svg]:w-[15px] bg-[#f0ecf7] text-[#a395bc]">
              <Icon name="users" />
            </span>
          </div>
          <div className="text-[31px] tracking-[-1px] mt-[10px] flex items-baseline gap-[9px] max-[950px]:text-[29px] max-[650px]:mt-[8px] max-[650px]:text-[28px]">
            {loading || error ? "—" : booked}
            <span className="text-[9px] tracking-normal text-[#98a08e] font-normal max-[1200px]:text-[8px] max-[950px]:hidden max-[650px]:hidden">
              members moving
            </span>
          </div>
          <div className="mt-[12px] text-[9px] text-[#98a08e] max-[950px]:text-[8px] max-[650px]:mt-[9px] max-[650px]:leading-[1.4]">
            Across all of today’s classes
          </div>
        </div>
        <div className="bg-[var(--surface)] [border:1px_solid_var(--border)] rounded-[9px] [padding:17px_19px_18px] shadow-[0_2px_2px_#28352302] min-w-0 min-[1500px]:p-[22px] max-[1200px]:[padding:15px_13px] max-[650px]:[padding:12px_13px]">
          <div className="flex items-center justify-between text-[11px] text-[#75806c] max-[950px]:text-[10px] max-[650px]:text-[10px]">
            Average occupancy
            <span className="w-[29px] h-[29px] grid place-items-center rounded-[7px] max-[950px]:w-[25px] max-[950px]:h-[25px] max-[650px]:w-[24px] max-[650px]:h-[24px] max-[650px]:[&_svg]:w-[15px] bg-[#f8eee3] text-[#c09b76]">
              <Icon name="chart" />
            </span>
          </div>

          <div className="text-[31px] tracking-[-1px] mt-[10px] flex items-baseline gap-[9px] max-[950px]:text-[29px] max-[650px]:mt-[8px] max-[650px]:text-[28px]">
            {loading || error
              ? "—"
              : `${places ? Math.round((booked / places) * 100) : 0}%`}
          </div>
          <div className="mt-[12px] text-[9px] text-[#98a08e] max-[950px]:text-[8px] max-[650px]:mt-[9px] max-[650px]:leading-[1.4]">
            A little space for a few more
          </div>
        </div>
        <div className="bg-[var(--surface)] [border:1px_solid_var(--border)] rounded-[9px] [padding:17px_19px_18px] shadow-[0_2px_2px_#28352302] min-w-0 min-[1500px]:p-[22px] max-[1200px]:[padding:15px_13px] max-[650px]:[padding:12px_13px]">
          <div className="flex items-center justify-between text-[11px] text-[#75806c] max-[950px]:text-[10px] max-[650px]:text-[10px]">
            Full classes
            <span className="w-[29px] h-[29px] grid place-items-center rounded-[7px] max-[950px]:w-[25px] max-[950px]:h-[25px] max-[650px]:w-[24px] max-[650px]:h-[24px] max-[650px]:[&_svg]:w-[15px] bg-[#f2f0e1] text-[#a49d65]">
              <Icon name="check" />
            </span>
          </div>
          <div className="text-[31px] tracking-[-1px] mt-[10px] flex items-baseline gap-[9px] max-[950px]:text-[29px] max-[650px]:mt-[8px] max-[650px]:text-[28px]">
            {loading || error
              ? "—"
              : today.filter((r) => r.status === "Full").length}
            <span className="text-[9px] tracking-normal text-[#98a08e] font-normal max-[1200px]:text-[8px] max-[950px]:hidden max-[650px]:hidden">
              at full capacity
            </span>
          </div>
          <div className="mt-[12px] text-[9px] text-[#98a08e] max-[950px]:text-[8px] max-[650px]:mt-[9px] max-[650px]:leading-[1.4]">
            <span className="inline-block bg-[#a2b78b] rounded-full w-[5px] h-[5px] mr-[5px]" />{" "}
            Good energy. Great company.
          </div>
        </div>
      </div>

      <section className="mb-[24px]">
        <div className="flex justify-between items-center mb-[15px]">
          <div className="flex gap-[12px] items-center max-[650px]:[&_h2]:text-[14px] max-[650px]:gap-[8px]">
            <h2>Weekly schedule</h2>
            <span className="text-[9px] text-[#9aa18f] [border-left:1px_solid_#dce2d4] pl-[12px] max-[650px]:text-[8px] max-[650px]:pl-[8px]">
              September 2026
            </span>
          </div>
          <button
            className="button inline-flex items-center justify-center gap-[8px] min-h-[29px] [border:1px_solid_#dfe4d8] bg-[#fff] rounded-[6px] [padding:0_12px] text-[10px] font-medium whitespace-nowrap [&:hover]:bg-[#f0f4eb] [&:hover]:border-[#c4cfb7] [&.primary]:bg-[#345c43] [&.primary]:border-[#345c43] [&.primary]:text-[#fff] [&.primary:hover]:bg-[#264c34]"
            onClick={() => setDay(0)}
          >
            This week
          </button>
        </div>
        <div className="flex items-center bg-[#fff] [border:1px_solid_var(--border)] rounded-[9px] [padding:10px_19px] gap-[23px] max-[1200px]:gap-[15px] max-[650px]:[padding:8px_5px] max-[650px]:gap-[0]">
          <div className="flex items-center gap-[11px] pr-[23px] [border-right:1px_solid_var(--border)] text-[#78866b] min-w-[147px] [&_strong]:text-[12px] [&_strong]:text-[#475a3e] [&_small]:block [&_small]:text-[9px] [&_small]:text-[#a0a792] [&_small]:mt-[6px] max-[650px]:hidden">
            <Icon name="calendar" size={20} />
            <div>
              <strong>Sep 7 – 13</strong>
              <small>Week 37</small>
            </div>
          </div>
          <div className="flex justify-between gap-[12px] flex-1 max-w-[665px] max-[1200px]:gap-[5px] max-[650px]:gap-[2px] max-[650px]:max-w-[none]">
            {days.map((d, i) => (
              <button
                key={d}
                className={`h-[72px] min-w-[54px] rounded-[7px] flex flex-col items-center justify-center gap-[6px] [border:1px_solid_transparent] bg-transparent [&_>_span]:text-[9px] [&_>_span]:text-[#98a18c] [&_>_strong]:text-[17px] [&_>_strong]:font-medium [&_>_strong]:text-[#6c7b5f] [&_>_i]:w-[3px] [&_>_i]:h-[3px] [&_>_i]:bg-[#c2cdaf] [&_>_i]:rounded-full [&:hover]:bg-[#f4f6ef] [&&.selected]:bg-[#e8efde] [&&.selected]:border-[#dce6cd] [&&.selected_>_span]:text-[#7b905f] [&&.selected_>_strong]:text-[#3c5d2c] [&&.selected_>_i]:bg-[#7b9b5b] max-[1200px]:min-w-[45px] max-[650px]:min-w-0 max-[650px]:w-[14.28%] max-[650px]:h-[65px] max-[650px]:[&_>_span]:text-[8px] max-[650px]:[&_>_strong]:text-[15px] ${day === i ? "selected" : ""}`}
                aria-pressed={day === i}
                onClick={() => setDay(i)}
              >
                <span>{d}</span>
                <strong>{7 + i}</strong>
                <i />
              </button>
            ))}
          </div>
          <div className="pl-[27px] ml-auto text-center min-w-[94px] text-[#bac5a9] [&_small]:text-[8px] [&_small]:block [&_small]:mt-[6px] [&_small]:text-[#a0ad8e] max-[1200px]:hidden">
            <span className="text-[26px] block leading-[1]">✳</span>
            <small>Find your flow.</small>
          </div>
        </div>
      </section>

      <section className="bg-[#fff] [border:1px_solid_var(--border)] rounded-[10px] shadow-[0_3px_5px_#26321a02] overflow-visible">
        <div className="flex items-center justify-between [padding:22px_22px_20px] gap-[10px] [&_h2]:text-[14px] [&_h2]:flex [&_h2]:items-center [&_h2]:gap-[10px] [&_p]:text-[10px] [&_p]:text-[#929b86] [&_p]:mt-[8px] max-[1200px]:[padding:20px_18px] max-[650px]:[padding:18px_13px] max-[650px]:[&_h2]:text-[12px] max-[650px]:[&_h2]:flex-wrap max-[650px]:[&_h2]:gap-[6px] max-[650px]:[&_p]:text-[9px] max-[650px]:[&_p]:leading-[1.5]">
          <div>
            <h2>
              {
                [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ][day]
              }
              , September {7 + day}
              <span className="text-[9px] text-[#889574] bg-[#f1f4eb] [border:1px_solid_#e7ecde] rounded-[5px] font-normal tracking-normal [padding:4px_7px] max-[650px]:text-[8px]">
                {loading ? "…" : filtered.length} classes
              </span>
            </h2>
            <p>Your daily lineup. Expand a class to see who’s joining.</p>
          </div>
          <span className="flex items-center gap-[6px] text-[#9da58f] text-[9px] max-[950px]:hidden">
            <Icon name="clock" size={14} /> Studio time (ICT)
          </span>
        </div>

        <div className="flex items-center gap-[10px] [padding:0_22px_19px] max-[1200px]:pl-[18px] max-[1200px]:pr-[18px] max-[950px]:flex-wrap max-[650px]:[padding:0_12px_14px] max-[650px]:gap-[7px]">
          <div className="flex items-center gap-[8px] [border:1px_solid_#e2e6da] rounded-[6px] h-[35px] [padding:0_11px] text-[#9da58f] max-w-[305px] w-full mr-[2px] [&_input]:border-0 [&_input]:bg-transparent [&_input]:min-w-0 [&_input]:w-full [&_input]:text-[10px] [&_input]:text-[var(--text)] [&_input]:[outline:none] [&:focus-within]:border-[#8ba474] [&:focus-within]:shadow-[0_0_0_2px_#e8efdf] [&_input::placeholder]:text-[#a0a693] [&_button]:border-0 [&_button]:[background:none] [&_button]:p-[2px] [&_button]:text-[17px] max-[950px]:max-w-[none] max-[950px]:flex-1 max-[950px]:min-w-[160px] max-[650px]:[flex-basis:100%] max-[650px]:h-[33px]">
            <Icon name="search" size={17} />
            <input
              aria-label="Search classes"
              placeholder="Search classes or instructors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button aria-label="Clear search" onClick={() => setQuery("")}>
                ×
              </button>
            )}
          </div>
          <select
            className="h-[35px] text-[10px] [padding:0_27px_0_12px] [border:1px_solid_#e2e6da] rounded-[6px] bg-[#fff] text-[#6d7963] max-[650px]:text-[9px] max-[650px]:h-[32px] max-[650px]:pl-[8px] max-[650px]:pr-[10px] max-[650px]:max-w-[115px] max-[650px]:flex-1"
            aria-label="Class type"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {[
              "All class types",
              "Yoga",
              "Pilates",
              "Strength",
              "HIIT",
              "Barre",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="h-[35px] text-[10px] [padding:0_27px_0_12px] [border:1px_solid_#e2e6da] rounded-[6px] bg-[#fff] text-[#6d7963] max-[650px]:text-[9px] max-[650px]:h-[32px] max-[650px]:pl-[8px] max-[650px]:pr-[10px] max-[650px]:max-w-[115px] max-[650px]:flex-1"
            aria-label="Class status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["All statuses", "Scheduled", "Full", "Cancelled"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <details className="ml-auto relative [&_summary]:list-none [&_summary]:text-[10px] [&_summary]:min-h-[35px] [&_summary::-webkit-details-marker]:hidden max-[650px]:[&_summary]:text-[0] max-[650px]:[&_summary]:gap-[0] max-[650px]:[&_summary]:w-[32px] max-[650px]:[&_summary]:min-h-[32px] max-[650px]:[&_summary]:p-0 max-[650px]:ml-auto">
            <summary className="button inline-flex items-center justify-center gap-[8px] min-h-[36px] [border:1px_solid_#dfe4d8] bg-[#fff] rounded-[6px] [padding:0_13px] text-[11px] font-medium whitespace-nowrap [&:hover]:bg-[#f0f4eb] [&:hover]:border-[#c4cfb7] [&.primary]:bg-[#345c43] [&.primary]:border-[#345c43] [&.primary]:text-[#fff] [&.primary:hover]:bg-[#264c34] max-[950px]:gap-[6px] max-[950px]:[padding:0_10px] max-[650px]:min-h-[32px] max-[650px]:[padding:0_9px] max-[650px]:gap-0 max-[650px]:[&_.btn-label]:hidden">
              <Icon name="columns" size={16} />
              <span className="btn-label">Columns</span>
            </summary>
            <div className="absolute right-[0] top-[41px] z-[8] bg-[#fff] [border:1px_solid_var(--border)] shadow-[0_8px_30px_#29382e15] rounded-[8px] p-[9px] min-w-[150px] [&_label]:flex [&_label]:items-center [&_label]:gap-[9px] [&_label]:p-[9px] [&_label]:text-[11px] [&_input]:accent-[var(--green)]">
              {classColumns
                .filter((c) => !c.pinned)
                .map((c) => (
                  <label key={c.key}>
                    <input
                      type="checkbox"
                      checked={!hidden.includes(c.key)}
                      onChange={() =>
                        setHidden((prev) =>
                          prev.includes(c.key)
                            ? prev.filter((k) => k !== c.key)
                            : [...prev, c.key],
                        )
                      }
                    />
                    {c.header}
                  </label>
                ))}
            </div>
          </details>
        </div>

        <DataTable
          data={filtered}
          columns={classColumns}
          getRowId={(r) => r.id}
          label="Studio class timetable"
          expansion={expansion}
          hiddenColumns={hidden}
          loading={loading}
          error={error}
          onRetry={() => void load()}
          emptyTitle="No classes scheduled"
          emptyDescription="Try another day or clear your filters to find your next class."
        />
      </section>

      <div className="flex justify-between gap-[20px] items-start mt-[17px] [&_>_span]:flex [&_>_span]:items-center [&_>_span]:gap-[7px] [&_>_span]:text-[9px] [&_>_span]:text-[#a0aa91] [&_>_span]:leading-[1.5] max-[950px]:[&_>_span]:max-w-[70%] max-[950px]:[&_>_span]:text-[8px] max-[650px]:gap-[10px] max-[650px]:mt-[13px] max-[650px]:[&_>_span]:text-[8px] max-[650px]:[&_>_span]:items-start max-[650px]:[&_>_span]:max-w-[65%] max-[650px]:[&_>_span]:gap-[5px] max-[650px]:[&_>_span_svg]:w-[12px]">
        <span>
          <Icon name="help" size={15} /> A full class is a good thing. Keep an
          eye on attendance as your day unfolds.
        </span>
        <details className="relative shrink-0 [&_>_summary]:text-[9px] [&_>_summary]:text-[#8b987b] [&_>_summary]:list-none [&_>_summary]:cursor-pointer [&_>_summary_span]:ml-[7px] max-[650px]:[&_>_summary]:text-[8px]">
          <summary>
            Demo controls <span>⌄</span>
          </summary>
          <div className="absolute right-[0] bottom-[24px] w-[320px] z-[9] [border:1px_solid_var(--border)] bg-[#fff] shadow-[0_7px_35px_#2737231a] rounded-[9px] p-[19px] [&_>_strong]:text-[12px] [&_>_p]:text-[10px] [&_>_p]:text-[#929d86] [&_>_p]:mt-[7px] [&_>_div]:flex [&_>_div]:gap-[8px] [&_>_div]:flex-wrap [&_>_div]:[margin:15px_0] [&_.button]:text-[10px] [&_.button]:min-h-[31px] [&_>_a]:text-[10px] [&_>_a]:text-[#567b42] max-[650px]:w-[270px]">
            <strong>Explore table states</strong>
            <p>Mock data only · changes reset on refresh</p>
            <div>
              {(["normal", "empty", "error", "large"] as const).map((m) => (
                <button
                  className={`button inline-flex items-center justify-center gap-[8px] min-h-[36px] [border:1px_solid_#dfe4d8] bg-[#fff] rounded-[6px] [padding:0_13px] text-[11px] font-medium whitespace-nowrap [&:hover]:bg-[#f0f4eb] [&:hover]:border-[#c4cfb7] [&.primary]:bg-[#345c43] [&.primary]:border-[#345c43] [&.primary]:text-[#fff] [&.primary:hover]:bg-[#264c34] ${mode === m ? "[&&]:bg-[#edf3e6]" : ""}`}
                  key={m}
                  onClick={() => void load(m)}
                >
                  {
                    {
                      normal: "Reload / loading",
                      empty: "Empty dataset",
                      error: "Request failure",
                      large: "528 classes",
                    }[m]
                  }
                </button>
              ))}
              <button
                className="button inline-flex items-center justify-center gap-[8px] min-h-[36px] [border:1px_solid_#dfe4d8] bg-[#fff] rounded-[6px] [padding:0_13px] text-[11px] font-medium whitespace-nowrap [&:hover]:bg-[#f0f4eb] [&:hover]:border-[#c4cfb7] [&.primary]:bg-[#345c43] [&.primary]:border-[#345c43] [&.primary]:text-[#fff] [&.primary:hover]:bg-[#264c34]"
                onClick={() => {
                  failChild.current = true;
                  setToast(
                    "Next uncached on-demand attendee request will fail. Expand a Pilates class to try it.",
                  );
                }}
              >
                Fail next attendee request
              </button>
            </div>
            <a href="/secondary-dataset-demo">Explore the equipment table →</a>
          </div>
        </details>
      </div>

      {toast && (
        <div
          className="fixed bottom-[25px] left-[calc(50%_+_116px)] [transform:translateX(-50%)] bg-[#34573f] text-[#f2f7ec] [border:1px_solid_#456c50] shadow-[0_8px_30px_#1e332226] z-[30] [padding:14px_17px] rounded-[8px] flex items-center gap-[10px] max-w-[90vw] text-[12px] [&_button]:[background:none] [&_button]:border-0 [&_button]:text-[#dce8d5] [&_button]:text-[18px] [&_button]:ml-[12px] max-[1200px]:left-[calc(50%_+_100px)] max-[950px]:left-[calc(50%_+_38px)] max-[650px]:left-[50%] max-[650px]:min-w-[250px] max-[650px]:text-[11px]"
          role="status"
        >
          <Icon name="check" size={17} />
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            ×
          </button>
        </div>
      )}
      {showNew && (
        <div
          className="fixed inset-[0] bg-[#21302160] [backdrop-filter:blur(3px)] z-[40] flex items-center justify-center p-[20px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNew(false);
          }}
        >
          <NewClassDialog onClose={closeDialog}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const [h, m] = newTime.split(":").map(Number);
                setData((prev) => [
                  ...prev,
                  {
                    id: `custom-${Date.now()}`,
                    name: name.trim(),
                    category: newType,
                    instructor: "Jamie Lewis",
                    initials: "JL",
                    color: "sage",
                    start: h * 60 + m,
                    duration: 60,
                    attendance: 0,
                    capacity,
                    status: "Scheduled",
                    room: "Studio A",
                    day,
                    attendees: [],
                  },
                ]);
                setShowNew(false);
                setName("");
                setQuery("");
                setCategory("All class types");
                setStatus("All statuses");
                setToast("New class added to your schedule.");
              }}
            >
              <div className="flex justify-between items-center [&_h2]:text-[24px]">
                <div>
                  <div className="text-[9px] tracking-[1.8px] text-[#8b957e] font-semibold mb-[11px] max-[650px]:text-[8px]">
                    MAKE ROOM FOR MOVEMENT
                  </div>
                  <h2>Add a class</h2>
                </div>
                <button
                  type="button"
                  className="[background:none] border-0 text-[25px] text-[#96a08b]"
                  onClick={() => setShowNew(false)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <p>
                Schedule a new class for {days[day]}, September {7 + day}.
              </p>
              <label>
                Class name
                <input
                  autoFocus
                  required
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sunset Yoga"
                  pattern=".*\S.*"
                />
              </label>
              <label>
                Class type
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  {["Yoga", "Pilates", "Strength", "HIIT", "Barre"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <div className="flex gap-[15px] [&_label]:flex-1 [&_label]:min-w-0">
                <label>
                  Start time
                  <input
                    required
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </label>
                <label>
                  Capacity
                  <input
                    required
                    type="number"
                    min={1}
                    max={100}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                  />
                </label>
              </div>
              <small>60 minutes · Studio A · Jamie Lewis</small>
              <div className="flex justify-end gap-[9px] mt-[25px]">
                <button
                  type="button"
                  className="button inline-flex items-center justify-center gap-[8px] min-h-[36px] [border:1px_solid_#dfe4d8] bg-[#fff] rounded-[6px] [padding:0_13px] text-[11px] font-medium whitespace-nowrap [&:hover]:bg-[#f0f4eb] [&:hover]:border-[#c4cfb7] [&.primary]:bg-[#345c43] [&.primary]:border-[#345c43] [&.primary]:text-[#fff] [&.primary:hover]:bg-[#264c34]"
                  onClick={() => setShowNew(false)}
                >
                  Cancel
                </button>
                <button
                  className="button primary inline-flex items-center justify-center gap-[8px] min-h-[36px] [border:1px_solid_#dfe4d8] bg-[#fff] rounded-[6px] [padding:0_13px] text-[11px] font-medium whitespace-nowrap [&:hover]:bg-[#f0f4eb] [&:hover]:border-[#c4cfb7] [&.primary]:bg-[#345c43] [&.primary]:border-[#345c43] [&.primary]:text-[#fff] [&.primary:hover]:bg-[#264c34]"
                  type="submit"
                >
                  Create class
                </button>
              </div>
            </form>
          </NewClassDialog>
        </div>
      )}
    </StudioShell>
  );
}
