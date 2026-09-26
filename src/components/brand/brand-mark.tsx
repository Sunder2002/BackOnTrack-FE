import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

export function BrandMark({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label={brand.name}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden="true"
      >
        <rect width="30" height="30" rx="8" fill="var(--brand-soft)" />
        <path
          d="M7 20H12.5C15.6 20 15.6 10 19 10H23"
          stroke="var(--brand)"
          strokeWidth="2"
        />
        <circle cx="7" cy="20" r="2" fill="var(--brand)" />
        <circle
          cx="15"
          cy="15"
          r="2"
          fill="white"
          stroke="var(--brand)"
          strokeWidth="2"
        />
        <circle cx="23" cy="10" r="2.4" fill="var(--brand)" />
      </svg>
      {!compact ? (
        <span className="text-[15px] font-bold tracking-[-0.02em]">
          {brand.name}
        </span>
      ) : null}
    </div>
  );
}
