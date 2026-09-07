export function EmptyState({
  title = "No results",
  description = "Try changing your search or filters.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="text-center [padding:40px_15px] [&_h3]:text-[14px] [&_h3]:font-medium [&_h3]:mb-[8px] [&_p]:text-[11px] [&_p]:text-[#919c84] [&_p]:leading-[1.6] [&_.button]:mt-[16px]">
      <span className="text-[32px] text-[#a8ba98] block mb-[9px]">⌕</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
