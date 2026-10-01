type FaqItem = { q: string; a: string };

type ServiceFaqProps = {
  items: readonly FaqItem[];
  className?: string;
};

export function ServiceFaq({ items, className = "" }: ServiceFaqProps) {
  return (
    <div className={`sp-faq-list ${className}`.trim()}>
      {items.map((item) => (
        <details key={item.q} className="faq-item sp-faq-item">
          <summary className="sp-faq-q">{item.q}</summary>
          <div className="faq-answer sp-faq-a">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
