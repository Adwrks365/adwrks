import { GA4_MEASUREMENT_ID } from "@/lib/analytics";

export type ArticleRatingEventParams = {
  article_path: string;
  rating: number;
};

export function trackArticleRatingSubmit(params: ArticleRatingEventParams): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "article_rating_submit", {
    send_to: GA4_MEASUREMENT_ID,
    article_path: params.article_path,
    rating: params.rating,
  });
}
