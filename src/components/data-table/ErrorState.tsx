export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="text-center [padding:40px_15px] [&_h3]:text-[14px] [&_h3]:font-medium [&_h3]:mb-[8px] [&_p]:text-[11px] [&_p]:text-[#919c84] [&_p]:leading-[1.6] [&_.button]:mt-[16px]"
      role="alert"
    >
      <h3>Something didn’t load</h3>
      <p>{message}</p>
      {onRetry && (
        <button
          className="button inline-flex items-center justify-center gap-[8px] min-h-[36px] [border:1px_solid_#dfe4d8] bg-[#fff] rounded-[6px] [padding:0_13px] text-[11px] font-medium whitespace-nowrap [&:hover]:bg-[#f0f4eb] [&:hover]:border-[#c4cfb7] [&.primary]:bg-[#345c43] [&.primary]:border-[#345c43] [&.primary]:text-[#fff] [&.primary:hover]:bg-[#264c34]"
          onClick={onRetry}
        >
          ↻ Try again
        </button>
      )}
    </div>
  );
}
