import { cn } from "@emalify/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
