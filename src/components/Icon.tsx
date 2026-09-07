import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  LuArrowUpRight,
  LuBell,
  LuCalendarDays,
  LuChartNoAxesColumnIncreasing,
  LuCheck,
  LuClock,
  LuColumns3,
  LuCreditCard,
  LuDownload,
  LuGrid2X2,
  LuCircleHelp,
  LuLeaf,
  LuPlus,
  LuSearch,
  LuSettings,
  LuSlidersHorizontal,
  LuUsers,
} from "react-icons/lu";

const icons: Record<string, IconType> = {
  grid: LuGrid2X2,
  calendar: LuCalendarDays,
  users: LuUsers,
  chart: LuChartNoAxesColumnIncreasing,
  card: LuCreditCard,
  settings: LuSettings,
  help: LuCircleHelp,
  search: LuSearch,
  bell: LuBell,
  plus: LuPlus,
  download: LuDownload,
  clock: LuClock,
  filter: LuSlidersHorizontal,
  columns: LuColumns3,
  arrow: LuArrowUpRight,
  check: LuCheck,
  leaf: LuLeaf,
};

export function Icon({
  name,
  size = 19,
  style,
}: {
  name: string;
  size?: number;
  style?: CSSProperties;
}) {
  const Component = icons[name] ?? LuGrid2X2;

  return (
    <Component
      size={size}
      strokeWidth={1.65}
      aria-hidden="true"
      focusable="false"
      style={style}
    />
  );
}
