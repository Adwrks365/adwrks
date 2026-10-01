type PhysicalNavRowProps = {
  label: string;
  arrow: "left" | "right";
  className?: string;
};

/**
 * RTL-safe nav label + arrow. Label appears first in reading order; arrow follows.
 * Layout uses direction:rtl so the arrow sits after the Hebrew label in reading flow.
 */
export function PhysicalNavRow({ label, arrow, className = "" }: PhysicalNavRowProps) {
  const arrowChar = arrow === "left" ? "←" : "→";

  return (
    <span className={`nav-phys-row ${className}`.trim()} dir="rtl">
      <span className="nav-phys-label">{label}</span>
      <span className="nav-phys-arrow" aria-hidden="true">
        {arrowChar}
      </span>
    </span>
  );
}
