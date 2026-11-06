## Estructura

```
portfolio/
├── index.html        # estructura de la página
├── css/styles.css    # tema (variables CSS arriba de todo)
├── js/data.js        # perfil+proyectos
├── js/classic.js     # render de la versión gráfica
├── js/terminal.js    # motor de la terminal
└── js/xp.js          # escritorio: ventanas, iconos, menú Inicio y barra de tareas
```

## Cómo cargar nuevo contenido

**`js/data.js`**:

- `profile`: nombre, rol, bio, skills y contacto (email, GitHub, LinkedIn, CV).
- `projects`: un objeto por proyecto. El campo `id` es lo que se escribe en
  `cd <id>`. Completa `name`, `status`, `summary`, `readme`, `stack` y `links`.

## Comandos

`help`, `ls`, `cd`, `cat readme`, `pwd`, `whoami`, `skills`, `contact`,
`open repo|demo`, `gui`, `neofetch`, `clear`, `exit`. Autocompletado con Tab, historial
con ↑/↓, limpiar con Ctrl+L.

## Créditos

Los botones de ventana, las barras de desplazamiento y la flecha de la barra de direcciones son de [XP.css](https://github.com/botoxparty/XP.css) (licencia MIT, ver `assets/xpcss/LICENSE`).

El efecto CRT, el flujo de arranque y `js/sounds.js` están adaptados de [react-xp](https://github.com/Cyanoxide/react-xp) de Jamie Pates, con permiso.

Las imágenes y sonidos de `assets/xp/` provienen de Windows XP y son propiedad de Microsoft. Este sitio es un homenaje sin fines comerciales y no está afiliado a Microsoft.
