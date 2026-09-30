"use client";

import { useState } from "react";

type ArticleRatingProps = {
  postPath: string;
};

type UserVote = "yes" | "no" | null;

const USER_PREFIX = "adwrks-article-user-vote:";

function readUserVote(postPath: string): UserVote {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(USER_PREFIX + postPath);
    return saved === "yes" || saved === "no" ? saved : null;
  } catch {
    return null;
  }
}

function writeUserVote(postPath: string, vote: UserVote) {
  try {
    if (vote) localStorage.setItem(USER_PREFIX + postPath, vote);
  } catch {
    /* ignore */
  }
}

export function ArticleRating({ postPath }: ArticleRatingProps) {
  const [userVote, setUserVote] = useState<UserVote>(() => readUserVote(postPath));

  const handleVote = (vote: "yes" | "no") => {
    setUserVote(vote);
    writeUserVote(postPath, vote);
  };

  return (
    <div className="article-end-module article-helpful-vote">
      <h2 className="article-end-module-title">הכתבה עניינה אותך?</h2>
      <p className="article-helpful-note">
        {userVote ? "תודה על המשוב!" : "סמנו אם המידע היה שימושי עבורכם."}
      </p>
      <div className="article-helpful-actions" role="group" aria-label="האם הכתבה עניינה אתכם">
        <button
          type="button"
          className={`article-helpful-btn ${userVote === "yes" ? "is-selected" : ""}`}
          aria-pressed={userVote === "yes"}
          onClick={() => handleVote("yes")}
        >
          כן
        </button>
        <button
          type="button"
          className={`article-helpful-btn ${userVote === "no" ? "is-selected" : ""}`}
          aria-pressed={userVote === "no"}
          onClick={() => handleVote("no")}
        >
          לא
        </button>
      </div>
    </div>
  );
}
