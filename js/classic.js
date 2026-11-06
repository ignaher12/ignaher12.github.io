/* ============================================================
   VERSIÓN GRÁFICA
   Explorador de archivos: la carpeta raíz lista el perfil y los
   proyectos; cada proyecto se abre como una subcarpeta con su
   detalle. Atrás, Adelante y Arriba navegan por ese historial.
   Usa los mismos datos de data.js.
   ============================================================ */

function renderClassicView() {
  const { profile, projects } = PORTFOLIO;
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const ROOT = "C:\\Usuarios\\Ignacio\\Mi Portfolio";
  const projectsById = Object.fromEntries(projects.map((p) => [p.id, p]));
  const content = $("classic-content");
  const scroller = $("classic-view");

  // Una entrada por carpeta visitada; null es la raíz.
  let trail = [null];
  let position = 0;

  // Bio: junto las líneas en párrafos. Un string vacío separa párrafos.
  function bioHtml() {
    const paragraphs = [];
    let buffer = [];
    profile.bio.forEach((line) => {
      if (line === "") {
        if (buffer.length) paragraphs.push(buffer.join(" "));
        buffer = [];
      } else {
        buffer.push(line);
      }
    });
    if (buffer.length) paragraphs.push(buffer.join(" "));
    return paragraphs.map((p) => `<p class="bio">${esc(p)}</p>`).join("");
  }

  const tagsHtml = (p) =>
    (p.tags || []).map((t) => `<span class="cat-tag">${esc(t)}</span>`).join("");

  const section = (title, body) =>
    `<section class="file-section"><h2>${esc(title)}</h2>${body}</section>`;

  function projectTile(p) {
    return `
      <button type="button" class="file-tile" data-id="${esc(p.id)}">
        <span class="file-icon">${ICONS.folder}</span>
        <span class="file-text">
          <strong>${esc(p.name)}</strong>
          <small>${esc(p.summary)}</small>
        </span>
      </button>`;
  }

  function rootView() {
    const featured = projects.filter((p) => (p.tags || []).includes("★"));
    const others = projects.filter((p) => !(p.tags || []).includes("★"));

    const skills = Object.entries(profile.skills)
      .map(
        ([group, items]) => `
          <div class="skill-group">
            <h4>${esc(group)}</h4>
            <ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
          </div>`
      )
      .join("");

    return `
      <header class="folder-head">
        <h1>${esc(profile.name)}</h1>
        <p class="subtitle">${esc(profile.role)}${profile.location ? " · " + esc(profile.location) : ""}</p>
      </header>
      ${section("Sobre mí", bioHtml())}
      ${section("Proyectos destacados", `<div class="file-grid">${featured.map(projectTile).join("")}</div>`)}
      ${section("Otros proyectos", `<div class="file-grid">${others.map(projectTile).join("")}</div>`)}
      ${section("Skills", `<div class="skill-cols">${skills}</div>`)}`;
  }

  function projectView(p) {
    const links = [];
    if (p.links && p.links.repo) links.push(`<a href="${esc(p.links.repo)}" target="_blank" rel="noopener">Ver repositorio</a>`);
    if (p.links && p.links.demo) links.push(`<a href="${esc(p.links.demo)}" target="_blank" rel="noopener">Ver demo</a>`);

    return `
      <header class="folder-head project-head">
        <span class="project-icon">${ICONS.folder}</span>
        <div>
          <h1>${esc(p.name)}</h1>
          <p class="subtitle">${esc(p.status)}</p>
          <div class="cat-tag-row">${tagsHtml(p)}</div>
        </div>
      </header>
      ${section("Léame", `<pre class="readme">${(p.readme || []).map(esc).join("\n")}</pre>`)}
      ${section("Tecnologías", `<div class="tag-row">${p.stack.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>`)}
      ${links.length ? section("Vínculos", `<div class="card-links">${links.join("")}</div>`) : ""}`;
  }

  function show() {
    const project = projectsById[trail[position]];
    content.innerHTML = project ? projectView(project) : rootView();
    scroller.scrollTop = 0;
    $("address-path").textContent = project ? `${ROOT}\\${project.name}` : ROOT;
    $("explorer-status").textContent = project
      ? `${project.stack.length} tecnologías`
      : `${projects.length} objetos`;
    $("nav-back").disabled = position === 0;
    $("nav-forward").disabled = position === trail.length - 1;
    $("nav-up").disabled = !project;
  }

  function go(id) {
    if (trail[position] === id) return;
    trail = trail.slice(0, position + 1).concat(id);
    position += 1;
    show();
  }

  function step(delta) {
    position += delta;
    show();
  }

  content.addEventListener("click", (e) => {
    const tile = e.target.closest(".file-tile");
    if (tile) go(tile.dataset.id);
  });
  $("nav-back").addEventListener("click", () => step(-1));
  $("nav-forward").addEventListener("click", () => step(1));
  $("nav-up").addEventListener("click", () => go(null));

  // Permite abrir un proyecto desde el menú Inicio.
  window.openProjectDetail = (id) => {
    window.XP.open("portfolio");
    go(id);
  };
  // Vuelve a la raíz, por ejemplo al abrir la ventana desde el escritorio.
  window.showPortfolioRoot = () => go(null);

  show();
}
