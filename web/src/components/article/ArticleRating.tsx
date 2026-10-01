"use client";

import { useEffect, useState } from "react";
import { trackArticleRatingSubmit } from "@/lib/analytics/article-rating-events";

type ArticleRatingProps = {
  postPath: string;
};

type RatingState = {
  averageRating: number | null;
  totalVoteCount: number;
  hasVoted: boolean;
  userRating: number | null;
};

const USER_PREFIX = "adwrks-article-star-vote:";
const STAR_VALUES = [1, 2, 3, 4, 5] as const;

function readLocalVote(postPath: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(USER_PREFIX + postPath);
    if (!saved) return null;
    const value = Number.parseInt(saved, 10);
    return value >= 1 && value <= 5 ? value : null;
  } catch {
    return null;
  }
}

function writeLocalVote(postPath: string, rating: number) {
  try {
    localStorage.setItem(USER_PREFIX + postPath, String(rating));
  } catch {
    /* ignore */
  }
}

function formatAverage(value: number | null): string {
  if (value === null) return "—";
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatRatingSummary(averageRating: number | null, totalVoteCount: number): string {
  if (totalVoteCount <= 0) {
    return "עדיין אין דירוגים למאמר זה";
  }
  return `דירוג ${formatAverage(averageRating)} מתוך 5 · ${totalVoteCount.toLocaleString("he-IL")} דירוגים`;
}

export function ArticleRating({ postPath }: ArticleRatingProps) {
  const [rating, setRating] = useState<RatingState | null>(null);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thankYou, setThankYou] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRating() {
      try {
        const response = await fetch(
          `/api/articles/rate?path=${encodeURIComponent(postPath)}`,
          { cache: "no-store" },
        );
        const data = (await response.json()) as {
          ok?: boolean;
          averageRating?: number | null;
          totalVoteCount?: number;
          hasVoted?: boolean;
          userRating?: number | null;
          message?: string;
        };

        if (cancelled) return;

        if (!response.ok || !data.ok) {
          setError(data.message || "לא ניתן לטעון את הדירוג.");
          return;
        }

        const localVote = readLocalVote(postPath);
        const userRating = data.userRating ?? localVote;
        const hasVoted = Boolean(data.hasVoted || userRating);

        if (userRating) {
          writeLocalVote(postPath, userRating);
        }

        setRating({
          averageRating: data.averageRating ?? null,
          totalVoteCount: data.totalVoteCount ?? 0,
          hasVoted,
          userRating: userRating ?? null,
        });
      } catch {
        if (!cancelled) {
          setError("לא ניתן לטעון את הדירוג.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadRating();

    return () => {
      cancelled = true;
    };
  }, [postPath]);

  const handleSubmit = async (value: number) => {
    if (submitting || rating?.hasVoted) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/articles/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articlePath: postPath, rating: value }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        accepted?: boolean;
        averageRating?: number | null;
        totalVoteCount?: number;
        userRating?: number | null;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        setError(data.message || "לא ניתן לשמור את הדירוג.");
        return;
      }

      writeLocalVote(postPath, value);
      setRating({
        averageRating: data.averageRating ?? null,
        totalVoteCount: data.totalVoteCount ?? 0,
        hasVoted: true,
        userRating: data.userRating ?? value,
      });

      if (data.accepted) {
        setThankYou(true);
        trackArticleRatingSubmit({ article_path: postPath, rating: value });
      }
    } catch {
      setError("לא ניתן לשמור את הדירוג.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeValue = hoverValue ?? rating?.userRating ?? 0;
  const summaryText = rating
    ? formatRatingSummary(rating.averageRating, rating.totalVoteCount)
    : "טוען דירוג…";

  return (
    <div className="article-end-module article-rating">
      <h2 className="article-end-module-title">דרגו את המאמר</h2>

      <div
        className="article-rating-stars"
        dir="ltr"
        role="group"
        aria-label="דרגו את המאמר"
        onMouseLeave={() => setHoverValue(null)}
      >
        {STAR_VALUES.map((value) => {
          const filled = value <= activeValue;
          return (
            <button
              key={value}
              type="button"
              className={`article-rating-star ${filled ? "is-active" : ""} ${rating?.userRating === value ? "is-selected" : ""}`.trim()}
              aria-label={`דירוג ${value} מתוך 5`}
              aria-pressed={rating?.userRating === value}
              disabled={loading || submitting || Boolean(rating?.hasVoted)}
              onMouseEnter={() => {
                if (!rating?.hasVoted && !submitting) setHoverValue(value);
              }}
              onFocus={() => {
                if (!rating?.hasVoted && !submitting) setHoverValue(value);
              }}
              onBlur={() => setHoverValue(null)}
              onClick={() => void handleSubmit(value)}
            >
              {filled ? "★" : "☆"}
            </button>
          );
        })}
      </div>

      <p className="article-rating-summary" aria-live="polite">
        {thankYou ? "תודה על הדירוג!" : null}
        {thankYou ? " · " : null}
        {summaryText}
      </p>

      {rating?.hasVoted && !thankYou ? (
        <p className="article-rating-note">כבר דירגתם מאמר זה.</p>
      ) : null}

      {error ? <p className="article-rating-error">{error}</p> : null}
    </div>
  );
}
