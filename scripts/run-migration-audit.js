#!/usr/bin/env node
/**
 * READ-ONLY WordPress migration audit for adwrks.co.il
 * Fetches public REST API data, sitemaps, and SEO metadata.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://adwrks.co.il';
const OUT_DIR = path.join(__dirname, '..', 'migration-audit');
const DELAY_MS = 300;
const MAX_RETRIES = 4;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'AdwrksMigrationAudit/1.0 (read-only)',
          ...(options.headers || {}),
        },
      });
      if (res.status === 404 && attempt < MAX_RETRIES) {
        await sleep(DELAY_MS * attempt);
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
      await sleep(DELAY_MS * attempt);
    }
  }
  throw lastError || new Error(`Failed to fetch ${url}`);
}

async function fetchJson(url) {
  const res = await fetchWithRetry(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${url} -> ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function fetchAll(endpoint, params = {}) {
  const perPage = 100;
  let page = 1;
  let totalPages = 1;
  const all = [];

  while (page <= totalPages) {
    const qs = new URLSearchParams({ ...params, per_page: String(perPage), page: String(page) });
    const url = `${BASE_URL}/wp-json/wp/v2/${endpoint}?${qs}`;
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${url} -> ${res.status}: ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    all.push(...data);
    process.stdout.write(`  ${endpoint}: page ${page}/${totalPages}\r`);
    page++;
    await sleep(DELAY_MS);
  }
  console.log(`  ${endpoint}: ${all.length} items fetched`);
  return all;
}

function parseSitemapXml(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function fetchSitemapUrls() {
  const indexRes = await fetchWithRetry(`${BASE_URL}/sitemap_index.xml`);
  const indexXml = await indexRes.text();
  const sitemapLocs = parseSitemapXml(indexXml);
  const urls = new Set();

  for (const sitemapUrl of sitemapLocs) {
    await sleep(DELAY_MS);
    const res = await fetchWithRetry(sitemapUrl);
    const xml = await res.text();
    parseSitemapXml(xml).forEach((u) => urls.add(u));
  }

  return {
    sitemapIndex: sitemapLocs,
    urls: [...urls],
    generator: indexXml.includes('Rank Math') ? 'Rank Math SEO' : 'unknown',
  };
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function extractMeta(html, attr, name) {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, 'i');
  const m = html.match(re) || html.match(re2);
  return m ? decodeHtmlEntities(m[1]) : null;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? decodeHtmlEntities(m[1].trim()) : null;
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
    || html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  return m ? m[1] : null;
}

function extractHeadings(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  const results = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text) results.push(decodeHtmlEntities(text));
  }
  return results;
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(m[1].trim()));
    } catch {
      blocks.push({ _raw: m[1].trim().slice(0, 500) });
    }
  }
  return blocks;
}

function extractInternalLinks(html, baseHost = 'adwrks.co.il') {
  const links = new Set();
  const re = /href=["']([^"'#]+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    if (href.startsWith('/') || href.includes(baseHost)) {
      try {
        const url = href.startsWith('http') ? href : new URL(href, BASE_URL).href;
        if (url.includes(baseHost)) links.add(url.split('#')[0]);
      } catch {
        /* ignore invalid URLs */
      }
    }
  }
  return [...links];
}

function extractImages(html) {
  const images = [];
  const re = /<img[^>]+>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const srcM = tag.match(/(?:data-src|src)=["']([^"']+)["']/i);
    const altM = tag.match(/alt=["']([^"']*)["']/i);
    if (srcM && !srcM[1].startsWith('data:')) {
      images.push({
        src: srcM[1],
        alt: altM ? decodeHtmlEntities(altM[1]) : '',
      });
    }
  }
  return images;
}

async function crawlSeo(url) {
  const res = await fetchWithRetry(url, { redirect: 'follow' });
  const html = await res.text();
  return {
    url,
    httpStatus: res.status,
    finalUrl: res.url,
    title: extractTitle(html),
    metaDescription: extractMeta(html, 'name', 'description'),
    robots: extractMeta(html, 'name', 'robots'),
    canonical: extractCanonical(html),
    h1: extractHeadings(html, 'h1'),
    h2: extractHeadings(html, 'h2'),
    ogTitle: extractMeta(html, 'property', 'og:title'),
    ogDescription: extractMeta(html, 'property', 'og:description'),
    ogImage: extractMeta(html, 'property', 'og:image'),
    jsonLd: extractJsonLd(html),
    internalLinks: extractInternalLinks(html),
    images: extractImages(html),
  };
}

function summarizeWpItem(item, type) {
  const base = {
    id: item.id,
    slug: item.slug,
    link: item.link,
    title: item.title?.rendered || item.name || '',
    status: item.status,
    date: item.date,
    modified: item.modified,
    type,
  };
  if (type === 'post' || type === 'page') {
    base.excerpt = item.excerpt?.rendered || '';
    base.parent = item.parent || 0;
    base.featuredMedia = item.featured_media || 0;
    base.categories = item.categories || [];
    base.tags = item.tags || [];
    base.yoastHeadJson = item.yoast_head_json || null;
  }
  if (type === 'media') {
    base.sourceUrl = item.source_url;
    base.mimeType = item.mime_type;
    base.altText = item.alt_text || '';
  }
  if (type === 'category' || type === 'tag') {
    base.description = item.description || '';
    base.count = item.count;
    base.parent = item.parent || 0;
  }
  return base;
}

function detectPluginsFromHtml(html) {
  const plugins = new Set();
  const re = /wp-content\/plugins\/([^/"']+)/g;
  let m;
  while ((m = re.exec(html)) !== null) plugins.add(m[1]);
  return [...plugins].sort();
}

function detectThemeFromHtml(html) {
  const m = html.match(/wp-content\/themes\/([^/"']+)/);
  return m ? m[1] : null;
}

async function testAuth() {
  const username = process.env.WP_USER || 'migration';
  const password = process.env.WP_PASS || '';
  if (!password) return { authenticated: false, reason: 'No credentials provided' };

  const token = Buffer.from(`${username}:${password}`).toString('base64');
  const res = await fetchWithRetry(`${BASE_URL}/wp-json/wp/v2/users/me`, {
    headers: { Authorization: `Basic ${token}` },
  });
  if (res.ok) {
    const user = await res.json();
    return { authenticated: true, user: { id: user.id, name: user.name, roles: user.roles } };
  }
  return { authenticated: false, status: res.status, reason: await res.text() };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('=== STEP 1: Verify access ===');
  const homeRes = await fetchWithRetry(BASE_URL);
  const homepageHtml = await homeRes.text();
  fs.writeFileSync(path.join(OUT_DIR, 'homepage.html'), homepageHtml);

  const wpJsonRoot = await fetchJson(`${BASE_URL}/wp-json/`);
  fs.writeFileSync(path.join(OUT_DIR, 'wp-json-root.json'), JSON.stringify(wpJsonRoot, null, 2));

  const robotsRes = await fetchWithRetry(`${BASE_URL}/robots.txt`);
  const robotsTxt = await robotsRes.text();

  const authResult = await testAuth();

  const siteInfo = {
    publicSiteAccessible: homeRes.ok,
    publicSiteStatus: homeRes.status,
    wpRestApiAccessible: true,
    wpAdminUrl: `${BASE_URL}/wp-admin/`,
    wpLoginUrl: `${BASE_URL}/wp-login.php`,
    auth: authResult,
    siteName: wpJsonRoot.name,
    siteDescription: wpJsonRoot.description,
    homeUrl: wpJsonRoot.home,
    timezone: wpJsonRoot.timezone_string,
    pageOnFront: wpJsonRoot.page_on_front,
    showOnFront: wpJsonRoot.show_on_front,
    theme: detectThemeFromHtml(homepageHtml),
    pluginsDetectedInHtml: detectPluginsFromHtml(homepageHtml),
    seoPlugin: 'Rank Math SEO',
    pageBuilder: 'Elementor (+ Elementor Pro)',
    caching: 'LiteSpeed Cache',
    restNamespaces: wpJsonRoot.namespaces,
    robotsTxt,
    checkedAt: new Date().toISOString(),
  };

  // Try to detect WP version from feed
  try {
    const feedRes = await fetchWithRetry(`${BASE_URL}/feed/`);
    const feed = await feedRes.text();
    const gen = feed.match(/generator>https?:\/\/wordpress\.org\/\?v=([^<]+)</i);
    if (gen) siteInfo.wordpressVersion = gen[1];
  } catch {
    siteInfo.wordpressVersion = 'unknown (not exposed in feed)';
  }

  console.log('=== STEP 2: Sitemap crawl ===');
  const sitemap = await fetchSitemapUrls();

  console.log('=== STEP 4: WordPress REST API inventory ===');
  const [pages, posts, categories, tags, media] = await Promise.all([
    fetchAll('pages'),
    fetchAll('posts'),
    fetchAll('categories'),
    fetchAll('tags'),
    fetchAll('media'),
  ]);

  let types = {};
  try {
    types = await fetchJson(`${BASE_URL}/wp-json/wp/v2/types`);
  } catch (e) {
    types = { _error: String(e) };
  }

  let users = [];
  try {
    users = await fetchAll('users');
  } catch {
    users = [];
  }

  let menus = [];
  try {
    menus = await fetchJson(`${BASE_URL}/wp-json/wp/v2/menus`);
  } catch {
    menus = [];
  }

  const pagesSummary = pages.map((p) => summarizeWpItem(p, 'page'));
  const postsSummary = posts.map((p) => summarizeWpItem(p, 'post'));
  const categoriesSummary = categories.map((c) => summarizeWpItem(c, 'category'));
  const tagsSummary = tags.map((t) => summarizeWpItem(t, 'tag'));
  const mediaSummary = media.map((m) => summarizeWpItem(m, 'media'));

  // Build URL inventory from sitemap + REST + internal links
  const urlSet = new Set(sitemap.urls);
  [...pages, ...posts, ...categories, ...tags].forEach((item) => {
    if (item.link) urlSet.add(item.link);
  });
  urlSet.add(BASE_URL + '/');
  urlSet.add(`${BASE_URL}/robots.txt`);
  urlSet.add(`${BASE_URL}/sitemap_index.xml`);

  // Pagination URLs from categories
  categories.forEach((cat) => {
    const pages = Math.ceil((cat.count || 0) / 10);
    for (let p = 2; p <= pages; p++) {
      urlSet.add(`${cat.link}page/${p}/`);
    }
  });

  const allUrls = [...urlSet].sort();

  console.log(`=== STEP 3: SEO crawl (${allUrls.length} URLs) ===`);
  const seoData = [];
  for (let i = 0; i < allUrls.length; i++) {
    const url = allUrls[i];
    process.stdout.write(`  SEO ${i + 1}/${allUrls.length}: ${url.slice(0, 60)}...\r`);
    try {
      seoData.push(await crawlSeo(url));
    } catch (e) {
      seoData.push({ url, error: String(e) });
    }
    await sleep(DELAY_MS);
  }
  console.log(`\n  SEO crawl complete: ${seoData.length} pages`);

  // Discover additional internal links from crawled pages
  const discoveredLinks = new Set(allUrls);
  seoData.forEach((page) => {
    (page.internalLinks || []).forEach((l) => discoveredLinks.add(l));
  });

  // Redirect detection via HEAD requests on known URLs
  const redirects = [];
  for (const url of allUrls.slice(0, 30)) {
    try {
      const res = await fetchWithRetry(url, { method: 'HEAD', redirect: 'manual' });
      if ([301, 302, 307, 308].includes(res.status)) {
        redirects.push({
          from: url,
          status: res.status,
          location: res.headers.get('location'),
        });
      }
    } catch {
      /* ignore */
    }
    await sleep(100);
  }

  const customPostTypes = Object.entries(types)
    .filter(([slug]) => !['post', 'page', 'attachment', 'nav_menu_item', 'wp_block', 'wp_template', 'wp_template_part', 'wp_global_styles', 'wp_navigation', 'wp_font_family', 'wp_font_face'].includes(slug))
    .map(([slug, info]) => ({ slug, name: info.name, restBase: info.rest_base }));

  const siteStructure = {
    siteInfo,
    navigation: {
      menusAccessible: menus.length > 0,
      menuCount: menus.length,
      menus,
    },
    customPostTypes,
    urlCounts: {
      sitemap: sitemap.urls.length,
      restApi: pages.length + posts.length + categories.length,
      discovered: discoveredLinks.size,
      seoCrawled: seoData.length,
    },
    contentCounts: {
      pages: pages.length,
      posts: posts.length,
      categories: categories.length,
      tags: tags.length,
      media: media.length,
      users: users.length,
    },
  };

  fs.writeFileSync(path.join(OUT_DIR, 'urls.json'), JSON.stringify({
    sitemapIndex: sitemap.sitemapIndex,
    sitemapUrls: sitemap.urls,
    allDiscoveredUrls: [...discoveredLinks].sort(),
    crawlUrls: allUrls,
    totalCount: discoveredLinks.size,
    robotsTxt,
    generatedAt: new Date().toISOString(),
  }, null, 2));

  fs.writeFileSync(path.join(OUT_DIR, 'pages.json'), JSON.stringify(pagesSummary, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'posts.json'), JSON.stringify(postsSummary, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'categories.json'), JSON.stringify(categoriesSummary, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'media.json'), JSON.stringify(mediaSummary, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'seo.json'), JSON.stringify(seoData, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'redirects.json'), JSON.stringify(redirects, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'site-structure.json'), JSON.stringify(siteStructure, null, 2));

  // Also save tags and audit summary
  fs.writeFileSync(path.join(OUT_DIR, 'tags.json'), JSON.stringify(tagsSummary, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'audit-summary.json'), JSON.stringify({
    completedAt: new Date().toISOString(),
    urlsDiscovered: discoveredLinks.size,
    pages: pages.length,
    posts: posts.length,
    categories: categories.length,
    tags: tags.length,
    media: media.length,
    seoPlugin: siteInfo.seoPlugin,
    pageBuilder: siteInfo.pageBuilder,
    theme: siteInfo.theme,
    customPostTypes: customPostTypes.map((c) => c.slug),
    authWorking: authResult.authenticated,
    inaccessible: [
      !authResult.authenticated && 'WordPress admin/login (hidden or credentials not accepted via REST)',
      menus.length === 0 && 'WordPress menus via REST API',
      'ACF custom fields (requires authenticated access)',
      'Rank Math redirect rules (admin-only)',
      'Draft/private content (requires auth)',
    ].filter(Boolean),
  }, null, 2));

  console.log('\n=== Audit complete ===');
  console.log(JSON.stringify({
    urls: discoveredLinks.size,
    pages: pages.length,
    posts: posts.length,
    categories: categories.length,
    media: media.length,
  }));
}

main().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
