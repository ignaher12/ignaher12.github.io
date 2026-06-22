## Estructura

```
portfolio/
├── index.html        # estructura de la página
├── css/styles.css    # tema (variables CSS arriba de todo)
├── js/data.js        # perfil+proyectos
├── js/classic.js     # render de la vista clásica
└── js/terminal.js    # motor de la terminal 
```

## Cómo cargar nuevo contenido

**`js/data.js`**:

- `profile`: nombre, rol, bio, skills y contacto (email, GitHub, LinkedIn, CV).
- `projects`: un objeto por proyecto. El campo `id` es lo que se escribe en
  `cd <id>`. Completa `name`, `status`, `summary`, `readme`, `stack` y `links`.

## Comandos

`help`, `ls`, `cd`, `cat readme`, `pwd`, `whoami`, `skills`, `contact`,
`open repo|demo`, `neofetch`, `clear`. Autocompletado con Tab, historial
con ↑/↓, limpiar con Ctrl+L.
