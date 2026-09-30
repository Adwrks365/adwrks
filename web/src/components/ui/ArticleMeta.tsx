type ArticleMetaProps = {
  date?: string;
  label?: string;
};

function formatDate(date?: string): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("he-IL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

export function ArticleMeta({ date, label = "מאמר" }: ArticleMetaProps) {
  const formatted = formatDate(date);
  if (!formatted) return null;

  return (
    <div className="article-meta">
      <span className="article-meta-label">{label}</span>
      <time dateTime={date} className="article-meta-date">
        {formatted}
      </time>
    </div>
  );
}
