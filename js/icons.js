/* ============================================================
   ICONOS
   SVG dibujados a mano, compartidos por todas las ventanas.
   Los degradados viven en un único <svg> oculto para no repetir ids.
   ============================================================ */

document.body.insertAdjacentHTML(
  "afterbegin",
  `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="g-folder" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".5" stop-color="#fbd660"/><stop offset="1" stop-color="#eeb02e"/></linearGradient>
    <linearGradient id="g-folder-back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3c652"/><stop offset="1" stop-color="#c88f1e"/></linearGradient>
    <linearGradient id="g-green" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a4ea8a"/><stop offset=".5" stop-color="#46b53c"/><stop offset="1" stop-color="#1f8424"/></linearGradient>
    <linearGradient id="g-blue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc4ff"/><stop offset=".5" stop-color="#3a80e8"/><stop offset="1" stop-color="#174fb8"/></linearGradient>
    <linearGradient id="g-gray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f4f0"/><stop offset="1" stop-color="#b4b4ac"/></linearGradient>
    <linearGradient id="g-paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#dfe6f2"/></linearGradient>
    <linearGradient id="g-red" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4705a"/><stop offset="1" stop-color="#b81a12"/></linearGradient>
    <linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#e49a1c"/></linearGradient>
    <linearGradient id="g-bin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#dcebf8"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#a8c4de"/></linearGradient>
  </defs></svg>`
);

const tileIcon = (fill, text, size = 13) =>
  `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="3" width="26" height="26" rx="4" fill="${fill}" stroke="#00000055"/><rect x="4" y="4" width="24" height="11" rx="3" fill="#ffffff22"/><text x="16" y="21.5" text-anchor="middle" font-family="Tahoma,Verdana,sans-serif" font-weight="700" font-size="${size}" fill="#fff">${text}</text></svg>`;

const ICONS = {
  terminal: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="4" width="28" height="24" rx="2" fill="url(#g-gray)" stroke="#5c5c5c"/><rect x="3" y="5" width="26" height="4" fill="url(#g-blue)"/><rect x="4" y="10" width="24" height="16" fill="#000"/><path d="M7 13l4 3-4 3" fill="none" stroke="#e8e8e8" stroke-width="1.7"/><rect x="13" y="20" width="7" height="1.7" fill="#e8e8e8"/></svg>`,
  folder: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 9a2 2 0 012-2h7.5l2.5 3h12a2 2 0 012 2v3H3z" fill="url(#g-folder-back)" stroke="#a87a18"/><path d="M2.5 13.5h27L27.6 26a2 2 0 01-2 1.7H6.4a2 2 0 01-2-1.7z" fill="url(#g-folder)" stroke="#a87a18"/><path d="M4 15h24" stroke="#fff8d8" stroke-opacity=".9"/></svg>`,
  cv: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 2h13l6 6v22H7z" fill="url(#g-paper)" stroke="#6b7a90"/><path d="M20 2v6h6z" fill="#c8d4e6" stroke="#6b7a90"/><path d="M10 11h10M10 14h13" stroke="#9fb0c8"/><rect x="4" y="16" width="20" height="10" rx="1.5" fill="url(#g-red)" stroke="#7c1009"/><text x="14" y="23.6" text-anchor="middle" font-family="Tahoma,Verdana,sans-serif" font-weight="700" font-size="7.5" fill="#fff">PDF</text></svg>`,
  mail: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="7" width="26" height="19" rx="1.5" fill="url(#g-paper)" stroke="#4a6fb5"/><path d="M3.5 8L16 18 28.5 8" fill="#d6e3f8" stroke="#4a6fb5"/><path d="M3.5 25.5L12 15M28.5 25.5L20 15" stroke="#9db6dc"/></svg>`,
  github: tileIcon("#24292e", "GH"),
  linkedin: tileIcon("#0a66c2", "in", 15),
  x: tileIcon("#111", "X", 15),
  recycle: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 9h18l-2.2 19a2 2 0 01-2 1.6h-9.6a2 2 0 01-2-1.6z" fill="url(#g-bin)" stroke="#5f7f9c"/><ellipse cx="16" cy="9" rx="9.6" ry="2.8" fill="#eef6fd" stroke="#5f7f9c"/><path d="M12.4 14l-2.2 4h3.6M19.6 14.2l2.2 4-2 3.4M12.6 24h6.6l1.6-2.8M14 14.4l2-3.2 2 3.2" fill="none" stroke="#2f9a2f" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
  back: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13.5" fill="url(#g-green)" stroke="#1a6e1e"/><path d="M18 8l-8 8 8 8v-5h6v-6h-6z" fill="#fff"/></svg>`,
  forward: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13.5" fill="url(#g-green)" stroke="#1a6e1e"/><path d="M14 8l8 8-8 8v-5H8v-6h6z" fill="#fff"/></svg>`,
  up: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 11a2 2 0 012-2h7l2 3h13a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="url(#g-folder)" stroke="#a87a18"/><path d="M16 26v-9h-4l6-7 6 7h-4v9z" fill="url(#g-green)" stroke="#1a6e1e"/></svg>`,
  search: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="13" cy="13" r="9" fill="#d6ecff" stroke="#3a5f94" stroke-width="2.4"/><path d="M20 20l8 8" stroke="#a87a18" stroke-width="4.4" stroke-linecap="round"/></svg>`,
  views: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="5" width="26" height="22" fill="#fff" stroke="#4a6fb5"/><rect x="3" y="5" width="26" height="4" fill="url(#g-blue)"/><path d="M7 13h6v4H7zM18 13h6v4h-6zM7 20h6v4H7zM18 20h6v4h-6z" fill="#7da5e0"/></svg>`,
  go: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" rx="4" fill="url(#g-green)" stroke="#1a6e1e"/><path d="M15 7l9 9-9 9v-6H7v-6h8z" fill="#fff"/></svg>`,
  user: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="11" r="7" fill="url(#g-gold)" stroke="#a87a18"/><path d="M4 29c0-8 5-11 12-11s12 3 12 11z" fill="url(#g-blue)" stroke="#174fb8"/></svg>`,
  code: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="5" width="26" height="22" rx="1.5" fill="url(#g-paper)" stroke="#4a6fb5"/><path d="M12 11l-5 5 5 5M20 11l5 5-5 5" fill="none" stroke="#174fb8" stroke-width="2.6"/></svg>`,
  work: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 10V7a1.5 1.5 0 011.5-1.5h5A1.5 1.5 0 0120 7v3" fill="none" stroke="#6e4a1c" stroke-width="2"/><rect x="3" y="10" width="26" height="17" rx="2" fill="url(#g-gold)" stroke="#8a5e14"/><path d="M3 17h26" stroke="#8a5e14"/><rect x="14" y="15" width="4" height="4" fill="#fff4cc" stroke="#8a5e14"/></svg>`,
  globe: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="url(#g-blue)" stroke="#174fb8"/><path d="M9 7c3 1 6 0 8 2s-3 4-1 7 4 2 3 6-3 5-4 5-3-4-4-7-5-3-6-6 1-6 4-7zM22 9c3 2 5 5 5 8l-4-1c-2-2-3-5-1-7z" fill="url(#g-green)"/></svg>`,
  key: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" rx="4" fill="url(#g-gold)" stroke="#fff"/><circle cx="12" cy="13" r="5" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M15.5 16.5L25 26m-4-4l3-3" stroke="#fff" stroke-width="2.6"/></svg>`,
  power: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" rx="4" fill="url(#g-red)" stroke="#fff"/><path d="M11 10a9 9 0 1010 0" fill="none" stroke="#fff" stroke-width="2.8"/><path d="M16 6v11" stroke="#fff" stroke-width="2.8"/></svg>`,
  sleep: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" rx="4" fill="url(#g-gold)" stroke="#fff"/><path d="M20 7a10 10 0 100 18A9 9 0 0120 7z" fill="#fff"/></svg>`,
  restart: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" rx="4" fill="url(#g-green)" stroke="#fff"/><path d="M23 16a7 7 0 11-2.4-5.3" fill="none" stroke="#fff" stroke-width="2.8"/><path d="M24 6v7h-7z" fill="#fff"/></svg>`,
  speaker: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="#f0e8c0" stroke="#3a3a2a" stroke-width=".7"/><path d="M11 5.5a4 4 0 010 5M12.6 4a6 6 0 010 8" fill="none" stroke="#fff" stroke-width="1"/></svg>`,
  network: `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="2" width="8" height="6" fill="#bcd8f8" stroke="#123a78" stroke-width=".8"/><rect x="7" y="8" width="8" height="6" fill="#e0ecfc" stroke="#123a78" stroke-width=".8"/></svg>`,
};

/* Iconos PNG del sistema. Reemplazan a los SVG equivalentes. */
const xpIcon = (file) => `<img src="assets/xp/${file}" alt="" draggable="false" />`;
Object.assign(ICONS, {
  folder: xpIcon("icon__file_explorer--large.png"),
  folderSmall: xpIcon("icon__file_explorer.png"),
  folders: xpIcon("icon__folders.png"),
  mail: xpIcon("icon__mail--large.png"),
  github: xpIcon("icon__github--large.png"),
  recycle: xpIcon("icon__recycle_bin--large.png"),
  back: xpIcon("icon__back.png"),
  forward: xpIcon("icon__forward.png"),
  up: xpIcon("icon__up.png"),
  search: xpIcon("icon__search--large.png"),
  views: xpIcon("icon__views.png"),
  go: xpIcon("icon__go.png"),
  key: xpIcon("icon__log_out--large.png"),
  power: xpIcon("icon__shut_down--large.png"),
  restart: xpIcon("icon__restart--large.png"),
  user: xpIcon("icon__computer--large.png"),
  code: xpIcon("icon__notepad--large.png"),
  work: xpIcon("icon__documents--large.png"),
  globe: xpIcon("icon__globe.png"),
  network: xpIcon("icon__network_places.png"),
});
