# Dev Portfolio — Terminal interactiva

Portfolio personal con estética de terminal (estilo VS Code dark). Navegás los
proyectos como si fueran carpetas: `ls`, `cd <proyecto>`, `cat readme`, etc.
Incluye un **modo clásico** (cards) con un toggle, para visitantes no técnicos.

## Estructura

```
portfolio/
├── index.html        # estructura de la página
├── css/styles.css    # tema (variables CSS arriba de todo)
├── js/data.js        # 👈 TUS DATOS van acá (perfil + proyectos)
├── js/classic.js     # render de la vista clásica
└── js/terminal.js    # motor de la terminal (no hace falta tocar)
```

## Cómo cargar tu contenido

Editá **solo `js/data.js`**:

- `profile`: nombre, rol, bio, skills y contacto (email, GitHub, LinkedIn, CV).
- `projects`: un objeto por proyecto. El campo `id` es lo que se escribe en
  `cd <id>`. Completá `name`, `status`, `summary`, `readme`, `stack` y `links`.

## Comandos

`help`, `ls`, `cd`, `cat readme`, `pwd`, `whoami`, `skills`, `contact`,
`open repo|demo`, `neofetch`, `clear`. Autocompletado con **Tab**, historial
con **↑/↓**, limpiar con **Ctrl+L**.

## Probarlo localmente

Como es 100% estático y los datos están en `data.js` (no usa `fetch`), podés
abrir `index.html` directo en el navegador. Igual, para que sea idéntico a
producción, conviene un server estático:

```bash
# con Python
python -m http.server 8000
# luego abrí http://localhost:8000
```

## Deploy

Es estático y agnóstico al hosting. Funciona tal cual en:

- **GitHub Pages**: subí el repo y activá Pages sobre la rama `main` (`/root`).
- **Vercel / Netlify**: importá el repo; sin build step, output dir = raíz.
