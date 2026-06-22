/* ============================================================
   DATOS DEL PORTFOLIO
   ------------------------------------------------------------
   Este es el ÚNICO archivo que necesitás editar para cargar
   tu contenido. No hace falta tocar la lógica de la terminal.

   - profile: tus datos personales / contacto / skills.
   - projects: cada proyecto es una "carpeta" navegable con `cd`.
       id      -> nombre de la carpeta (lo que escribís: cd <id>)
       name    -> título legible
       status  -> ej: "terminado", "en desarrollo", "en producción"
       tags    -> categorías (Académico, Hackathon, Práctica, Hobby, Producto)
       summary -> 1 línea (aparece en `ls`)
       readme  -> texto largo que muestra `cat readme` dentro del proyecto
       stack   -> tecnologías usadas
       links   -> { repo, demo, ... }  (opcionales; "" = privado/sin link)
   ============================================================ */

const PORTFOLIO = {
  profile: {
    name: "Ignacio Hernando",
    handle: "ignacio-hernando",            
    role: "Ingeniero en Sistemas · Full-Stack (backend focus) & Machine Learning / IA",
    location: "Mar del Plata, Argentina",        
    bio: [
        "Ingeniero en Sistemas (UNICEN) especializado en desarrollo web",
        "Full-Stack y arquitectura de software. Continúo mi formación con",
        "una Diplomatura en Inteligencia Artificial.",
        "",
        "Construyo APIs y aplicaciones robustas —del backend al frontend—",
        "y me interesa la integración de IA/ML aplicada a",
        "la resolución de problemas concretos, cuando aportan valor real."
    ],
    skills: {
      "Backend": ["JavaScript", "Python", "Nest.js", "Bun.js", "FastAPI", "API REST", "Java"],
      "Frontend": ["React (MERN)", "Astro", "Tailwind CSS"],
      "Bases de datos": ["PostgreSQL", "MySQL", "SQLite", "Prisma"],
      "ML / IA": ["scikit-learn", "pandas", "NumPy", "LLMs", "RAG", "ChromaDB"],
      "Tooling": ["Git", "Docker", "CLI", "DevOps (nociones)", "n8n"],
    },
    contact: {
      email:    "ignaher12@gmail.com",
      github:   "https://github.com/ignaher12",
      linkedin: "https://www.linkedin.com/in/ing-ignacio-hernando/",
      twitter: "https://x.com/ignaher_dev"
    },
    // Link directo a tu CV (PDF). Dejalo en "" para ocultar el comando.
    cv: "assets/cv-ignacio-hernando.pdf",
  },

  /* ---- Proyectos reales ---- */
  projects: [
    {
      id: "karta",
      name: "Karta",
      status: "en producción ·",
      tags: ["★", "Producto comercial", "SaaS", "B2B"],
      summary: "CRM SaaS B2B multi-tenant para agencias de viaje.",
      readme: [
        "Sistema de gestión (CRM) SaaS B2B multi-tenant para agencias de",
        "viaje. Producto real, proximamente en producción.",
        "",
        "Highlights:",
        "  - Arquitectura multi-tenant (aislamiento por agencia vía JWT)",
        "  - Monorepo NestJS (API REST + Prisma) + React (Vite)",
        "  - Auth con cookies HttpOnly, rate limiting y validación global",
        "  - Servicio de OCR (PaddleOCR)",
        "  - Deploy containerizado (Docker / Fly.io)",
      ],
      stack: ["NestJS", "React", "Prisma", "PostgreSQL", "TanStack Query", "Docker"],
      links: {
        repo: "",   // privado
        demo: "",   // si tenés landing/demo pública, pegala acá
      },
    },
    {
      id: "nowaste",
      name: "NoWaste",
      status: "no finalizado ·",
      tags: ["★", "Practicas profesionales" ,"Equipo", "ISISTAN"],
      summary: "Marketplace para reducir el desperdicio de alimentos.",
      readme: [
        "Marketplace que conecta comercios con clientes para reducir el",
        "desperdicio de alimentos: los comercios venden productos próximos",
        "a su fecha de vencimiento a precio reducido y los usuarios compran",
        "más barato cuidando el medio ambiente.",
        "",
        "Desarrollado durante mi práctica profesional en ISISTAN (UNICEN),",
        "en un equipo de 5 estudiantes. El producto no llegó a finalizarse,",
        "pero la landing page está deployada y online.",
        "",
        "Mi rol:",
        "  - Arquitectura del backend (Bun + Elysia) y persistencia en",
        "    PostgreSQL con Drizzle ORM",
        "  - Interfaz de usuario con Astro + React + Tailwind CSS",
        "",
        "Highlights del sistema:",
        "  - Monorepo (Bun workspaces) backend + frontend",
        "  - API REST con Elysia, JWT y OpenID Connect, docs con Swagger",
        "  - Pagos online con MercadoPago",
        "  - Flujo buscar → comprar → retirar",
      ],
      stack: ["Bun", "Elysia", "Drizzle ORM", "PostgreSQL", "Astro", "React", "Tailwind"],
      links: {
        repo: "",   // repo de ISISTAN; completá si es público
        demo: "https://nowaste.apps.isistan.unicen.edu.ar/",
      },
    },
    {
      id: "wedge",
      name: "Wedge · 60s Briefing Bot",
      status: "terminado ·",
      tags: ["Hackathon", "IA"],
      summary: "Genera briefs de oportunidad de mercado en ~60 segundos.",
      readme: [
        "Herramienta agéntica que, a partir de una idea de producto, genera",
        "un brief de oportunidad de mercado de una página en ~60 segundos.",
        "Comprime semanas de research competitivo en un solo reporte.",
        "",
        "Qué hace:",
        "  - Identifica competidores dominantes del nicho",
        "  - Agrega quejas de clientes (G2, Reddit) con citas",
        "  - Detecta gaps de mercado vía análisis con LLM",
        "  - Sugiere ángulos de diferenciación / posicionamiento",
        "",
        "Highlights:",
        "  - Enfoque agéntico liviano (planning + synthesis con LLM)",
        "  - Progreso en tiempo real vía Server-Sent Events (SSE)",
        "  - Control de costos: tope duro de llamadas a la API externa",
      ],
      stack: ["Python", "FastAPI", "Llama 3.3 70B", "scikit-learn", "Playwright", "Bright Data"],
      links: {
        repo: "https://github.com/ignaher12/60secs_briefing_bot",
        demo: "",
      },
    },
    {
      id: "rag-assistant",
      name: "RAG Support Assistant",
      status: "terminado ·",
      tags: ["Práctica", "IA", "RAG"],
      summary: "Asistente de soporte con RAG sobre documentación privada.",
      readme: [
        "Asistente de soporte que responde consultas usando retrieval-",
        "augmented generation (RAG) sobre documentación privada.",
        "",
        "Qué hace:",
        "  - Indexa documentos (PDF, TXT, MD, JSON) como embeddings",
        "  - Búsqueda semántica por similitud vectorial",
        "  - Genera respuestas contextuales con citación de fuentes",
        "  - Distingue preguntas con y sin documentación de soporte",
        "",
        "Highlights:",
        "  - Vector DB con ChromaDB + embeddings e5-base",
        "  - Orquestación de workflows con n8n (webhooks + LLM)",
        "  - Deploy containerizado con Docker Compose",
      ],
      stack: ["Python", "FastAPI", "ChromaDB", "sentence-transformers", "n8n", "Docker"],
      links: {
        repo: "https://github.com/ignaher12/rag_support_assistant",
        demo: "",
      },
    },
    {
      id: "trading-bot",
      name: "Trading Bot · Backtesting",
      status: "terminado ·",
      tags: ["Académico"],
      summary: "Simulador de backtesting de una estrategia de trading combinada.",
      readme: [
        "Simulador de backtesting que evalúa una estrategia de trading",
        "combinada sobre datos históricos de acciones.",
        "",
        "Qué hace:",
        "  - Combina tres indicadores técnicos: MACD, RSI y Bandas de",
        "    Bollinger para generar señales de compra/venta",
        "  - Pipeline de obtención y limpieza de datos históricos",
        "  - Backtest con capital inicial y comisión de broker, con",
        "    visualización de la evolución del portafolio",
        "",
        "Highlights:",
        "  - Scripts modulares: data / cleaner / strategy",
        "  - Datasets de ejemplo (AAPL, AMD, NVDA, DIS, WMT, BRK)",
      ],
      stack: ["Python", "backtrader", "yfinance", "matplotlib"],
      links: {
        repo: "https://github.com/ignaher12/trading_bot",
        demo: "",
      },
    },
    {
      id: "compiler",
      name: "Compilador en Java",
      status: "terminado",
      tags: ["Académico", "Compilador"],
      summary: "Compilador que traduce un lenguaje propio a Assembler x86.",
      readme: [
        "Compilador construido en Java para la cátedra de compiladores,",
        "que traduce un lenguaje fuente propio a Assembler x86 (MASM32).",
        "",
        "Pipeline clásico de compilación:",
        "  - Análisis léxico (autómatas finitos con matrices)",
        "  - Análisis sintáctico (gramática YACC con acciones semánticas)",
        "  - Análisis semántico (tipos, alcance, validación de rangos)",
        "  - Generación de código a Assembler",
        "",
        "El lenguaje soporta variables, varios tipos de datos, control de",
        "flujo (IF/THEN/ELSE, REPEAT/WHILE), funciones, goto y expresiones,",
        "con reporte de errores detallado.",
      ],
      stack: ["Java", "BYACC/J", "C", "Assembly (MASM32)"],
      links: {
        repo: "https://github.com/ignaher12/compiler_in_java",
        demo: "",
      },
    },
    {
      id: "higa",
      name: "HIGA",
      status: "en producción",
      tags: ["Hobby", "Game"],
      summary: "Juego estilo Papers, Please hecho en Godot.",
      readme: [
        "Juego estilo \"Papers, Please\": el jugador inspecciona y toma",
        "decisiones bajo reglas que van cambiando. Proyecto hobby para",
        "experimentar con game dev.",
        "",
        "Highlights:",
        "  - Desarrollado en Godot Engine (GDScript)",
        "  - Mecánicas de inspección / decisión basadas en reglas",
        "",
        "Proximamente una demo disponible."
      ],
      stack: ["Godot", "GDScript"],
      links: {
        repo: "",   // completá si lo hacés público
        demo: "",
      },
    },
  ],
};
