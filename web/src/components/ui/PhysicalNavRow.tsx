import { LineIcon } from "@/components/ui/LineIcon";

type PhysicalNavRowProps = {
  label: string;
  arrow: "left" | "right";
  /** Physical side of the arrow in the row (LTR coordinates). */
  arrowPosition?: "start" | "end";
  textDir?: "ltr" | "rtl";
  className?: string;
};

/**
 * Nav label + arrow with explicit physical placement (immune to RTL bidi reorder).
 */
export function PhysicalNavRow({
  label,
  arrow,
  arrowPosition = "end",
  textDir = "rtl",
  className = "",
}: PhysicalNavRowProps) {
  const icon = arrow === "left" ? "arrow-left" : "arrow-right";

  return (
    <span
      className={`nav-phys-row nav-phys-row--arrow-${arrowPosition} ${className}`.trim()}
    >
      {arrowPosition === "start" && (
        <LineIcon name={icon} className="nav-phys-arrow" />
      )}
      <span className="nav-phys-label" dir={textDir}>
        {label}
      </span>
      {arrowPosition === "end" && (
        <LineIcon name={icon} className="nav-phys-arrow" />
      )}
    </span>
  );
}
