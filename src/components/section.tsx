import { cn } from "@/lib/utils";

export type Tone = "dark" | "light";

type Props = React.ComponentProps<"section"> & {
  tone: Tone;
  /** Skip the default vertical padding (for pinned / full-bleed sections) */
  flush?: boolean;
};

/**
 * Every page section is a rounded panel with a visible gap above it,
 * alternating dark / light, so section boundaries are always obvious.
 * Uses overflow: clip (not hidden) so position: sticky keeps working inside.
 */
export function Section({ tone, flush, className, children, ...props }: Props) {
  return (
    <section
      data-tone={tone}
      className={cn(
        "relative mx-2 mt-3 overflow-clip rounded-[24px] md:mx-3",
        tone === "dark" ? "tone-dark bg-surface text-cream ring-1 ring-cream/[0.06]" : "tone-light bg-beige text-ink",
        !flush && "py-24 md:py-32",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
