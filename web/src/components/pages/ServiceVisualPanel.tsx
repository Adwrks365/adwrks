import type { ServiceSection } from "@/lib/pages/services/types";

type ServiceVisualPanelProps = {
  section: ServiceSection;
};

export function ServiceVisualPanel({ section }: ServiceVisualPanelProps) {
  const initial = section.heading.trim().charAt(0) || "A";

  return (
    <div className="service-visual-panel" aria-hidden="true">
      <div className="service-visual-panel-inner">
        {section.eyebrow && <span className="service-visual-eyebrow">{section.eyebrow}</span>}
        <span className="service-visual-mark">{initial}</span>
        <span className="service-visual-line" />
      </div>
    </div>
  );
}
