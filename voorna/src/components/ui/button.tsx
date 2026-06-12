import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.45)] focus-visible:outline-ink",
  secondary:
    "border border-line bg-transparent text-ink hover:border-ink focus-visible:outline-ink",
  ghost:
    "text-ink-soft hover:bg-paper-mute hover:text-ink focus-visible:outline-ink",
  gold: "bg-gold text-[#1a1306] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(201,162,75,0.6)] focus-visible:outline-gold",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-5 text-[13.5px]",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-[14.5px]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
