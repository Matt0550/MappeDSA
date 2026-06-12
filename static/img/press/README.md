# Loghi "Parlano di noi"

Metti qui i loghi delle testate mostrati nella sezione **Parlano di noi**.

- Formato: **SVG** (ideale, non sgrana mai) oppure **PNG-24 con sfondo trasparente**.
- Loghi **orizzontali**. Lo slot a schermo è ~130×36px, quindi esporta a 2–3×:
  - **Altezza: 96px**, larghezza naturale fino a **~320px** (oltre viene ridotto da `object-contain`).
  - Ritaglia il canvas stretto attorno al logo (la card aggiunge già lo spazio).
- Opzionale (resa più uniforme): metti ogni logo su un canvas trasparente fisso
  **320×96px centrato**, così wordmark sottili e loghi compatti appaiono otticamente uguali.
- Nomi file attesi (vedi `static/js/config.js` → `CONFIG.press`):
  - `orizzontescuola.png`
  - `testata-2.png`
  - `testata-3.png`
  - `testata-4.png`

Se un file manca, la card mostra automaticamente il **nome della testata** come fallback,
quindi la pagina non si rompe mai.
