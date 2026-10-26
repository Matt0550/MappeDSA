// Bakes three feeds into index.html as STATIC HTML, each between its own markers:
//   <!-- MAPS:START/END -->  latest concept maps from the blog (category 6), linked to WordPress
//   <!-- PILLOLE:START/END --> latest "In pillole" posts (short video + maps + summary)
//   <!-- APP:START/END -->   latest quizzes, flashcard decks and community maps from mappedsa.app
//   <!-- BLOG:START/END -->  latest blog posts that are not maps, appunti or pillole (news, scuola, ...)
//
// Run locally:  node scripts/update-posts.mjs
// In CI:        see .github/workflows/update-posts.yml (daily)
//
// Design notes:
// - Output is static HTML so the cards are crawlable (mobile-first indexing) and the
//   page stays fast/resilient even if a source is slow or down. It also keeps the
//   browser away from api.mappedsa.app, whose CORS does not allow mappedsa.it.
// - Official maps come from the blog, not from the app feed: the blog carries the ads.
// - Each source fails on its own: on a fetch error its block is left untouched (the
//   last good cards remain) and the script still exits 0.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INDEX = join(__dirname, '..', 'index.html');

const WP = 'https://mappedsa.altervista.org/wp-json/wp/v2/posts';
const WP_MAPS_CATEGORY = 6; // "Mappe Concettuali"
const WP_NOTES_CATEGORY = 105; // "Appunti"
const WP_PILLS_CATEGORY = 165; // "In pillole"
const FEED = 'https://api.mappedsa.app/api/v1/feed';
const APP = 'https://mappedsa.app';
const LOGO = 'https://mappedsa.it/static/favicon/web-app-manifest-512x512.png';
const UA = { 'User-Agent': 'MappeDSA-bot/1.0 (+https://mappedsa.it)' };

const dateFmt = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });

// Feed content_type -> public page segment and card look (see webapp useFeedCards.ts)
const APP_TYPES = {
    quiz: { path: 'quiz', label: 'Quiz', tile: 'bg-lilac-100', chip: 'bg-lilac-100 text-lilac-700' },
    flashcard_deck: { path: 'deck', label: 'Flashcard', tile: 'bg-mint-100', chip: 'bg-mint-100 text-mint-700' },
    content_community: { path: 'community', label: 'Mappa', tile: 'bg-brand-50', chip: 'bg-brand-50 text-brand-700' },
};

// Decode the HTML entities WordPress returns in titles (&#8211;, &amp;, …)
function decodeEntities(s) {
    return String(s)
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
        .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;|&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

// Re-escape for safe insertion into HTML text / attributes
function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function pickImage(post) {
    const media = post?._embedded?.['wp:featuredmedia']?.[0];
    const sizes = media?.media_details?.sizes;
    return (
        sizes?.medium_large?.source_url ||
        sizes?.large?.source_url ||
        sizes?.medium?.source_url ||
        media?.source_url ||
        LOGO
    );
}

// Cards sit in a snap row on mobile and a grid on desktop (see .feed-row in index.html)
const CARD = 'feed-card group bg-card rounded-xl shadow-card border border-line overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-float transition duration-200';

function postCard(post) {
    const title = escapeHtml(decodeEntities(post.title?.rendered || 'MappeDSA'));
    return `                    <a href="${escapeHtml(post.link)}" target="_blank" rel="noopener" class="${CARD}">
                        <div class="aspect-[768/354] overflow-hidden bg-tan">
                            <img src="${escapeHtml(pickImage(post))}" alt="" loading="lazy"
                                class="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300">
                        </div>
                        <div class="p-3.5 flex flex-col gap-1">
                            <span class="text-[11px] font-medium text-muted">${escapeHtml(dateFmt.format(new Date(post.date)))}</span>
                            <span class="font-semibold text-ink text-sm leading-snug line-clamp-2">${title}</span>
                        </div>
                    </a>`;
}

function appCard(item, ogImage) {
    const t = APP_TYPES[item.content_type];
    const label = item.content_type === 'content_community' && item.type === 'appunti' ? 'Appunti' : t.label;
    const title = escapeHtml(item.title || 'MappeDSA');
    const emoji = escapeHtml(item.subject?.emoji || '📚');
    const cover = item.cover_url || ogImage;
    const tile = cover
        ? `<img src="${escapeHtml(cover)}" alt="" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300">`
        : `<span class="text-4xl" aria-hidden="true">${emoji}</span>`;
    const subject = item.subject?.label
        ? `<span class="rounded-full bg-tan/70 px-2 py-0.5">${escapeHtml(item.subject.label)}</span>` : '';
    const official = item.is_official
        ? `<span class="rounded-full bg-brand-50 text-brand-700 px-2 py-0.5">Ufficiale</span>` : '';
    return `                    <a href="${APP}/${t.path}/${encodeURIComponent(item.id)}" target="_blank" rel="noopener" class="${CARD}">
                        <div class="aspect-[768/354] overflow-hidden grid place-items-center ${t.tile}">
                            ${tile}
                        </div>
                        <div class="p-3.5 flex flex-col gap-1.5">
                            <span class="flex flex-wrap gap-1 text-[11px] font-semibold text-ink">
                                <span class="rounded-full px-2 py-0.5 ${t.chip}">${label}</span>${subject}${official}
                            </span>
                            <span class="font-semibold text-ink text-sm leading-snug line-clamp-2">${title}</span>
                        </div>
                    </a>`;
}

async function getJson(url) {
    const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// Quizzes and decks have no cover: use the share image the webapp renders for their
// page (its URL is signed, so it can only be read from the page's og:image tag).
async function ogImage(url) {
    try {
        const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20_000) });
        if (!res.ok) return null;
        const m = (await res.text()).match(/<meta property="og:image" content="([^"]+)"/);
        return m ? m[1].replace(/&amp;/g, '&') : null;
    } catch {
        return null;
    }
}

// A top category plus its subject subcategories (posts may carry only the subcategory)
async function categoryTree(ids) {
    const cats = await getJson(`${WP.replace('/posts', '/categories')}?per_page=100&_fields=id,parent`);
    return cats.filter(c => ids.includes(c.id) || ids.includes(c.parent)).map(c => c.id);
}

async function wpPosts(filter, count) {
    const posts = await getJson(`${WP}?per_page=${count}&${filter}&_embed=wp:featuredmedia&_fields=id,date,link,title,_links,_embedded`);
    if (!Array.isArray(posts) || posts.length === 0) throw new Error('empty post list');
    return posts.map(postCard);
}

async function appItems(count) {
    const types = Object.keys(APP_TYPES).map(t => `content_types=${t}`).join('&');
    const body = await getJson(`${FEED}?sort=recent&limit=${count}&${types}`);
    const items = (body?.message?.items || []).filter(i => i.kind === 'content' && APP_TYPES[i.content_type]);
    if (items.length === 0) throw new Error('empty feed');
    const ogs = await Promise.all(items.map(i => i.cover_url ? null : ogImage(`${APP}/${APP_TYPES[i.content_type].path}/${encodeURIComponent(i.id)}`)));
    return items.map((item, i) => appCard(item, ogs[i]));
}

const SOURCES = {
    MAPS: () => wpPosts(`categories=${WP_MAPS_CATEGORY}`, 6),
    PILLOLE: async () => wpPosts(`categories=${(await categoryTree([WP_PILLS_CATEGORY])).join(',')}`, 4),
    APP: () => appItems(6),
    BLOG: async () => wpPosts(`categories_exclude=${(await categoryTree([WP_MAPS_CATEGORY, WP_NOTES_CATEGORY, WP_PILLS_CATEGORY])).join(',')}`, 4),
};

async function main() {
    const original = await readFile(INDEX, 'utf8');
    let html = original;

    const results = await Promise.allSettled(Object.values(SOURCES).map(fn => fn()));
    Object.keys(SOURCES).forEach((name, i) => {
        const r = results[i];
        if (r.status === 'rejected') {
            console.warn(`[update-posts] ${name}: fetch failed, block left unchanged: ${r.reason?.message}`);
            return;
        }
        const re = new RegExp(`(<!-- ${name}:START -->)[\\s\\S]*?(<!-- ${name}:END -->)`);
        if (!re.test(html)) {
            console.error(`[update-posts] ${name}: markers not found in index.html`);
            process.exit(1);
        }
        html = html.replace(re, () => `<!-- ${name}:START -->\n${r.value.join('\n')}\n                    <!-- ${name}:END -->`);
        console.log(`[update-posts] ${name}: ${r.value.length} cards.`);
    });

    if (html === original) {
        console.log('[update-posts] no change.');
        return;
    }
    await writeFile(INDEX, html);
}

main();
