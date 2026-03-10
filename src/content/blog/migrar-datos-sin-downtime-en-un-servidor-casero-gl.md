---
title: "Migrar datos sen downtime nun servidor caseiro"
description: "O meu NAS tiña unha regra: nunca apagarse. Entón necesitei mover os seus datos máis críticos a un disco novo. Esta é a historia de como o fixen sen romper nada."
date: 2025-12-20
lang: gl
canonicalSlug: "migrar-datos-sin-downtime-en-un-servidor-casero"
tags: ["infra", "homelab", "devops"]
---

O meu NAS tiña unha regra: nunca apagarse. E entón necesitei mover os seus datos máis críticos a un disco novo.

## O contexto

O NAS arrancou cun disco duro mecánico (volume1). Para películas, música e backups, funciona perfecto. Pero co tempo funlle engadindo servizos que escriben moito en disco. Home Assistant coa súa base de datos SQLite, OpenClaw co seu estado, Prometheus con métricas. Todo correndo sobre un HDD.

E notábase. Home Assistant tardaba cada vez máis en cargar o historial. Algunhas automatizacións disparábanse con atraso. Os dashboards que tiraban de históricos ían lentos. O pescozo de botella era claro: I/O de disco.

Así que merquei un SSD e monteino como volume2. O plan parecía sinxelo. mover as bases de datos do HDD ao SSD. O que non era tan sinxelo era facelo sen apagar o NAS. Porque o NAS non é só o meu servidor de arquivos. É o DNS de casa, o xestor de domótica, o media server. Se o apago, a casa queda ás escuras. literalmente, porque as luces intelixentes dependen de Home Assistant.

## O plan

A estratexia foi:

1. **rsync inicial**: copiar os datos do HDD ao SSD mentres o servizo segue correndo
2. **Parar o servizo**: só cando os datos están case sincronizados
3. **rsync final**: unha segunda pasada rápida para copiar só os cambios
4. **Symlink**: crear un enlace simbólico desde a ruta orixinal ao novo destino no SSD
5. **Reiniciar o servizo**: que arranque desde a nova ubicación sen saber que nada cambiou

En teoría, cada servizo estaría offline menos de 30 segundos. O resto do NAS seguiría funcionando normal.

## As trampas

A teoría foi bonita. A práctica tivo os seus momentos.

**SQLite e os locks.** Se fas rsync dunha base de datos SQLite mentres o servizo escribe, podes copiar un arquivo corrupto. A primeira pasada é unha copia "sucia". non te podes fiar dela soa. Por iso necesitas parar o servizo e facer unha segunda pasada limpa. Ese rsync final é o que importa.

**Rutas de Docker.** Algúns servizos corrían en Docker con volumes montados. Non abonda con mover o arquivo. tes que actualizar o `docker-compose.yml` ou asegurarte de que o symlink estea no path que Docker espera. Docker non segue symlinks dentro de bind mounts se non lle dis que o faga. Comeume un erro de "file not found" ata que o entendín.

**Servizos de systemd.** OpenClaw e outros servizos corrían como servizos de systemd do usuario. Paralos requiría `systemctl --user stop`, facer a migración, e logo `systemctl --user start`. Sinxelo, pero hai que acordarse de que non é o systemd de root.

## O resultado

Migrei Home Assistant, OpenClaw e Prometheus nunha tarde. Cada servizo estivo offline entre 15 e 30 segundos. O resto do NAS seguiu funcionando todo o tempo. Plex seguiu servindo películas, AdGuard seguiu filtrando DNS, a rede non se enterou de nada.

O rendemento mellorou de forma brutal. O historial de Home Assistant que antes tardaba 8 segundos en cargar agora vai en menos dun. As escrituras de SQLite deixaron de ser un pescozo de botella.

## A lección

Planifica as migracións coma se fosen deploys en produción. Ten un plan de rollback. para min era simplemente borrar o symlink e volver apuntar á ruta orixinal no HDD. Testa os symlinks antes de cortar o tráfico. E non teñas présa. os 30 minutos extra que dedicas a comprobar todo afórranche horas de debugging ás 3AM.

---

*Se queres ver a arquitectura completa do homelab, mira o [caso de estudo do Homelab](/gl/projects/homelab/).*
