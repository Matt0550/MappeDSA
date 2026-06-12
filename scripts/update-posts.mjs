// Fetches the latest posts from the MappeDSA blog (WordPress REST API) and injects
// them as STATIC HTML into index.html, between the <!-- POSTS:START --> /
// <!-- POSTS:END --> markers.
//
// Run locally:  node scripts/update-posts.mjs
// In CI:        see .github/workflows/update-posts.yml (every few hours)
//
// Design notes:
// - Output is static HTML so the posts are crawlable (mobile-first indexing) and the
//   page stays fast/resilient even if the blog is slow or down.
// - On any fetch error we leave index.html untouched (the last good posts remain) and
//   exit 0, so a transient blog outage never breaks the site or spams CI failures.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INDEX = join(ROOT, 'index.html');

const API = 'https://mappedsa.altervista.org/wp-json/wp/v2/posts';
const COUNT = 6;
const LOGO = 'https://mappedsa.it/static/favicon/web-app-manifest-512x512.png';

const START = '<!-- POSTS:START -->';
const END = '<!-- POSTS:END -->';

const dateFmt = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });

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

function card(post) {
    const title = escapeHtml(decodeEntities(post.title?.rendered || 'MappeDSA'));
    const link = escapeHtml(post.link);
    const img = escapeHtml(pickImage(post));
    const date = escapeHtml(dateFmt.format(new Date(post.date)));
    return `                <a href="${link}" target="_blank" rel="noopener"
                    class="group glass rounded-2xl overflow-hidden flex flex-col hover:-translate-y-0.5 transition duration-200">
                    <div class="aspect-[768/354] overflow-hidden bg-slate-100">
                        <img src="${img}" alt="${title}" loading="lazy"
                            class="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300">
                    </div>
                    <div class="p-3.5 flex flex-col gap-1">
                        <span class="text-[11px] font-medium text-slate-400">${date}</span>
                        <span class="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">${title}</span>
                    </div>
                </a>`;
}

async function main() {
    let posts;
    try {
        const url = `${API}?per_page=${COUNT}&_embed=wp:featuredmedia&_fields=id,date,link,title,_links,_embedded`;
        const res = await fetch(url, { headers: { 'User-Agent': 'MappeDSA-bot/1.0 (+https://mappedsa.it)' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        posts = await res.json();
        if (!Array.isArray(posts) || posts.length === 0) throw new Error('empty post list');
    } catch (err) {
        console.warn(`[update-posts] fetch failed, leaving index.html unchanged: ${err.message}`);
        process.exit(0);
    }

    const cards = posts.map(card).join('\n');
    const html = await readFile(INDEX, 'utf8');

    const re = new RegExp(`(${START})[\\s\\S]*?(${END})`);
    if (!re.test(html)) {
        console.error('[update-posts] markers not found in index.html');
        process.exit(1);
    }

    const updated = html.replace(re, `$1\n${cards}\n                $2`);
    if (updated === html) {
        console.log('[update-posts] no change.');
        return;
    }
    await writeFile(INDEX, updated);
    console.log(`[update-posts] injected ${posts.length} posts.`);
}

main();
