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

IndexedDB (con Dexie como wrapper) se convirtió en la **fuente de verdad**. El servidor es solo un mirror opcional para sync entre dispositivos. Esto invierte el modelo mental habitual: la app no "pide datos al servidor". La app tiene los datos y, cuando puede, los comparte.

## Sync + cifrado: la combinación difícil

Cada entrada se cifra con AES-256-GCM antes de salir del navegador. El servidor solo ve blobs opacos. Esto significa que no puedes hacer merge en el servidor — no puede leer los datos.

La solución: **last-write-wins** con soft-delete y timestamps. No es perfecta, pero para un diario personal es suficiente. El usuario siempre puede ver el historial de cambios local. Cada entrada lleva un campo `updatedAt` que se compara durante el sync. Si hay conflicto, gana el timestamp más reciente y el otro se guarda como versión anterior en local.

## Los problemas que ningún tutorial cubre

Tener usuarios reales usando la app offline me obligó a resolver escenarios que no encontré documentados en ningún sitio:

### Cambio de contraseña offline

¿Qué pasa si el usuario cambia la contraseña en un dispositivo y luego abre el otro sin conexión? La clave de cifrado deriva de la contraseña, así que el segundo dispositivo tiene una clave obsoleta.

La solución fue separar la clave de cifrado de la contraseña. La master key se genera una vez y se almacena cifrada con una clave derivada de la contraseña (PBKDF2). Cuando cambias la contraseña, solo se re-cifra la master key, no todas las entradas. El segundo dispositivo recibe la nueva master key en el siguiente sync y re-deriva sin tocar los datos.

### Corrupción de IndexedDB

Sí, pasa. Un cierre inesperado del navegador, una actualización del sistema, o simplemente mala suerte. Y cuando IndexedDB se corrompe, pierdes todo lo que no estaba sincronizado.

La defensa: un sistema de checksum por entrada. Cada vez que se escribe en IndexedDB, se genera un hash del contenido cifrado. Al leer, se verifica. Si no coincide, la entrada se marca como corrupta y se intenta recuperar del servidor en el siguiente sync. Además, un export automático periódico a un blob descargable como backup de emergencia.

### Migración de esquema con datos cifrados

Dexie maneja migraciones de IndexedDB con versiones, pero cuando los datos están cifrados, no puedes simplemente transformarlos en una migración. No tienes acceso al contenido en texto plano durante el upgrade del esquema.

La solución: un campo `schemaVersion` en los metadatos (no cifrados) de cada entrada. Cuando la app detecta una entrada con versión antigua, la descifra, transforma, re-cifra, y actualiza. Es una migración lazy — ocurre entrada por entrada cuando se accede, no en bloque. Más lento en la primera carga, pero no bloquea la migración del esquema de IndexedDB.

## Lo que cambió mi forma de diseñar

Después de construir esto, pienso diferente sobre cualquier app. La pregunta ya no es "¿necesita funcionar offline?" sino "¿qué estado es local y qué estado es remoto?". Incluso en apps online, esa separación produce arquitecturas más resilientes.

Offline-first real no es una feature — es una arquitectura. Cambia cómo piensas sobre el estado, la persistencia y la resolución de conflictos. Es más trabajo, pero el resultado es una app que **siempre responde**, sin spinners, sin errores de red, sin "inténtalo de nuevo".

---

*Si quieres ver la arquitectura completa en contexto, mira el [caso de estudio de Espejo](/es/projects/espejo/).*
