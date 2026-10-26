/* ============================================================
   MappeDSA — Configurazione contenuti del link-bio.
   Modifica qui social, link, "last minute" e "Parlano di noi".
   Caricato da index.html PRIMA dello script di rendering.
   ============================================================ */
const CONFIG = {
    socials: [
        { label: 'Instagram', href: 'https://instagram.com/mappe.dsa', icon: 'fa-brands fa-instagram', hover: 'hover:text-pink-600', enabled: true },
        { label: 'TikTok', href: 'https://www.tiktok.com/@mappe.dsa', icon: 'fa-brands fa-tiktok', hover: 'hover:text-slate-900', enabled: true },
        { label: 'Youtube', href: 'https://www.youtube.com/@MappeDSA', icon: 'fa-brands fa-youtube', hover: 'hover:text-red-900', enabled: true },
        { label: 'Facebook', href: 'https://facebook.com/profile.php?id=61565118999032', icon: 'fa-brands fa-facebook-f', hover: 'hover:text-blue-600', enabled: true },
        { label: 'Telegram', href: 'https://t.me/mappedsa', icon: 'fa-brands fa-telegram', hover: 'hover:text-sky-500', enabled: true }
    ],
    lastMinute: [
       { label: 'Beta Testing App MappeDSA', sub: 'L\'app ufficiale di MappeDSA sta arrivando: mappe, quiz, flashcard e AI, tutto in tasca. Candidati ora per provarla in super anteprima prima del lancio ufficiale.', href: 'https://go.mappedsa.it/form-beta-mobile', icon: 'fa-solid fa-mobile-screen-button', badge: 'Posti limitati', enabled: false, startDate: null, endDate: null },

   ],
    links: [
        { label: 'Visita il sito MappeDSA', href: 'https://go.mappedsa.it/website', icon: 'fa-solid fa-globe', chip: 'bg-indigo-50 text-indigo-600', highlight: true, enabled: true },
        // { label: 'Richiedi una mappa o appunti', href: 'https://go.mappedsa.it/richiedi-appunti', icon: 'fa-solid fa-plus', chip: 'bg-blue-50 text-blue-600', enabled: true },
        // { label: 'Invia le tue mappe', href: 'https://go.mappedsa.it/community', icon: 'fa-solid fa-paper-plane', chip: 'bg-red-50 text-red-600', enabled: true },
        { label: 'Sostieni il progetto', href: 'https://go.mappedsa.it/donazioni', icon: 'fa-solid fa-heart', chip: 'bg-rose-50 text-rose-500', enabled: true },
        { label: 'Contattaci / Supporto', href: 'https://go.mappedsa.it/supporto', icon: 'fa-solid fa-headset', chip: 'bg-emerald-50 text-emerald-600', enabled: true },
        { label: 'Intervista Orizzonte Scuola', href: 'https://go.mappedsa.it/orizzontescuola-intervista', icon: 'fa-solid fa-newspaper', chip: 'bg-cyan-50 text-cyan-600', enabled: true },
        // { label: 'Sistemi e Reti: Soluzione della seconda prova', href: 'https://go.mappedsa.it/kOxSMw', icon: 'fa-solid fa-search', enabled: true}
    ],
    press: [
        { name: 'Orizzonte Scuola', href: 'https://go.mappedsa.it/orizzontescuola', logo: '/static/img/press/orizzontescuola.svg', enabled: true },
        { name: 'Il Fatto Nisseno', href: 'https://go.mappedsa.it/ilfattonisseno', logo: '/static/img/press/ilfattonisseno.webp', enabled: true },
        { name: 'SeguoNews', href: 'https://go.mappedsa.it/seguonews', logo: '/static/img/press/seguonews.svg', enabled: true },
        { name: 'BlogSicilia', href: 'https://go.mappedsa.it/blogsicilia', logo: '/static/img/press/blogsicilia.webp', enabled: true }
    ]
};
