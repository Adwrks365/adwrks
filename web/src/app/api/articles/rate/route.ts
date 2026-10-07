import { NextResponse } from "next/server";
import { isRatingsConfigured } from "@/lib/ratings/config";
import {
  fetchVisitorArticleRating,
  normalizeArticlePath,
  resolveArticleRatingContext,
  submitArticleRating,
} from "@/lib/ratings/service";
import { createVoterHash, getOrCreateVoterId } from "@/lib/ratings/voter";

function ratingsUnavailable() {
  return NextResponse.json(
    { ok: false, message: "דירוג המאמרים אינו זמין כרגע." },
    { status: 503 },
  );
}

export async function GET(request: Request) {
  if (!isRatingsConfigured()) {
    return ratingsUnavailable();
  }

  try {
    const { searchParams } = new URL(request.url);
    const articlePath = normalizeArticlePath(searchParams.get("path") || "");

    if (!articlePath || articlePath === "/") {
      return NextResponse.json({ ok: false, message: "נתיב מאמר לא תקין." }, { status: 400 });
    }

    const context = await resolveArticleRatingContext(articlePath);
    if (!context) {
      return NextResponse.json({ ok: false, message: "מאמר לא נמצא." }, { status: 404 });
    }

    const voterId = await getOrCreateVoterId();
    const voterHash = createVoterHash(
      voterId,
      process.env.ARTICLE_RATING_VOTER_SECRET!.trim(),
    );

    const userRating = await fetchVisitorArticleRating(articlePath, voterHash);

    return NextResponse.json({
      ok: true,
      averageRating: context.aggregate.averageRating,
      totalVoteCount: context.aggregate.totalVoteCount,
      hasVoted: userRating !== null,
      userRating,
    });
  } catch (error) {
    console.error("[article-rating] GET failed", {
      code: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { ok: false, message: "לא ניתן לטעון את הדירוג כרגע." },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  if (!isRatingsConfigured()) {
    return ratingsUnavailable();
  }

  try {
    const body = (await request.json()) as {
      articlePath?: string;
      rating?: number | string;
    };

    const articlePath = normalizeArticlePath(body.articlePath || "");
    const rating = Number(body.rating);

    if (!articlePath || articlePath === "/") {
      return NextResponse.json({ ok: false, message: "נתיב מאמר לא תקין." }, { status: 400 });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, message: "דירוג לא תקין." }, { status: 400 });
    }

    const context = await resolveArticleRatingContext(articlePath);
    if (!context) {
      return NextResponse.json({ ok: false, message: "מאמר לא נמצא." }, { status: 404 });
    }

    const voterId = await getOrCreateVoterId();
    const voterHash = createVoterHash(
      voterId,
      process.env.ARTICLE_RATING_VOTER_SECRET!.trim(),
    );

    const result = await submitArticleRating(articlePath, rating, voterHash);

    return NextResponse.json({
      ok: true,
      accepted: result.accepted,
      averageRating: result.averageRating,
      totalVoteCount: result.totalVoteCount,
      hasVoted: true,
      userRating: rating,
    });
  } catch (error) {
    console.error("[article-rating] POST failed", {
      code: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { ok: false, message: "לא ניתן לשמור את הדירוג כרגע." },
      { status: 502 },
    );
  }
}
