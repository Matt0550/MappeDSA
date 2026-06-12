/* ============================================================
   MappeDSA — Configurazione contenuti del link-bio.
   Modifica qui social, link, "last minute" e "Parlano di noi".
   Caricato da index.html PRIMA dello script di rendering.
   ============================================================ */
const CONFIG = {
    socials: [
        { label: 'Instagram', href: 'https://instagram.com/mappe.dsa', icon: 'fa-brands fa-instagram', hover: 'hover:text-pink-600', enabled: true },
        { label: 'TikTok', href: 'https://www.tiktok.com/@mappe.dsa', icon: 'fa-brands fa-tiktok', hover: 'hover:text-slate-900', enabled: true },
        { label: 'Facebook', href: 'https://facebook.com/profile.php?id=61565118999032', icon: 'fa-brands fa-facebook-f', hover: 'hover:text-blue-600', enabled: true },
        { label: 'Telegram', href: 'https://t.me/mappedsa', icon: 'fa-brands fa-telegram', hover: 'hover:text-sky-500', enabled: true }
    ],
    lastMinute: [
        { label: 'Matutirà 2026: Commissari Esterni ', sub: 'Clicca per accedere al motore di ricerca delle commissioni', href: 'https://go.mappedsa.it/KnRJR3', icon: 'fa-solid fa-search', badge: 'Last minute', enabled: false, startDate: null, endDate: '2026-06-18T00:00:00Z' }
    ],
    links: [
        { label: 'Visita il sito MappeDSA', href: 'https://go.mappedsa.it/website', icon: 'fa-solid fa-globe', chip: 'bg-indigo-50 text-indigo-600', highlight: true, enabled: true },
        { label: 'Richiedi una mappa o appunti', href: 'https://go.mappedsa.it/richiedi-appunti', icon: 'fa-solid fa-plus', chip: 'bg-blue-50 text-blue-600', enabled: true },
        { label: 'Sostieni il progetto', href: 'https://go.mappedsa.it/donazioni', icon: 'fa-solid fa-heart', chip: 'bg-rose-50 text-rose-500', enabled: true },
        { label: 'Contattaci / Supporto', href: 'https://go.mappedsa.it/supporto', icon: 'fa-solid fa-headset', chip: 'bg-emerald-50 text-emerald-600', enabled: true },
        { label: 'Articolo Orizzonte Scuola', href: 'https://go.mappedsa.it/orizzontescuola', icon: 'fa-solid fa-newspaper', chip: 'bg-cyan-50 text-cyan-600', enabled: true }
    ],
    // "Parlano di noi" — loghi della rassegna stampa.
    //   logo: metti il file in /static/img/press/ (PNG/SVG, sfondo trasparente, ~ orizzontale).
    //         Se il file manca, viene mostrato automaticamente il nome come fallback.
    //   href: short link go.mappedsa.it che reindirizza all'articolo.
    // TODO: sostituisci "Testata 2/3/4" con le testate reali e i relativi short link + loghi.
    press: [
        { name: 'Orizzonte Scuola', href: 'https://go.mappedsa.it/orizzontescuola', logo: '/static/img/press/orizzontescuola.svg', enabled: true },
        { name: 'Testata 2', href: 'https://go.mappedsa.it/ilfattonisseno', logo: '/static/img/press/ilfattonisseno.webp', enabled: true },
        { name: 'Testata 3', href: 'https://go.mappedsa.it/seguonews', logo: '/static/img/press/seguonews.svg', enabled: true },
        { name: 'Testata 4', href: 'https://go.mappedsa.it/blogsicilia', logo: '/static/img/press/blogsicilia.webp', enabled: true }
    ]
};
