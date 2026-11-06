/* ============================================================
   SONIDOS
   Adaptado de react-xp (Jamie Pates) a JavaScript sin dependencias.
   Usa Web Audio: decodifica cada clip una sola vez y se desbloquea
   con el primer gesto del usuario, que es lo que exige el navegador.
   Si algo falla, el sitio sigue funcionando en silencio.
   API pública: window.playSound("startup" | "shutdown" | "recycle")
   ============================================================ */

(function () {
  "use strict";

  const FILES = { startup: "startup.wav", shutdown: "shutdown.wav", recycle: "recycle.wav" };
  const VOLUME = 0.4;
  const GESTURES = ["pointerdown", "touchend", "keydown"];

  let context = null;
  let gestureSeen = false;
  const buffers = new Map();
  const loading = new Map();

  function getContext() {
    if (context) return context;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
    Object.keys(FILES).forEach(load);
    return context;
  }

  function load(name) {
    if (loading.has(name)) return loading.get(name);
    const request = fetch(`assets/xp/audio/${FILES[name]}`)
      .then((response) => response.arrayBuffer())
      // Safari resuelve los callbacks de decodeAudioData, no la promesa.
      .then((data) => new Promise((resolve, reject) => context.decodeAudioData(data, resolve, reject)))
      .then((decoded) => buffers.set(name, decoded))
      .catch(() => loading.delete(name));
    loading.set(name, request);
    return request;
  }

  function unlock() {
    gestureSeen = true;
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state !== "running") ctx.resume();
    // iOS viejo necesita un sonido vacío para considerar válido el gesto.
    const source = ctx.createBufferSource();
    source.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    source.connect(ctx.destination);
    source.start(0);
  }

  function armUnlock() {
    const onGesture = () => {
      unlock();
      GESTURES.forEach((type) => window.removeEventListener(type, onGesture));
    };
    GESTURES.forEach((type) => window.addEventListener(type, onGesture, { passive: true }));
  }

  function start(name) {
    const buffer = buffers.get(name);
    if (!buffer) return;
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = VOLUME;
    source.connect(gain);
    gain.connect(context.destination);
    source.start(0);
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
    };
  }

  window.playSound = function (name) {
    const ctx = getContext();
    if (!ctx || (ctx.state !== "running" && !gestureSeen)) return;
    const play = () => (buffers.has(name) ? start(name) : load(name).then(() => start(name)));
    if (ctx.state === "running") play();
    else ctx.resume().then(() => ctx.state === "running" && play());
  };

  armUnlock();

  // iOS suspende el audio al pasar a segundo plano; al volver hace falta otro gesto.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && context && context.state !== "running") {
      gestureSeen = false;
      armUnlock();
    }
  });
})();
