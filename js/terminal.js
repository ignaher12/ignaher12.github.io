/* ============================================================
   MOTOR DE LA TERMINAL
   - "Filesystem" virtual: el root contiene una carpeta por proyecto.
   - cd <proyecto> entra; cd .. / cd ~ vuelve.
   - Comandos: help, ls, cd, cat, pwd, clear, whoami, about,
     skills, contact, open, neofetch, sudo, history.
   - Tab autocompleta, ↑/↓ navega el historial.
   ============================================================ */

(function () {
  "use strict";

  const { profile, projects } = PORTFOLIO;
  const projectsById = Object.fromEntries(projects.map((p) => [p.id, p]));

  // Estado
  let cwd = "~";              // "~" (root) o id de proyecto
  const history = [];
  let historyIdx = -1;

  // DOM
  const outputEl = document.getElementById("terminal-output");
  const formEl = document.getElementById("terminal-form");
  const inputEl = document.getElementById("terminal-input");
  const promptLabel = document.getElementById("prompt-label");
  const hintBar = document.getElementById("hint-bar");

  /* ---------------- Utilidades de salida ---------------- */
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  function promptHTML() {
    return `<span class="prompt"><span class="user">${esc(profile.handle)}</span>@portfolio:<span class="path">${esc(cwd)}</span>$</span>`;
  }

  function print(html) {
    const div = document.createElement("div");
    div.className = "line";
    div.innerHTML = html;
    outputEl.appendChild(div);
  }

  function printCommandEcho(raw) {
    print(`<span class="line cmd">${promptHTML()} ${esc(raw)}</span>`);
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function updatePrompt() {
    promptLabel.innerHTML = promptHTML();
  }

  /* ---------------- Link helper ---------------- */
  const link = (url, label) =>
    `<a class="link" href="${esc(url)}" target="_blank" rel="noopener">${esc(label || url)}</a>`;

  const tagsHTML = (tags) =>
    (tags || []).map((t) => `<span class="txt-purple">[${esc(t)}]</span>`).join(" ");

  // Muestra el detalle completo de un proyecto (se dispara al hacer cd).
  function printProjectDetail(p) {
    print(`<span class="txt-teal txt-bold"># ${esc(p.name)}</span>`);
    print(`<span class="txt-dim">status: ${esc(p.status)}</span>${p.tags && p.tags.length ? "  " + tagsHTML(p.tags) : ""}`);
    print("");
    p.readme.forEach((l) => print(esc(l) || "&nbsp;"));
    print("");
    print(`<span class="txt-dim">stack:</span> ${p.stack.map((s) => `<span class="txt-orange">${esc(s)}</span>`).join(" · ")}`);
    const ls = [];
    if (p.links && p.links.repo) ls.push(link(p.links.repo, "repo ↗"));
    if (p.links && p.links.demo) ls.push(link(p.links.demo, "demo ↗"));
    if (ls.length) print(`<span class="txt-dim">links:</span> ${ls.join("  ")}`);
  }

  /* ---------------- Comandos ---------------- */
  const commands = {
    help() {
      const rows = [
        ["help", "muestra esta ayuda"],
        ["ls", "lista los proyectos disponibles"],
        ["cd &lt;proyecto&gt;", "entra a un proyecto y muestra su detalle · cd .. para volver"],
        ["pwd", "muestra la ruta actual"],
        ["whoami", "sobre mí"],
        ["skills", "tecnologías que manejo"],
        ["contact", "cómo contactarme"],
        ["cv", "abre/descarga mi CV en PDF"],
        ["open &lt;repo|demo&gt;", "abre el link del proyecto actual"],
        ["neofetch", "info del sistema"],
        ["clear", "limpia la pantalla"],
      ];
      print('<span class="txt-dim">Comandos disponibles:</span>');
      rows.forEach(([cmd, desc]) => {
        const visibleLen = cmd.replace(/&[a-z]+;/g, "x").length;
        const pad = " ".repeat(Math.max(2, 22 - visibleLen));
        print(`  <span class="txt-yellow">${cmd}</span>${pad}<span class="txt-dim">${desc}</span>`);
      });
      print("");
      print('<span class="txt-dim">Tip: usá <span class="txt-teal">Tab</span> para autocompletar y <span class="txt-teal">↑/↓</span> para el historial.</span>');
    },

    ls() {
      if (cwd === "~") {
        print('<span class="txt-dim"># proyectos disponibles — usá: cd &lt;nombre&gt;</span>');
        projects.forEach((p) => {
          const tg = p.tags && p.tags.length ? " " + tagsHTML(p.tags) : "";
          print(
            `<span class="txt-accent txt-bold">${esc(p.id)}/</span>` +
              `${" ".repeat(Math.max(2, 18 - p.id.length))}` +
              `<span class="txt-dim">${esc(p.summary)}</span>${tg}`
          );
        });
      } else {
        // Dentro de un proyecto, `ls` vuelve a mostrar su detalle.
        printProjectDetail(projectsById[cwd]);
      }
    },

    cd(args) {
      const target = (args[0] || "~").replace(/\/$/, "");
      if (target === "~" || target === "/" || target === ".." || target === "") {
        cwd = "~";
        updatePrompt();
        return;
      }
      if (projectsById[target]) {
        cwd = target;
        updatePrompt();
        printProjectDetail(projectsById[target]);
        return;
      }
      print(`<span class="txt-red">cd: no existe el proyecto: ${esc(target)}</span>`);
      print('<span class="txt-dim">Usá <span class="txt-yellow">ls</span> para ver los proyectos disponibles.</span>');
    },

    pwd() {
      print(`/home/${esc(profile.handle)}/${cwd === "~" ? "" : esc(cwd)}`);
    },

    whoami() {
      print(`<span class="txt-teal txt-bold">${esc(profile.name)}</span> — <span class="txt-accent">${esc(profile.role)}</span>`);
      print("");
      profile.bio.forEach((l) => print(esc(l)));
    },

    about() { commands.whoami(); },

    skills() {
      Object.entries(profile.skills).forEach(([group, items]) => {
        print(`<span class="txt-accent txt-bold">${esc(group)}</span>`);
        print(`  ${items.map((i) => `<span class="txt-orange">${esc(i)}</span>`).join("  ")}`);
        print("");
      });
    },

    contact() {
      const c = profile.contact;
      if (c.email) print(`<span class="txt-dim">email   </span> ${link("mailto:" + c.email, c.email)}`);
      if (c.github) print(`<span class="txt-dim">github  </span> ${link(c.github, c.github)}`);
      if (c.linkedin) print(`<span class="txt-dim">linkedin</span> ${link(c.linkedin, c.linkedin)}`);
      if (c.twitter) print(`<span class="txt-dim">x       </span> ${link(c.twitter, c.twitter)}`);
      if (profile.cv) print(`<span class="txt-dim">cv      </span> ${link(profile.cv, "descargar CV ↗")}`);
    },

    cv() {
      if (!profile.cv) {
        print('<span class="txt-red">cv: no hay un CV configurado</span>');
        return;
      }
      print(`<span class="txt-dim">abriendo CV… </span>${link(profile.cv, "ver / descargar CV ↗")}`);
      window.open(profile.cv, "_blank", "noopener");
    },

    open(args) {
      if (cwd === "~") {
        print('<span class="txt-red">open: entrá a un proyecto primero (cd &lt;proyecto&gt;)</span>');
        return;
      }
      const p = projectsById[cwd];
      const which = args[0] || "repo";
      const url = p.links && p.links[which];
      if (url) {
        print(`<span class="txt-dim">abriendo ${esc(which)}… </span>${link(url, url)}`);
        window.open(url, "_blank", "noopener");
      } else {
        print(`<span class="txt-red">open: este proyecto no tiene link "${esc(which)}"</span>`);
      }
    },

    neofetch() {
      const art = [
        "        _____        ",
        "       /     \\       ",
        "      | () () |      ",
        "       \\  ^  /       ",
        "        |||||        ",
        "        |||||        ",
      ];
      const info = [
        `<span class="txt-teal txt-bold">${esc(profile.handle)}</span>@<span class="txt-teal txt-bold">portfolio</span>`,
        `<span class="txt-dim">-----------------</span>`,
        `<span class="txt-yellow">Rol:</span>      ${esc(profile.role)}`,
        `<span class="txt-yellow">Ubicación:</span> ${esc(profile.location || "—")}`,
        `<span class="txt-yellow">Proyectos:</span> ${projects.length}`,
        `<span class="txt-yellow">Shell:</span>    portfolio-sh 1.0`,
        `<span class="txt-yellow">Email:</span>    ${esc(profile.contact.email || "—")}`,
      ];
      const lines = Math.max(art.length, info.length);
      for (let i = 0; i < lines; i++) {
        const a = (art[i] || "").padEnd(22);
        print(`<span class="banner">${esc(a)}</span>${info[i] || ""}`);
      }
    },

    sudo() {
      print('<span class="txt-red">[sudo] password para ' + esc(profile.handle) + ': </span>');
      print('<span class="txt-dim">Nice try 😏 — no vas a conseguir root acá. Probá <span class="txt-yellow">help</span>.</span>');
    },

    history() {
      if (!history.length) { print('<span class="txt-dim">(sin historial)</span>'); return; }
      history.forEach((h, i) => print(`  <span class="txt-dim">${String(i + 1).padStart(3)}</span>  ${esc(h)}`));
    },

    clear() {
      outputEl.innerHTML = "";
    },
  };

  // Aliases
  commands.cls = commands.clear;
  commands.dir = commands.ls;
  commands.resume = commands.cv;

  /* ---------------- Ejecutor ---------------- */
  function run(raw) {
    const trimmed = raw.trim();
    printCommandEcho(raw);
    if (!trimmed) return;

    history.push(trimmed);
    historyIdx = history.length;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (commands[cmd]) {
      try {
        commands[cmd](args);
      } catch (e) {
        print(`<span class="txt-red">error interno: ${esc(e.message)}</span>`);
      }
    } else {
      print(`<span class="txt-red">comando no encontrado: ${esc(cmd)}</span> <span class="txt-dim">— probá <span class="txt-yellow">help</span></span>`);
    }
  }

  /* ---------------- Autocompletado (Tab) ---------------- */
  function autocomplete() {
    const val = inputEl.value;
    const parts = val.split(/\s+/);
    let pool, prefix, head;

    if (parts.length <= 1) {
      pool = Object.keys(commands);
      prefix = parts[0] || "";
      head = "";
    } else {
      // autocompletar nombre de proyecto para cd/cat/open
      const cmd = parts[0].toLowerCase();
      head = parts.slice(0, -1).join(" ") + " ";
      prefix = parts[parts.length - 1];
      if (cmd === "cd") pool = [...projects.map((p) => p.id), "..", "~"];
      else if (cmd === "open") pool = ["repo", "demo"];
      else pool = [];
    }

    const matches = pool.filter((c) => c.startsWith(prefix));
    if (matches.length === 1) {
      inputEl.value = head + matches[0] + " ";
    } else if (matches.length > 1) {
      printCommandEcho(val);
      print(`<span class="txt-dim">${matches.map(esc).join("   ")}</span>`);
      // completar el prefijo común
      const common = longestCommonPrefix(matches);
      if (common.length > prefix.length) inputEl.value = head + common;
      scrollToBottom();
    }
  }

  function longestCommonPrefix(arr) {
    if (!arr.length) return "";
    let p = arr[0];
    for (const s of arr) {
      while (!s.startsWith(p)) p = p.slice(0, -1);
    }
    return p;
  }

  /* ---------------- Eventos ---------------- */
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = inputEl.value;
    inputEl.value = "";
    run(raw);
    scrollToBottom();
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      autocomplete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        inputEl.value = history[historyIdx];
        moveCaretToEnd();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        historyIdx++;
        inputEl.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        inputEl.value = "";
      }
      moveCaretToEnd();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      commands.clear();
    }
  });

  function moveCaretToEnd() {
    requestAnimationFrame(() => {
      const v = inputEl.value;
      inputEl.value = "";
      inputEl.value = v;
    });
  }

  // Mantener el foco en el input al clickear la terminal
  document.getElementById("terminal-view").addEventListener("click", () => {
    if (window.getSelection().toString() === "") inputEl.focus();
  });

  /* ---------------- Hint chips ---------------- */
  const HINTS = ["help", "ls", "cd karta", "skills", "contact", "cv"];
  HINTS.forEach((h) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "hint-chip";
    chip.innerHTML = `<code>${esc(h)}</code>`;
    chip.addEventListener("click", () => {
      inputEl.value = h;
      inputEl.focus();
      formEl.requestSubmit();
    });
    hintBar.appendChild(chip);
  });

  /* ---------------- Toggle terminal / clásico ---------------- */
  const toggleBtn = document.getElementById("view-toggle");
  const terminalView = document.getElementById("terminal-view");
  const classicView = document.getElementById("classic-view");
  let classic = false;
  renderClassicView();
  toggleBtn.addEventListener("click", () => {
    classic = !classic;
    terminalView.classList.toggle("hidden", classic);
    classicView.classList.toggle("hidden", !classic);
    toggleBtn.textContent = classic ? "Ver modo terminal" : "Ver modo clásico";
    toggleBtn.setAttribute("aria-pressed", String(classic));
    if (!classic) inputEl.focus();
  });

  /* ---------------- Banner inicial ---------------- */
  function boot() {
         
  print(`<span class="banner txt-bold">      ▀▄   ▄▀
     ▄█▀███▀█▄
    █▀███████▀█  ${esc(profile.name)} · dev portfolio${" ".repeat(Math.max(0, 21 - profile.name.length))}
    ▀ ▀▄▄ ▄▄▀ ▀</span>`);
    print("");
    print("\n");

    print(`<span class="txt-accent">${esc(profile.role)}</span>`);
    print(`<span class="txt-dim">Bienvenido. Escribí <span class="txt-yellow">help</span> para empezar.</span>`);
    print(`<span class="txt-dim">¿Sos de los que prefieren la versión GUI? Tocá <span class="txt-teal">"Ver modo clásico"</span> arriba a la derecha.</span>`);
    print("");

    updatePrompt();
    inputEl.focus();
  }

  boot();
})();
