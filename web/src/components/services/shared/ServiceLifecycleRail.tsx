type LifecycleStep = { title: string; text: string };

type ServiceLifecycleRailProps = {
  steps: readonly LifecycleStep[];
};

export function ServiceLifecycleRail({ steps }: ServiceLifecycleRailProps) {
  return (
    <ol className="sp-lifecycle-rail">
      {steps.map((step, index) => (
        <li key={step.title} className="sp-lifecycle-step">
          <div className="sp-lifecycle-marker">
            <span className="sp-lifecycle-index">{index + 1}</span>
            {index < steps.length - 1 && <span className="sp-lifecycle-connector" aria-hidden="true" />}
          </div>
          <div className="sp-lifecycle-body">
            <h3 className="sp-lifecycle-title">{step.title}</h3>
            <p className="sp-lifecycle-text">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
