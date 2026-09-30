#!/usr/bin/env node
/**
 * Phase 1b — Authenticated READ-ONLY WordPress audit
 * Updates existing /migration-audit/ files with admin-accessible data.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://adwrks.co.il';
const OUT_DIR = path.join(__dirname, '..', 'migration-audit');
const DELAY_MS = 250;
const AUTH = {
  user: process.env.WP_USER || 'migration',
  pass: process.env.WP_APP_PASS || '',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function authHeader() {
  const token = Buffer.from(`${AUTH.user}:${AUTH.pass}`).toString('base64');
  return { Authorization: `Basic ${token}` };
}

async function fetchAuth(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': 'AdwrksMigrationAudit/1.0b (read-only)',
      ...authHeader(),
      ...(options.headers || {}),
    },
  });
  return res;
}

async function fetchAuthJson(url, options = {}) {
  const res = await fetchAuth(url, options);
  const text = await res.text();
  if (!res.ok) {
    return { _error: true, status: res.status, url, body: text.slice(0, 500) };
  }
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text };
  }
}

async function fetchAllAuth(endpoint, params = {}) {
  const perPage = 100;
  let page = 1;
  let totalPages = 1;
  const all = [];

  while (page <= totalPages) {
    const qs = new URLSearchParams({ ...params, per_page: String(perPage), page: String(page) });
    const url = `${BASE_URL}/wp-json/wp/v2/${endpoint}?${qs}`;
    const res = await fetchAuth(url);
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
  console.log(`  ${endpoint}: ${all.length} items`);
  return all;
}

function extractRankMathMeta(meta = {}) {
  const rankKeys = Object.keys(meta).filter((k) =>
    k.startsWith('rank_math') || k.includes('rank-math') || k === 'rank_math_seo_score'
  );
  const out = {};
  rankKeys.forEach((k) => { out[k] = meta[k]; });
  return out;
}

function extractElementorMeta(meta = {}) {
  const keys = Object.keys(meta).filter((k) => k.startsWith('_elementor'));
  const out = {};
  keys.forEach((k) => {
    if (k === '_elementor_data' && typeof meta[k] === 'string') {
      try {
        out[k] = JSON.parse(meta[k]);
      } catch {
        out[k] = meta[k];
      }
    } else {
      out[k] = meta[k];
    }
  });
  return out;
}

function extractCustomFields(meta = {}) {
  const skip = new Set([
    'site-sidebar-layout', 'site-content-layout', 'ast-site-content-layout',
    'site-content-style', 'site-sidebar-style', 'ast-global-header-display',
    'ast-banner-title-visibility', 'ast-main-header-display', 'ast-hfb-above-header-display',
    'ast-hfb-below-header-display', 'ast-hfb-mobile-header-display', 'site-post-title',
    'ast-breadcrumbs-content', 'ast-featured-img', 'footer-sml-layout', 'ast-disable-related-posts',
    'theme-transparent-header-meta', 'adv-header-id-meta', 'stick-header-meta',
    'header-above-stick-meta', 'header-main-stick-meta', 'header-below-stick-meta',
    'astra-migrate-meta-layouts', 'ast-page-background-enabled', 'ast-page-background-meta',
    'ast-content-background-meta', 'footnotes',
  ]);
  const out = {};
  Object.entries(meta).forEach(([k, v]) => {
    if (k.startsWith('_elementor') || k.startsWith('rank_math')) return;
    if (skip.has(k)) return;
    if (v === '' || v === null || v === undefined) return;
    out[k] = v;
  });
  return out;
}

function summarizeContentItem(item, type) {
  return {
    id: item.id,
    slug: item.slug,
    link: item.link,
    title: item.title?.rendered || item.name || '',
    status: item.status,
    date: item.date,
    modified: item.modified,
    type,
    content: item.content?.rendered || '',
    excerpt: item.excerpt?.rendered || '',
    parent: item.parent || 0,
    featuredMedia: item.featured_media || 0,
    categories: item.categories || [],
    tags: item.tags || [],
    rankMath: extractRankMathMeta(item.meta || {}),
    elementor: extractElementorMeta(item.meta || {}),
    customFields: extractCustomFields(item.meta || {}),
  };
}

function buildMenuTree(items) {
  const byParent = {};
  items.forEach((item) => {
    const pid = item.parent || 0;
    if (!byParent[pid]) byParent[pid] = [];
    byParent[pid].push(item);
  });
  Object.values(byParent).forEach((arr) => arr.sort((a, b) => a.menu_order - b.menu_order));

  function walk(parentId = 0) {
    return (byParent[parentId] || []).map((item) => ({
      id: item.id,
      title: item.title?.rendered || '',
      url: item.url,
      type: item.type,
      object: item.object,
      objectId: item.object_id,
      menuOrder: item.menu_order,
      target: item.target,
      classes: item.classes,
      menuId: item.menus,
      children: walk(item.id),
    }));
  }
  return walk();
}

async function tryRankMathRedirects() {
  const attempts = [];

  // No dedicated GET route exists in Rank Math REST — try export settings (read-only intent)
  const exportRes = await fetchAuth(`${BASE_URL}/wp-json/rankmath/v1/status/exportSettings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const exportText = await exportRes.text();
  attempts.push({ endpoint: 'rankmath/v1/status/exportSettings', status: exportRes.status });

  let exportData = null;
  try {
    exportData = JSON.parse(exportText);
  } catch {
    exportData = exportText.slice(0, 1000);
  }

  // Per-post redirect meta from content items handled separately
  return {
    globalRedirectsExport: exportRes.ok ? exportData : { _error: true, status: exportRes.status, body: exportText.slice(0, 500) },
    attempts,
    note: 'Rank Math has no public GET /redirections REST route; redirects collected from post-level meta where present.',
  };
}

async function main() {
  if (!AUTH.pass) {
    console.error('WP_APP_PASS environment variable required');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log('=== Phase 1b: Verify authentication ===');
  const me = await fetchAuthJson(`${BASE_URL}/wp-json/wp/v2/users/me`);
  if (me._error) {
    console.error('Authentication failed:', me);
    process.exit(1);
  }
  console.log(`Authenticated as: ${me.name} (id ${me.id})`);

  console.log('=== Fetch plugins ===');
  const plugins = await fetchAuthJson(`${BASE_URL}/wp-json/wp/v2/plugins`);

  console.log('=== Fetch menus ===');
  const menus = await fetchAllAuth('menus');
  const menuLocations = await fetchAuthJson(`${BASE_URL}/wp-json/wp/v2/menu-locations`);
  const menuItems = await fetchAllAuth('menu-items');
  const menuStructure = menus.map((menu) => ({
    id: menu.id,
    name: menu.name,
    slug: menu.slug,
    locations: menu.locations || [],
    items: buildMenuTree(menuItems.filter((i) => i.menus === menu.id)),
  }));

  console.log('=== Fetch content with edit context (Rank Math + Elementor meta) ===');
  const pagesRaw = await fetchAllAuth('pages', { context: 'edit', status: 'publish,draft,private,future,pending' });
  const postsRaw = await fetchAllAuth('posts', { context: 'edit', status: 'publish,draft,private,future,pending' });

  const pages = pagesRaw.map((p) => summarizeContentItem(p, 'page'));
  const posts = postsRaw.map((p) => summarizeContentItem(p, 'post'));

  // Collect per-post Rank Math redirect meta
  const postRedirects = [...pages, ...posts]
    .map((item) => {
      const rm = item.rankMath || {};
      const url = rm.rank_math_redirection_url || rm.rank_math_redirections || null;
      if (!url && !rm.rank_math_redirection_type) return null;
      return {
        objectId: item.id,
        objectType: item.type,
        slug: item.slug,
        link: item.link,
        redirectionUrl: url,
        redirectionType: rm.rank_math_redirection_type || null,
        redirectionEnabled: rm.rank_math_redirection_enabled || null,
      };
    })
    .filter(Boolean);

  console.log('=== Fetch custom post types ===');
  const elementorLibrary = await fetchAllAuth('elementor_library', { context: 'edit' });
  const floatingButtons = await fetchAllAuth('e-floating-buttons', { context: 'edit' });
  const elementorSnippets = await fetchAllAuth('elementor_snippet', { context: 'edit' });
  const rmContentEditor = await fetchAllAuth('rm_content_editor', { context: 'edit' });

  const elementorTemplates = elementorLibrary.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title?.rendered || '',
    status: t.status,
    link: t.link,
    templateType: t.meta?._elementor_template_type || null,
    editMode: t.meta?._elementor_edit_mode || null,
    conditions: t.meta?._elementor_conditions || null,
    elementorData: (() => {
      try { return JSON.parse(t.meta?._elementor_data || '[]'); } catch { return t.meta?._elementor_data || null; }
    })(),
    pageSettings: t.meta?._elementor_page_settings || null,
  }));

  // Identify header/footer templates
  const headerFooterTemplates = elementorTemplates.filter((t) =>
    ['header', 'footer', 'section', 'page', 'single', 'archive'].includes(t.templateType)
  );

  console.log('=== Fetch Elementor site-editor templates ===');
  const siteEditorTemplates = await fetchAuthJson(`${BASE_URL}/wp-json/elementor/v1/site-editor/templates`);
  const elementorGlobals = await fetchAuthJson(`${BASE_URL}/wp-json/elementor/v1/globals`);

  console.log('=== Fetch Rank Math data ===');
  const rankMathRedirects = await tryRankMathRedirects();
  const rankMathLinksPosts = await fetchAuthJson(`${BASE_URL}/wp-json/rankmath/v1/links/posts?per_page=100&page=1`);

  // Build rank math SEO summary from content meta
  const rankMathSeo = [...pages, ...posts].map((item) => ({
    id: item.id,
    type: item.type,
    slug: item.slug,
    link: item.link,
    title: item.title,
    rankMath: item.rankMath,
  }));

  // Custom fields inventory
  const customFieldsInventory = {};
  [...pages, ...posts, ...elementorLibrary].forEach((item) => {
    const fields = item.customFields || extractCustomFields(item.meta || {});
    Object.keys(fields).forEach((k) => {
      if (!customFieldsInventory[k]) customFieldsInventory[k] = { count: 0, sampleValues: [] };
      customFieldsInventory[k].count++;
      if (customFieldsInventory[k].sampleValues.length < 3) {
        customFieldsInventory[k].sampleValues.push(String(fields[k]).slice(0, 200));
      }
    });
  });

  // Merge redirects
  const existingRedirects = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'redirects.json'), 'utf8'));
  const redirects = {
    scannedAt: new Date().toISOString(),
    httpRedirects: existingRedirects,
    rankMathGlobal: rankMathRedirects.globalRedirectsExport,
    rankMathPostLevel: postRedirects,
    totalPostLevelRedirects: postRedirects.length,
  };

  // Update site-structure
  const siteStructure = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'site-structure.json'), 'utf8'));
  siteStructure.auth = {
    authenticated: true,
    user: { id: me.id, name: me.name, slug: me.slug },
    method: 'application_password',
    checkedAt: new Date().toISOString(),
  };
  siteStructure.navigation = {
    menusAccessible: true,
    menuCount: menus.length,
    menuLocations,
    menus: menuStructure,
    totalMenuItems: menuItems.length,
  };
  siteStructure.plugins = Array.isArray(plugins) ? plugins.map((p) => ({
    plugin: p.plugin,
    name: p.name,
    version: p.version,
    status: p.status,
  })) : plugins;
  siteStructure.elementor = {
    templateCount: elementorTemplates.length,
    headerFooterCount: headerFooterTemplates.length,
    floatingButtons: floatingButtons.length,
    snippets: elementorSnippets.length,
    siteEditorTemplates: siteEditorTemplates._error ? siteEditorTemplates : (siteEditorTemplates?.data || siteEditorTemplates),
    globalsAccessible: !elementorGlobals._error,
  };
  siteStructure.rankMath = {
    seoRecords: rankMathSeo.length,
    postLevelRedirects: postRedirects.length,
    globalExportAccessible: !rankMathRedirects.globalRedirectsExport?._error,
    internalLinksSample: rankMathLinksPosts._error ? rankMathLinksPosts : rankMathLinksPosts,
  };
  siteStructure.customPostTypes = {
    elementor_library: elementorLibrary.length,
    e_floating_buttons: floatingButtons.length,
    elementor_snippet: elementorSnippets.length,
    rm_content_editor: rmContentEditor.length,
  };
  siteStructure.customFields = {
    uniqueFieldKeys: Object.keys(customFieldsInventory).length,
    fields: customFieldsInventory,
    acfDetected: Object.keys(customFieldsInventory).some((k) => k.startsWith('_') === false && plugins?.some?.((p) => p.plugin?.includes('acf'))),
  };

  // Write/update files
  fs.writeFileSync(path.join(OUT_DIR, 'pages.json'), JSON.stringify(pages, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'posts.json'), JSON.stringify(posts, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'menus.json'), JSON.stringify({
    locations: menuLocations,
    menus: menuStructure,
    rawMenuCount: menus.length,
    rawMenuItemCount: menuItems.length,
  }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'elementor-templates.json'), JSON.stringify({
    templates: elementorTemplates,
    headerFooter: headerFooterTemplates,
    siteEditor: siteEditorTemplates,
    globals: elementorGlobals,
    floatingButtons,
    snippets: elementorSnippets,
  }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'rankmath-seo.json'), JSON.stringify(rankMathSeo, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'redirects.json'), JSON.stringify(redirects, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'custom-fields.json'), JSON.stringify(customFieldsInventory, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'custom-post-types.json'), JSON.stringify({
    elementor_library: elementorLibrary.map((t) => summarizeContentItem(t, 'elementor_library')),
    e_floating_buttons: floatingButtons.map((t) => summarizeContentItem(t, 'e-floating-buttons')),
    elementor_snippet: elementorSnippets.map((t) => summarizeContentItem(t, 'elementor_snippet')),
    rm_content_editor: rmContentEditor.map((t) => summarizeContentItem(t, 'rm_content_editor')),
  }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'plugins.json'), JSON.stringify(plugins, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'site-structure.json'), JSON.stringify(siteStructure, null, 2));

  const phase1bSummary = {
    completedAt: new Date().toISOString(),
    authSucceeded: true,
    authenticatedUser: me.name,
    additionalData: {
      menus: menus.length,
      menuItems: menuItems.length,
      plugins: Array.isArray(plugins) ? plugins.length : 0,
      elementorTemplates: elementorTemplates.length,
      headerFooterTemplates: headerFooterTemplates.length,
      rankMathSeoRecords: rankMathSeo.length,
      postLevelRedirects: postRedirects.length,
      customFieldKeys: Object.keys(customFieldsInventory).length,
      pagesWithElementorData: pages.filter((p) => p.elementor?._elementor_data).length,
      postsWithElementorData: posts.filter((p) => p.elementor?._elementor_data).length,
    },
    rankMathRedirectsRetrieved: postRedirects.length > 0 || !rankMathRedirects.globalRedirectsExport?._error,
    rankMathRedirectsNote: rankMathRedirects.note,
    elementorTemplatesRetrieved: elementorTemplates.length > 0,
    menusRetrieved: menus.length > 0,
    remainingInaccessible: [
      !rankMathRedirects.globalRedirectsExport?._error ? null : 'Rank Math global redirect export via REST',
      Object.keys(customFieldsInventory).length === 0 && 'No non-theme custom fields detected (ACF not installed)',
      'Draft/private content included if accessible to migration user',
    ].filter(Boolean),
    readyForMigration: true,
  };

  fs.writeFileSync(path.join(OUT_DIR, 'audit-summary.json'), JSON.stringify({
    ...JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'audit-summary.json'), 'utf8')),
    phase1b: phase1bSummary,
    authWorking: true,
    inaccessible: phase1bSummary.remainingInaccessible,
  }, null, 2));

  console.log('\n=== Phase 1b complete ===');
  console.log(JSON.stringify(phase1bSummary, null, 2));
}

main().catch((err) => {
  console.error('Phase 1b failed:', err);
  process.exit(1);
});
