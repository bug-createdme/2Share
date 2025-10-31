import { ImgHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * All the props are passed to the img element.
 * Make sure to adjust the width and height of the container div
 * as per the design requirements/image aspect ratio.
 */
export default function DiscloseImage({
  className,
  doorClassName,
  containerClassName,
  vertical = false,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & {
  /**
   * Class name for the window on the left and right side of the image.
   */
  doorClassName?: string;
  /**
   * Class name for the container div.
   */
  containerClassName?: string;
  /**
   * If true, the doors will slide vertically.
   */
  vertical?: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden rounded-[30px] sm:rounded-[40px] shadow-[0px_4px_80px_rgba(0,0,0,0.55)] border-[8px] sm:border-[16px] border-white/8", containerClassName)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        onLoad={() => setImageLoaded(true)}
        {...props}
        className={cn("h-full w-full object-cover", className)}
      />
      {/* Left door */}
      <div
        className={cn(
          "absolute bottom-0 left-0 top-0 w-1/2 transition-transform duration-[3000ms] ease-[cubic-bezier(0.4,0,0.2,1)] z-10",
          doorClassName || "bg-[#D48A8A]",
          imageLoaded ? "-translate-x-full" : "translate-x-0"
        )}
      />
      {/* Right door */}
      <div
        className={cn(
          "absolute bottom-0 right-0 top-0 w-1/2 transition-transform duration-[3000ms] ease-[cubic-bezier(0.4,0,0.2,1)] z-10",
          doorClassName || "bg-[#D48A8A]",
          imageLoaded ? "translate-x-full" : "translate-x-0"
        )}
      />
    </div>
  );
}
