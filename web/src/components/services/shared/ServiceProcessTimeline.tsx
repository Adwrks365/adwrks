type ProcessStep = { title: string; text: string };

type ServiceProcessTimelineProps = {
  steps: readonly ProcessStep[];
};

export function ServiceProcessTimeline({ steps }: ServiceProcessTimelineProps) {
  return (
    <ol className="sp-process-list">
      {steps.map((step, index) => (
        <li key={step.title} className="sp-process-item">
          <span className="sp-process-index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="sp-process-body">
            <h3 className="sp-process-title">{step.title}</h3>
            <p className="sp-process-text">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
