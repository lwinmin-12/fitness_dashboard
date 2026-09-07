import { makeAttendees, type Attendee } from "./attendees";

export interface ClassRow {
  id: string;
  name: string;
  category: string;
  instructor: string;
  initials: string;
  color: string;
  start: number;
  duration: number;
  attendance: number;
  capacity: number;
  status: "Scheduled" | "Full" | "Cancelled";
  room: string;
  day: number;
  attendees?: Attendee[];
}
const templates = [
  [
    "Morning Flow",
    "Yoga",
    "Sophie Moore",
    "SM",
    "sage",
    420,
    60,
    12,
    16,
    "Studio A",
  ],
  [
    "Reformer Foundations",
    "Pilates",
    "Alex Morgan",
    "AM",
    "lavender",
    480,
    50,
    10,
    10,
    "Reformer Room",
  ],
  [
    "Full Body Strength",
    "Strength",
    "James Wilson",
    "JW",
    "peach",
    540,
    45,
    14,
    20,
    "Studio B",
  ],
  [
    "Slow & Steady",
    "Yoga",
    "Sophie Moore",
    "SM",
    "sage",
    600,
    60,
    8,
    16,
    "Studio A",
  ],
  [
    "Power Pilates",
    "Pilates",
    "Emma Chen",
    "EC",
    "lavender",
    660,
    50,
    10,
    10,
    "Reformer Room",
  ],
  [
    "Lunchtime Express",
    "HIIT",
    "Marcus Reed",
    "MR",
    "pink",
    720,
    30,
    16,
    20,
    "Studio B",
  ],
  [
    "Barre & Balance",
    "Barre",
    "Olivia Taylor",
    "OT",
    "sand",
    780,
    45,
    0,
    14,
    "Studio A",
  ],
  [
    "Afternoon Reset",
    "Yoga",
    "Daniel Kim",
    "DK",
    "sage",
    900,
    60,
    9,
    16,
    "Studio A",
  ],
  [
    "Reformer Flow",
    "Pilates",
    "Emma Chen",
    "EC",
    "lavender",
    960,
    50,
    7,
    10,
    "Reformer Room",
  ],
  [
    "Strength Club",
    "Strength",
    "James Wilson",
    "JW",
    "peach",
    1020,
    45,
    18,
    20,
    "Studio B",
  ],
  [
    "Evening Flow",
    "Yoga",
    "Daniel Kim",
    "DK",
    "sage",
    1080,
    60,
    16,
    16,
    "Studio A",
  ],
  [
    "Candlelight Restore",
    "Yoga",
    "Sophie Moore",
    "SM",
    "sage",
    1140,
    60,
    11,
    16,
    "Studio A",
  ],
] as const;

export function makeClasses(large = false): ClassRow[] {
  return Array.from({ length: large ? 528 : 84 }, (_, i) => {
    const [
      name,
      category,
      instructor,
      initials,
      color,
      start,
      duration,
      attendance,
      capacity,
      room,
    ] = templates[i % 12];
    const id = `class-${i}`;
    return {
      id,
      name,
      category,
      instructor,
      initials,
      color,
      start,
      duration,
      attendance,
      capacity,
      room,
      day: large ? 0 : Math.floor(i / 12),
      status:
        i % 12 === 6
          ? "Cancelled"
          : attendance === capacity
            ? "Full"
            : "Scheduled",
      ...(i % 2 === 0 ? { attendees: makeAttendees(id, attendance) } : {}),
    };
  });
}

export async function fetchClasses(
  mode: "normal" | "empty" | "error" | "large" = "normal",
): Promise<ClassRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 1100));
  if (mode === "error")
    throw new Error(
      "The class schedule couldn’t be loaded. Your studio data is safe.",
    );
  return mode === "empty" ? [] : makeClasses(mode === "large");
}

export function formatTime(minutes: number): string {
  const hour = Math.floor(minutes / 60);
  return `${hour % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}
