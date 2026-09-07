export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div
      className="grid gap-[16px] [padding:18px_0] [&_.skeleton]:h-[24px]"
      aria-label="Loading details"
      role="status"
    >
      {Array.from({ length: rows }, (_, i) => (
        <div
          className="skeleton block h-[13px] w-[85%] rounded-[4px] [background:linear-gradient(90deg,_#edf0e7_25%,_#f7f9f4_50%,_#edf0e7_75%)] [background-size:200%_100%] animate-[shimmer_1.7s_infinite] [&.tiny]:w-[16px]"
          key={i}
        />
      ))}
    </div>
  );
}
