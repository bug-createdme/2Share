import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuroraTextProps {
  children: ReactNode;
  className?: string;
  /** Animation duration in ms */
  speedMs?: number;
}

export default function AuroraText({ children, className, speedMs = 12000 }: AuroraTextProps) {
  const style = { ["--aurora-speed" as any]: `${speedMs}ms` } as React.CSSProperties;
  return (
    <span className={cn("aurora-wrap", className)} style={style}>
      {/* Base readable text (inherits current color) */}
      <span className="aurora-base">{children}</span>
      {/* Animated gradient overlay clipped to text */}
      <span className="aurora-overlay aurora-text">{children}</span>
    </span>
  );
}
