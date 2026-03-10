---
title: "Mi setup de desarrollo en 2026"
description: "Un repaso rápido y honesto de las herramientas que uso para desarrollar, sin links de afiliados ni recomendaciones forzadas. Solo lo que funciona."
date: 2026-03-01
lang: es
tags: ["infra", "código", "herramientas"]
---

Me gusta ver los setups de otros desarrolladores. No por el hardware. que también. sino por descubrir herramientas o flujos que no conocía. Así que aquí va el mío, sin adornos.

## El cerebro: UGREEN NAS

Todo corre en un NAS de UGREEN. No es un servidor rack de empresa ni un PC gaming reconvertido. es una caja compacta, silenciosa, y con suficiente potencia para lo que necesito. Docker corre nativo y gestiono todo con `docker compose`.

Dentro hay de todo: Plex, AdGuard Home, Home Assistant, bases de datos para proyectos, y los agentes de IA que uso para desarrollo. Cada servicio en su contenedor, cada contenedor con sus volúmenes. Cuando algo se rompe, `docker compose down && docker compose up -d` y a otra cosa.

## Editor: VS Code

He probado otros. Siempre vuelvo a VS Code. Es rápido para lo que pesa, las extensiones son infinitas, y el terminal integrado me ahorra tener otra ventana abierta.

Extensiones imprescindibles: ESLint, Prettier, GitLens, y el tema Catppuccin Mocha porque programar a las 11 de la noche con un tema claro es una agresión visual.

## Acceso remoto: Tailscale

Esto cambió mi forma de trabajar. Tailscale crea una VPN mesh entre todos mis dispositivos. portátil, móvil, NAS. sin abrir puertos, sin configurar nada raro. Estoy en una cafetería y accedo a mis servicios del NAS como si estuviera en casa. SSH al servidor, dashboard de Home Assistant, lo que sea.

Zero config, simplemente funciona. Es de esas herramientas que una vez que las pruebas no entiendes cómo vivías sin ellas.

## Terminal

iTerm2 en macOS con tmux para sesiones persistentes. Múltiples paneles, uno con logs de Docker, otro con el servidor de desarrollo, otro para git. Todo visible de un vistazo.

El shell es zsh con Oh My Zsh y un prompt mínimo. Nada de temas recargados con emojis. solo el directorio actual, el branch de git, y si el último comando fue bien o mal.

## Agentes de IA

Uso OpenClaw como sistema multi-agente. Tengo agentes especializados por dominio: uno para código, otro para infraestructura, otro para tareas personales. No es como chatear con ChatGPT. son agentes que ejecutan, que acceden a archivos, que corren comandos.

¿Sustituyen a saber programar? No. Pero multiplican lo que puedes hacer, especialmente cuando estás aprendiendo. Es como tener un compañero de pair programming que nunca se cansa y que sabe más que tú de casi todo.

## Lo que no uso

No uso Vim ni Neovim. No tengo nada en contra, pero la curva de aprendizaje no compensa para mi caso. No uso Notion ni Obsidian para documentar código. un README bien escrito y comentarios claros me bastan. No uso monitores ultrawide. dos pantallas normales y listo.

A veces lo más productivo no es la herramienta más sofisticada. Es la que ya conoces y no te estorba.

---

*Si quieres saber más sobre el NAS y los servicios que corren en él, mira el [caso de estudio del Homelab](/es/projects/homelab/).*
