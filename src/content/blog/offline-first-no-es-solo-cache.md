---
title: "Offline-first no es solo cache"
description: "Lo que aprendí construyendo una app que funciona sin conexión de verdad: IndexedDB, sync, conflictos y cifrado E2E."
date: 2025-03-01
lang: es
tags: ["arquitectura", "offline-first", "indexeddb"]
---

Cuando empecé Espejo, pensaba que "offline-first" era poner un service worker y cachear las respuestas del API. Estaba equivocado.

## El problema real

Cachear es trivial. Lo difícil es que la app **funcione completa** sin conexión: crear entradas, editarlas, borrarlas, y que todo se sincronice cuando vuelva la red.

IndexedDB (con Dexie como wrapper) se convirtió en la **fuente de verdad**. El servidor es solo un mirror opcional para sync entre dispositivos.

## Sync + cifrado: la combinación difícil

Cada entrada se cifra con AES-256-GCM antes de salir del navegador. El servidor solo ve blobs opacos. Esto significa que no puedes hacer merge en el servidor — no puede leer los datos.

La solución: **last-write-wins** con soft-delete y timestamps. No es perfecta, pero para un diario personal es suficiente. El usuario siempre puede ver el historial de cambios local.

## Lo que cambió mi forma de pensar

Tener usuarios reales usando la app offline me obligó a pensar en escenarios que nunca se me habrían ocurrido:

- ¿Qué pasa si el usuario cambia la contraseña en un dispositivo y luego abre el otro sin conexión?
- ¿Qué pasa si IndexedDB se corrompe? (Sí, pasa)
- ¿Cómo migras el esquema de IndexedDB sin perder datos cifrados?

Cada uno de estos problemas requirió soluciones creativas que no encontré en ningún tutorial.

## Conclusión

Offline-first real no es una feature — es una arquitectura. Cambia cómo piensas sobre el estado, la persistencia y la resolución de conflictos. Es más trabajo, pero el resultado es una app que **siempre responde**.
