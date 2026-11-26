import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { newTab } from "@/lib/site";

type Props = React.ComponentProps<"a"> & {
  /** gold = primary · dark = secondary on dark panels · ink = secondary on light panels */
  tone?: "gold" | "dark" | "ink";
  icon?: React.ReactNode;
};

/** Button with a square arrow box on the right; the arrow slides on hover. */
export function ArrowButton({ tone = "gold", icon, className, children, ...props }: Props) {
  const glyph = icon ?? <ArrowRight className="size-4" />;
  return (
    <a
      className={cn(
        "group inline-flex items-center gap-4 rounded-md py-1 pr-1 pl-5 text-[15px] font-bold transition-colors duration-300",
        tone === "gold" && "bg-gold text-ink hover:bg-[#e8cf85]",
        tone === "dark" && "bg-panel text-cream ring-1 ring-cream/15 hover:bg-[#28282b]",
        tone === "ink" && "bg-ink text-cream hover:bg-black",
        className,
      )}
      {...newTab(props.href ?? "")}
      {...props}
    >
      <span>{children}</span>
      <span className={cn("grid size-10 place-items-center overflow-hidden rounded-[5px]", tone === "gold" ? "bg-ink text-gold" : "bg-gold text-ink")}>
        <span className="relative block size-4">
          <span className="absolute inset-0 transition-transform duration-500 ease-(--ease-soft) group-hover:translate-x-[180%]">{glyph}</span>
          <span className="absolute inset-0 -translate-x-[180%] transition-transform duration-500 ease-(--ease-soft) group-hover:translate-x-0">{glyph}</span>
        </span>
      </span>
    </a>
  );
}
