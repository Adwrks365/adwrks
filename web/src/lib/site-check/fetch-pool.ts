import { fetchPublicHtml } from "./fetch-page";

export type PooledFetchResult =
  | { url: string; ok: true; html: string; headerRobots: string; truncated: boolean }
  | { url: string; ok: false };

export async function fetchPagesWithBudget(
  urls: readonly string[],
  options: { concurrency: number; deadlineMs: number },
): Promise<{ results: PooledFetchResult[]; timedOut: boolean }> {
  const started = Date.now();
  const deadline = started + options.deadlineMs;
  const results: PooledFetchResult[] = new Array(urls.length);
  let nextIndex = 0;
  let timedOut = false;

  async function worker() {
    while (true) {
      if (Date.now() >= deadline) {
        timedOut = true;
        return;
      }
      const index = nextIndex;
      nextIndex += 1;
      if (index >= urls.length) return;
      const url = urls[index]!;
      const fetchResult = await fetchPublicHtml(url);
      if (fetchResult.ok) {
        results[index] = {
          url: fetchResult.url,
          ok: true,
          html: fetchResult.html,
          headerRobots: fetchResult.headerRobots,
          truncated: fetchResult.truncated,
        };
      } else {
        results[index] = { url: fetchResult.url, ok: false };
      }
    }
  }

  const workers = Array.from({ length: Math.min(options.concurrency, urls.length) }, () => worker());
  await Promise.all(workers);

  if (nextIndex < urls.length) {
    timedOut = true;
    for (let i = nextIndex; i < urls.length; i += 1) {
      results[i] = { url: urls[i]!, ok: false };
    }
  }

  return { results, timedOut };
}