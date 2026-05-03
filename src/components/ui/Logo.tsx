import { cn } from "@/lib/utils/cn";

export function PlutoLogo({
  className,
  showWordmark = true,
  size = "md"
}: {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const logoWidth = size === "lg" ? 150 : size === "sm" ? 84 : 112;
  const markSize = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-9 w-9";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showWordmark ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="Pluto"
          src="/pluto-logo.png"
          className="block object-contain"
          style={{ width: logoWidth, height: size === "lg" ? 46 : 34 }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="Pluto" src="/pluto-mark.png" className={cn("block object-contain", markSize)} />
      )}
    </div>
  );
}
