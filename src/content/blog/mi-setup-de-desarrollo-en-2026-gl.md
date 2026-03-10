---
title: "O meu setup de desenvolvemento en 2026"
description: "Un repaso rápido e honesto das ferramentas que uso para desenvolver, sen ligazóns de afiliados nin recomendacións forzadas. Só o que funciona."
date: 2026-03-01
lang: gl
canonicalSlug: "mi-setup-de-desarrollo-en-2026"
tags: ["infra", "código", "ferramentas"]
category: "profesional"
---

Gústame ver os setups doutros desenvolvedores. Non polo hardware—que tamén—senón por descubrir ferramentas ou fluxos que non coñecía. Así que aquí vai o meu, sen adornos.

## O cerebro: UGREEN NAS

Todo corre nun NAS de UGREEN. Non é un servidor rack de empresa nin un PC gaming reconvertido—é unha caixa compacta, silenciosa e con dabonda potencia para o que necesito. Docker corre nativo e xestiono todo con `docker compose`.

Dentro hai de todo: Plex, AdGuard Home, Home Assistant, bases de datos para proxectos e os axentes de IA que uso para desenvolvemento. Cada servizo no seu contedor, cada contedor cos seus volumes. Cando algo se rompe, `docker compose down && docker compose up -d` e a outra cousa.

## Editor: VS Code

Probei outros. Sempre volvo a VS Code. É rápido para o que pesa, as extensións son infinitas e o terminal integrado afórrame ter outra xanela aberta.

Extensións imprescindíbeis: ESLint, Prettier, GitLens e o tema Catppuccin Mocha porque programar ás 11 da noite cun tema claro é unha agresión visual.

## Acceso remoto: Tailscale

Isto cambiou a miña forma de traballar. Tailscale crea unha VPN mesh entre todos os meus dispositivos—portátil, móbil, NAS—sen abrir portos, sen configurar nada raro. Estou nunha cafetaría e accedo aos meus servizos do NAS como se estivese na casa. SSH ao servidor, dashboard de Home Assistant, o que sexa.

Zero config, simplemente funciona. É desas ferramentas que unha vez que as probas non entendes como vivías sen elas.

## Terminal

iTerm2 en macOS con tmux para sesións persistentes. Múltiples paneis, un con logs de Docker, outro co servidor de desenvolvemento, outro para git. Todo visíbel dun ollo.

O shell é zsh con Oh My Zsh e un prompt mínimo. Nada de temas recargados con emojis—só o directorio actual, o branch de git e se o último comando foi ben ou mal.

## Axentes de IA

Uso OpenClaw como sistema multi-axente. Teño axentes especializados por dominio: un para código, outro para infraestrutura, outro para tarefas persoais. Non é como chatear con ChatGPT—son axentes que executan, que acceden a ficheiros, que corren comandos.

Substitúen a saber programar? Non. Pero multiplican o que podes facer, especialmente cando estás aprendendo. É como ter un compañeiro de pair programming que nunca se cansa e que sabe máis ca ti de case todo.

## O que non uso

Non uso Vim nin Neovim. Non teño nada en contra, pero a curva de aprendizaxe non compensa para o meu caso. Non uso Notion nin Obsidian para documentar código—un README ben escrito e comentarios claros abóndanme. Non uso monitores ultrawide—dúas pantallas normais e listo.

Ás veces o máis produtivo non é a ferramenta máis sofisticada. É a que xa coñeces e non che estorba.

---

*Se queres saber máis sobre o NAS e os servizos que corren nel, mira o [caso de estudo do Homelab](/gl/projects/homelab/).*
