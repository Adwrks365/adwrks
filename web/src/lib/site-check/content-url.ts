const SITEMAP_OR_FEED =
  /\/(?:[a-z0-9_-]+-sitemap|sitemap_index|post-sitemap|page-sitemap|product-sitemap|category-sitemap|directory-sitemap)(?:\.xml)?\/?$/i;

const NON_CONTENT_PATH =
  /\/(wp-admin|wp-login\.php|wp-json|xmlrpc\.php|feed|comments\/feed|oembed|cdn-cgi)(\/|$)/i;

const NON_CONTENT_EXT = /\.(pdf|jpe?g|png|gif|webp|svg|zip|mp4|mp3|css|js|xml|json)\/?$/i;

/** URLs used only to discover links — not counted as content pages in the report. */
export function isDiscoveryOnlyUrl(raw: string): boolean {
  try {
    const path = new URL(raw).pathname;
    if (NON_CONTENT_PATH.test(path) || NON_CONTENT_EXT.test(path)) return true;
    if (SITEMAP_OR_FEED.test(path)) return true;
    if (/\/sitemap[^/]*\.xml\/?$/i.test(path)) return true;
    return false;
  } catch {
    return true;
  }
}

export function isContentScanUrl(raw: string): boolean {
  return Boolean(raw) && !isDiscoveryOnlyUrl(raw);
}

const SYSTEM_OR_POLICY =
  /(?:privacy|accessibility|cookie|terms|legal|disclaimer|login|sign[\s-]?in|sign[\s-]?up|register|my[\s-]?account|customer\/account|wp-admin|מדיניות|פרטיות|נגישות|הצהרת|תנאים|התחברות|הרשמה|חשבון)/i;

/** Privacy, legal and account areas — deprioritized for SEO/contact findings. */
export function isSystemOrPolicyPage(url: string, title = ""): boolean {
  return SYSTEM_OR_POLICY.test(`${url} ${title}`);
}

/** Cart/checkout/account — excluded from service noindex findings. */
export function isCommerceSystemPage(url: string, title = ""): boolean {
  return /(?:cart|checkout|basket|my-account|customer\/account|\/account\/)/i.test(`${url} ${title}`);
}

export function isProductLikePage(url: string, title = ""): boolean {
  if (/\/(?:product|products|item|items|p\/)(\/|$)/i.test(url)) return true;
  try {
    if (/\/items\/\d+/i.test(new URL(url).pathname)) return true;
  } catch {
    if (/\/items\/\d+/i.test(url)) return true;
  }
  // Avoid treating plural "מוצרים" listing titles as a single product.
  if (/\bמוצר\b/i.test(title) && !/מוצרים/i.test(title)) return true;
  return /\bproduct\b/i.test(title) && !/products/i.test(title);
}

export function isStoreCategoryPage(url: string): boolean {
  if (/\/(?:product-category|product_cat|collections?|מחלקה|קטגור)/i.test(url)) return true;
  if (/\/category\//i.test(url) && !/product-category/i.test(url)) return true;
  try {
    const path = new URL(url).pathname;
    if (/\/\d{4,}-[^/]+\/?$/i.test(path) && !/\/items\//i.test(path)) return true;
  } catch {
    /* fall through */
  }
  return false;
}