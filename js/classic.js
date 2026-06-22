/* ============================================================
   VISTA CLÁSICA
   Cards compactas (resumen) que, al clickearlas, abren un modal
   con la información completa del proyecto (readme, stack, links).
   Usa los mismos datos de data.js.
   ============================================================ */

function renderClassicView() {
  const { profile, projects } = PORTFOLIO;
  const el = (s) => (s || "");
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const projectsById = Object.fromEntries(projects.map((p) => [p.id, p]));

  // Bio: junto las líneas en párrafos que fluyen a todo el ancho.
  // Un string vacío en el array separa párrafos.
  const bioParas = [];
  let buf = [];
  profile.bio.forEach((l) => {
    if (l === "") { if (buf.length) { bioParas.push(buf.join(" ")); buf = []; } }
    else buf.push(l);
  });
  if (buf.length) bioParas.push(buf.join(" "));
  const bioHtml = bioParas.map((para) => `<p class="bio">${esc(para)}</p>`).join("");

  /* ---------- Cards compactas (bento) ---------- */
  const projectCards = projects
    .map((p) => {
      const stack = p.stack.map((t) => `<span class="tag">${esc(t)}</span>`).join("");
      const catTags = (p.tags || [])
        .map((t) => `<span class="cat-tag">${esc(t)}</span>`)
        .join("");
      const featured = (p.tags || []).includes("★") ? " featured" : "";
      return `
        <article class="project-card${featured}" data-id="${esc(p.id)}" tabindex="0" role="button"
                 aria-label="Ver detalle de ${esc(p.name)}">
          <div class="card-head">
            <h3>${esc(p.name)}</h3>
            <div class="cat-tag-row">${catTags}</div>
          </div>
          <div class="status">● ${esc(p.status)}</div>
          <p>${esc(p.summary)}</p>
          <div class="tag-row">${stack}</div>
          <div class="card-more">Ver detalle →</div>
        </article>`;
    })
    .join("");

  const skillGroups = Object.entries(profile.skills)
    .map(
      ([group, items]) => `
        <div class="skill-group">
          <h4>${esc(group)}</h4>
          <ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
        </div>`
    )
    .join("");

  const contact = [];
  if (profile.contact.email) contact.push(`<a href="mailto:${profile.contact.email}">${profile.contact.email}</a>`);
  if (profile.contact.twitter) contact.push(`<a href="${profile.contact.twitter}" target="_blank" rel="noopener">Twitter</a>`);
  if (profile.contact.github) contact.push(`<a href="${profile.contact.github}" target="_blank" rel="noopener">GitHub</a>`);
  if (profile.contact.linkedin) contact.push(`<a href="${profile.contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`);
  if (profile.cv) contact.push(`<a href="${profile.cv}" target="_blank" rel="noopener">CV ↗</a>`);

  document.getElementById("classic-content").innerHTML = `
    <h1>${el(profile.name)}</h1>
    <p class="subtitle">${el(profile.role)}${profile.location ? " · " + profile.location : ""}</p>
    ${bioHtml}

    <h2>Proyectos</h2>
    <div class="project-grid">${projectCards}</div>

    <h2>Skills</h2>
    <div class="skill-cols">${skillGroups}</div>

    <h2>Contacto</h2>
    <div class="contact-links">${contact.join("")}</div>
  `;

  /* ---------- Modal de detalle ---------- */
  const modal = ensureModal();

  function openModal(p) {
    const stack = p.stack.map((t) => `<span class="tag">${esc(t)}</span>`).join("");
    const catTags = (p.tags || []).map((t) => `<span class="cat-tag">${esc(t)}</span>`).join("");
    const readme = (p.readme || []).map((l) => esc(l)).join("\n");
    const links = [];
    if (p.links && p.links.repo)
      links.push(`<a href="${p.links.repo}" target="_blank" rel="noopener">repo ↗</a>`);
    if (p.links && p.links.demo)
      links.push(`<a href="${p.links.demo}" target="_blank" rel="noopener">demo ↗</a>`);

    modal.querySelector(".modal-body").innerHTML = `
      <div class="card-head">
        <h3>${esc(p.name)}</h3>
        <div class="cat-tag-row">${catTags}</div>
      </div>
      <div class="status">● ${esc(p.status)}</div>
      <pre class="readme">${readme}</pre>
      <div class="tag-label">Stack</div>
      <div class="tag-row">${stack}</div>
      ${links.length ? `<div class="card-links">${links.join("")}</div>` : ""}
    `;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Listeners de las cards
  document.querySelectorAll(".project-card").forEach((card) => {
    const p = projectsById[card.dataset.id];
    card.addEventListener("click", () => openModal(p));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(p);
      }
    });
  });

  // Cierre del modal
  modal.querySelector(".modal-close").onclick = closeModal;
  modal.querySelector(".modal-backdrop").onclick = closeModal;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

/* Crea el contenedor del modal una sola vez y lo reutiliza. */
function ensureModal() {
  let modal = document.getElementById("project-modal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "project-modal";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-dialog" role="dialog" aria-modal="true">
      <button class="modal-close" type="button" aria-label="Cerrar">✕</button>
      <div class="modal-body"></div>
    </div>`;
  document.body.appendChild(modal);
  return modal;
}
