/* ============================================================
   ESCRITORIO RETRO
   Gestor de ventanas, iconos, menú Inicio y barra de tareas.
   El contenido sale de data.js; la terminal y la versión gráfica
   siguen viviendo en terminal.js y classic.js.
   API pública: window.XP.open(id) / window.XP.close(id)
   ============================================================ */

(function () {
  "use strict";

  const { profile, projects } = PORTFOLIO;
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const isMobile = () => window.matchMedia("(max-width: 700px)").matches;
  const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

  /* ---------------- Programas ---------------- */
  const newTab = (url) => window.open(url, "_blank", "noopener");
  const c = profile.contact;

  function openPortfolio() {
    open("portfolio");
    window.showPortfolioRoot();
  }

  // Cada entrada se reutiliza en el escritorio, el menú Inicio y el panel lateral.
  const APPS = [
    { id: "terminal", label: "Símbolo del sistema", short: "Terminal", detail: "Navegá por comandos", icon: "terminal", pinned: true, run: () => open("terminal"), desktop: true },
    { id: "portfolio", label: "Mi Portfolio", detail: "Versión gráfica", icon: "folder", pinned: true, run: openPortfolio, desktop: true },
    profile.cv && { id: "cv", label: "Mi CV", icon: "cv", run: () => newTab(profile.cv), desktop: true },
    c.github && { id: "github", label: "GitHub", icon: "github", run: () => newTab(c.github), desktop: true },
    c.linkedin && { id: "linkedin", label: "LinkedIn", icon: "linkedin", run: () => newTab(c.linkedin), desktop: true },
    c.twitter && { id: "x", label: "X", icon: "x", run: () => newTab(c.twitter) },
    c.email && { id: "mail", label: "Correo electrónico", short: "E-mail", icon: "mail", run: () => { location.href = "mailto:" + c.email; } },
  ].filter(Boolean);
  const appById = Object.fromEntries(APPS.map((a) => [a.id, a]));

  /* ---------------- Ventanas ---------------- */
  const desktop = $("desktop");
  let topZ = 10;

  const windows = {
    terminal: { el: $("win-terminal"), title: "C:\\WINDOWS\\system32\\cmd.exe", short: "C:\\WINDOWS\\system32\\cmd.exe", icon: "terminal" },
    portfolio: { el: $("win-portfolio"), title: "Mi Portfolio", short: "Mi Portfolio", icon: "folderSmall" },
  };

  function buildChrome(id, win) {
    const bar = document.createElement("header");
    bar.className = "xp-titlebar";
    bar.innerHTML = `
      <span class="xp-title-icon">${ICONS[win.icon]}</span>
      <span class="xp-title">${esc(win.title)}</span>
      <span class="xp-controls">
        <button type="button" class="xp-btn xp-min" aria-label="Minimizar"></button>
        <button type="button" class="xp-btn xp-max" aria-label="Maximizar"></button>
        <button type="button" class="xp-btn xp-close" aria-label="Cerrar"></button>
      </span>`;
    win.el.prepend(bar);
    win.el.addEventListener("pointerdown", () => focusWin(id));
    bar.querySelector(".xp-min").onclick = () => minimize(id);
    bar.querySelector(".xp-max").onclick = () => toggleMax(id);
    bar.querySelector(".xp-close").onclick = () => close(id);
    bar.addEventListener("dblclick", (e) => {
      if (!e.target.closest(".xp-controls")) toggleMax(id);
    });
    enableDrag(win, bar);

    win.taskBtn = document.createElement("button");
    win.taskBtn.type = "button";
    win.taskBtn.className = "task-button";
    win.taskBtn.innerHTML = `<span class="task-icon">${ICONS[win.icon]}</span><span class="task-label">${esc(win.short)}</span>`;
    win.taskBtn.onclick = () => {
      if (win.el.classList.contains("active") && !win.minimized) minimize(id);
      else open(id);
    };
  }

  function enableDrag(win, bar) {
    let start = null;
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".xp-controls") || win.el.classList.contains("maximized")) return;
      start = { x: e.clientX, y: e.clientY, left: win.el.offsetLeft, top: win.el.offsetTop };
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener("pointermove", (e) => {
      if (!start) return;
      place(win.el, start.left + e.clientX - start.x, start.top + e.clientY - start.y);
    });
    const stop = () => { start = null; };
    bar.addEventListener("pointerup", stop);
    bar.addEventListener("pointercancel", stop);
  }

  // Mantiene la barra de título siempre alcanzable.
  function place(el, left, top) {
    const maxLeft = desktop.clientWidth - 80;
    const minLeft = 80 - el.offsetWidth;
    el.style.left = Math.min(maxLeft, Math.max(minLeft, left)) + "px";
    el.style.top = Math.min(desktop.clientHeight - 30, Math.max(0, top)) + "px";
  }

  function setBounds(el, left, top, width, height) {
    el.style.width = width + "px";
    el.style.height = height + "px";
    el.style.left = left + "px";
    el.style.top = top + "px";
  }

  function initialLayout() {
    const W = desktop.clientWidth;
    const H = desktop.clientHeight;
    const tw = Math.max(480, Math.min(740, W - 430));
    const th = Math.min(500, H - 70);
    setBounds(windows.terminal.el, Math.max(0, W - tw - 40), Math.max(0, Math.round((H - th) / 3)), tw, th);

    const pw = Math.min(860, W - 130);
    const ph = Math.min(600, H - 50);
    setBounds(windows.portfolio.el, Math.max(0, Math.round((W - pw) / 2)), Math.max(0, Math.round((H - ph) / 4)), pw, ph);

    Object.values(windows).forEach((w) => w.el.classList.toggle("maximized", isMobile()));
  }

  function focusWin(id) {
    Object.entries(windows).forEach(([key, w]) => {
      const active = key === id;
      w.el.classList.toggle("active", active);
      w.taskBtn.classList.toggle("active", active);
    });
    windows[id].el.style.zIndex = ++topZ;
    if (id === "terminal" && window.getSelection().toString() === "") $("terminal-input").focus();
  }

  function open(id) {
    const win = windows[id];
    win.el.classList.remove("hidden");
    win.minimized = false;
    if (!win.taskBtn.isConnected) $("taskbar-windows").appendChild(win.taskBtn);
    closeStart();
    focusWin(id);
  }

  // Le pasa el foco a la ventana visible que esté más arriba.
  function focusNext() {
    const next = Object.entries(windows)
      .filter(([, w]) => !w.el.classList.contains("hidden"))
      .sort(([, a], [, b]) => Number(b.el.style.zIndex) - Number(a.el.style.zIndex))[0];
    if (next) focusWin(next[0]);
  }

  function hide(id) {
    const win = windows[id];
    win.el.classList.add("hidden");
    win.el.classList.remove("active");
    win.taskBtn.classList.remove("active");
    focusNext();
  }

  function minimize(id) {
    windows[id].minimized = true;
    hide(id);
  }

  function close(id) {
    windows[id].minimized = false;
    windows[id].taskBtn.remove();
    hide(id);
  }

  function toggleMax(id) {
    if (isMobile()) return;
    const maximized = windows[id].el.classList.toggle("maximized");
    windows[id].el.querySelector(".xp-max").setAttribute("aria-label", maximized ? "Restaurar" : "Maximizar");
  }

  /* ---------------- Iconos del escritorio ---------------- */
  function clearSelection() {
    document.querySelectorAll(".desktop-icon.selected").forEach((i) => i.classList.remove("selected"));
  }

  // Como en el original: un click selecciona y doble click abre.
  // En pantallas táctiles y con teclado (detail 0) abre directamente.
  function wireIcon(btn, label, icon, run) {
    btn.innerHTML = `<span class="desktop-icon-img">${ICONS[icon]}</span><span class="desktop-icon-label">${esc(label)}</span>`;
    btn.addEventListener("click", (e) => {
      clearSelection();
      btn.classList.add("selected");
      if (e.detail === 0 || isTouch()) run();
    });
    btn.addEventListener("dblclick", run);
  }

  function renderDesktopIcons() {
    APPS.filter((a) => a.desktop).forEach((app) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "desktop-icon";
      wireIcon(btn, app.short || app.label, app.icon, app.run);
      $("desktop-icons").appendChild(btn);
    });
    wireIcon($("recycle-bin"), "Papelera de reciclaje", "recycle", () => {
      window.playSound("recycle");
      msgbox("Papelera de reciclaje", "La Papelera de reciclaje está vacía.");
    });
    desktop.addEventListener("pointerdown", (e) => {
      if (!e.target.closest(".desktop-icon")) clearSelection();
    });
  }

  /* ---------------- Cuadro de mensaje ---------------- */
  function msgbox(title, text) {
    $("msgbox-title").textContent = title;
    $("msgbox-text").textContent = text;
    $("msgbox").classList.remove("hidden");
    $("msgbox-ok").focus();
  }

  function closeMsgbox() {
    if ($("msgbox").classList.contains("hidden")) return;
    $("msgbox").classList.add("hidden");
    focusNext();
  }

  /* ---------------- Explorador: barra y panel ---------------- */
  function renderExplorerChrome() {
    const tool = (id, icon, label, name) => {
      const btn = $(id);
      btn.innerHTML = `<span class="tool-icon">${ICONS[icon]}</span>${label ? `<span>${esc(label)}</span>` : ""}`;
      btn.setAttribute("aria-label", name || label);
    };
    tool("nav-back", "back", "Atrás");
    tool("nav-forward", "forward", "", "Adelante");
    tool("nav-up", "up", "", "Subir un nivel");
    tool("nav-search", "search", "Búsqueda");
    tool("nav-folders", "folders", "Carpetas");
    tool("nav-views", "views", "", "Vistas");
    $("nav-folders").addEventListener("click", () => {
      $("nav-folders").classList.toggle("pressed", !$("explorer-pane").classList.toggle("hidden"));
    });
    $("nav-folders").classList.add("pressed");
    $("address-icon").innerHTML = ICONS.folderSmall;
    $("address-go").innerHTML = `<span class="tool-icon">${ICONS.go}</span>Ir`;

    const row = (id) => {
      const a = appById[id];
      return a ? `<button type="button" class="pane-link" data-app="${a.id}"><span class="pane-icon">${ICONS[a.icon]}</span>${esc(a.short || a.label)}</button>` : "";
    };
    const box = (title, body) => `
      <div class="pane-box">
        <button type="button" class="pane-head" aria-expanded="true"><span>${esc(title)}</span><span class="pane-chevron" aria-hidden="true"></span></button>
        <div class="pane-body">${body}</div>
      </div>`;

    $("explorer-pane").innerHTML =
      box("Tareas", row("terminal") + row("cv")) +
      box("Contacto", row("mail") + row("github") + row("linkedin") + row("x")) +
      box("Detalles", `<p><strong>${esc(profile.name)}</strong><br />Carpeta del sistema<br />${esc(profile.location)}</p>`);

    $("explorer-pane").addEventListener("click", (e) => {
      const link = e.target.closest("[data-app]");
      const head = e.target.closest(".pane-head");
      if (link) appById[link.dataset.app].run();
      if (head) {
        const collapsed = head.parentElement.classList.toggle("collapsed");
        head.setAttribute("aria-expanded", String(!collapsed));
      }
    });
  }

  /* ---------------- Menú Inicio ---------------- */
  const startMenu = $("start-menu");
  const startBtn = $("start-button");

  function renderStartMenu() {
    const [title, ...specialty] = profile.role.split(" · ");

    const program = (a) => `
      <button type="button" class="sm-item${a.pinned ? " pinned" : ""}" role="menuitem" data-app="${a.id}">
        <span class="sm-icon">${ICONS[a.icon]}</span>
        <span class="sm-text"><strong>${esc(a.label)}</strong>${a.detail ? `<small>${esc(a.detail)}</small>` : ""}</span>
      </button>`;

    const fact = (icon, value, label) =>
      value ? `<div class="sm-fact"><span class="sm-fact-icon">${ICONS[icon]}</span><span><strong>${esc(value)}</strong><small>${esc(label)}</small></span></div>` : "";

    startMenu.innerHTML = `
      <header class="sm-header">
        <span class="sm-avatar" aria-hidden="true"><img src="assets/xp/avatar__skateboard.png" alt="" /></span>
        <span class="sm-name">${esc(profile.name)}</span>
      </header>
      <div class="sm-rule" aria-hidden="true"></div>
      <div class="sm-body">
        <div class="sm-left">
          <div class="sm-programs">
            ${APPS.filter((a) => a.pinned).map(program).join("")}
            <hr />
            ${APPS.filter((a) => !a.pinned).map(program).join("")}
          </div>
          <hr />
          <button type="button" id="sm-all" class="sm-all" aria-haspopup="menu" aria-expanded="false">
            <strong>Todos los proyectos</strong><span class="sm-all-arrow" aria-hidden="true"></span>
          </button>
        </div>
        <div class="sm-right">
          ${fact("user", title, "Título")}
          ${fact("code", specialty.join(" · "), "Especialidad")}
          ${fact("work", profile.current, "Actualmente")}
          ${fact("globe", profile.location, "Ubicación")}
        </div>
      </div>
      <footer class="sm-footer">
        <button type="button" class="sm-power" role="menuitem" data-power="logoff"><span class="power-icon">${ICONS.key}</span>Cerrar sesión</button>
        <button type="button" class="sm-power" role="menuitem" data-power="off"><span class="power-icon">${ICONS.power}</span>Apagar equipo</button>
      </footer>
      <div id="sm-flyout" class="sm-flyout hidden" role="menu" aria-label="Todos los proyectos">
        ${projects.map((p) => `<button type="button" class="sm-fly-item" role="menuitem" data-project="${esc(p.id)}"><span class="pane-icon">${ICONS.folderSmall}</span>${esc(p.name)}</button>`).join("")}
      </div>`;

    const all = $("sm-all");
    all.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") setFlyout(true);
    });
    startMenu.addEventListener("pointerover", (e) => {
      if (e.pointerType === "mouse" && !e.target.closest("#sm-all, #sm-flyout")) setFlyout(false);
    });

    startMenu.addEventListener("click", (e) => {
      const app = e.target.closest("[data-app]");
      const project = e.target.closest("[data-project]");
      const power = e.target.closest("[data-power]");
      if (e.target.closest("#sm-all")) {
        setFlyout(true);
      } else if (app) {
        closeStart();
        appById[app.dataset.app].run();
      } else if (project) {
        closeStart();
        window.openProjectDetail(project.dataset.project);
      } else if (power) {
        closeStart();
        if (power.dataset.power === "logoff") restart();
        else setPowerDialog(true);
      }
    });
  }

  /* ---------------- Diálogo de apagado ---------------- */
  function restart() {
    sessionStorage.removeItem("booted");
    location.reload();
  }

  function setPowerDialog(show) {
    $("power-dialog").classList.toggle("hidden", !show);
    document.body.classList.toggle("powering", show);
    if (show) $("power-cancel").focus();
    else focusNext();
  }

  function renderPowerDialog() {
    const option = (id, icon, label) =>
      `<button type="button" class="power-option" data-power-action="${id}"><span class="power-glyph">${ICONS[icon]}</span>${esc(label)}</button>`;
    $("power-options").innerHTML =
      option("sleep", "sleep", "Suspender") + option("off", "power", "Apagar") + option("restart", "restart", "Reiniciar");

    $("power-options").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-power-action]");
      if (!btn) return;
      const action = btn.dataset.powerAction;
      if (action === "restart") return restart();
      setPowerDialog(false);
      if (action === "off") window.playSound("shutdown");
      $("shutdown").classList.toggle("sleeping", action === "sleep");
      $("shutdown").classList.remove("hidden");
    });
    $("power-cancel").addEventListener("click", () => setPowerDialog(false));
  }

  function setFlyout(show) {
    $("sm-flyout").classList.toggle("hidden", !show);
    $("sm-all").classList.toggle("open", show);
    $("sm-all").setAttribute("aria-expanded", String(show));
  }

  function setStart(show) {
    startMenu.classList.toggle("hidden", !show);
    startBtn.classList.toggle("pressed", show);
    startBtn.setAttribute("aria-expanded", String(show));
    if (!show) setFlyout(false);
  }
  function closeStart() {
    setStart(false);
  }

  startBtn.setAttribute("aria-label", "Inicio");
  startBtn.addEventListener("click", () => setStart(startMenu.classList.contains("hidden")));
  document.addEventListener("pointerdown", (e) => {
    if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) closeStart();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeStart();
      closeMsgbox();
      if (!$("power-dialog").classList.contains("hidden")) setPowerDialog(false);
    }
  });

  $("msgbox-ok").addEventListener("click", closeMsgbox);
  $("msgbox-x").addEventListener("click", closeMsgbox);
  $("shutdown").addEventListener("click", () => {
    $("shutdown").classList.add("hidden");
    focusNext();
  });

  /* ---------------- Área de notificación ---------------- */
  function tick() {
    const now = new Date();
    const clock = $("clock");
    clock.textContent = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
    clock.dateTime = now.toISOString();
  }

  function showBalloon() {
    const balloon = $("balloon");
    balloon.innerHTML = `
      <button type="button" class="balloon-close" aria-label="Cerrar"></button>
      <strong>Bienvenido al portfolio</strong>
      <p>Hacé doble click en <b>Mi Portfolio</b> para ver la versión gráfica, o escribí <b>help</b> en la terminal.</p>`;
    balloon.classList.remove("hidden");
    balloon.addEventListener("click", () => balloon.classList.add("hidden"));
    setTimeout(() => balloon.classList.add("hidden"), 12000);
  }

  /* ---------------- Pantalla de carga ---------------- */
  // BIOS, inicio de sesión y escritorio. El click en el usuario es además
  // el gesto que le permite al navegador reproducir el sonido de inicio.
  function runBoot(done) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sessionStorage.getItem("booted") || reduced) return done();

    const boot = $("boot");
    const login = $("login");
    $("login-name").textContent = profile.name;
    boot.classList.remove("hidden");

    let atLogin = false;
    const showLogin = () => {
      if (atLogin) return;
      atLogin = true;
      $("bios").classList.add("hidden");
      login.classList.remove("hidden");
      $("login-user").focus();
    };
    $("bios").addEventListener("pointerdown", showLogin);
    setTimeout(showLogin, 2600);

    $("login-user").addEventListener("click", () => {
      if (login.classList.contains("logging-in")) return;
      login.classList.add("logging-in");
      window.playSound("startup");
      sessionStorage.setItem("booted", "1");
      setTimeout(() => {
        boot.classList.add("hidden");
        done();
      }, 1100);
    });

    $("login-off").addEventListener("click", () => {
      window.playSound("shutdown");
      $("shutdown").classList.remove("sleeping");
      $("shutdown").classList.remove("hidden");
    });
  }

  /* ---------------- Arranque ---------------- */
  Object.entries(windows).forEach(([id, win]) => buildChrome(id, win));
  renderDesktopIcons();
  renderExplorerChrome();
  renderStartMenu();
  renderPowerDialog();
  $("tray-icons").innerHTML = ICONS.speaker + ICONS.network;
  initialLayout();
  tick();
  setInterval(tick, 10000);

  window.addEventListener("resize", () => {
    Object.values(windows).forEach((w) => {
      if (isMobile()) w.el.classList.add("maximized");
      if (!w.el.classList.contains("hidden") && !w.el.classList.contains("maximized")) {
        place(w.el, w.el.offsetLeft, w.el.offsetTop);
      }
    });
  });

  window.XP = { open, close };
  open("terminal");

  runBoot(() => {
    focusNext();
    // En pantallas grandes arranca con el menú abierto: muestra quién sos de entrada.
    if (!isMobile()) {
      setStart(true);
      setTimeout(showBalloon, 700);
    }
  });
})();
