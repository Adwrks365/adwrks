export type RatingsConfig = {
  url: string;
  secretKey: string;
  voterSecret: string;
};

export function getRatingsConfig(): RatingsConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  const voterSecret = process.env.ARTICLE_RATING_VOTER_SECRET?.trim();

  if (!url || !secretKey || !voterSecret) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), secretKey, voterSecret };
}

export function isRatingsConfigured(): boolean {
  return getRatingsConfig() !== null;
}
