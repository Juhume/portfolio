---
title: "Offline-first non é só caché"
description: "O que aprendín construíndo unha app que funciona sen conexión de verdade: IndexedDB, sync, conflitos e cifrado E2E."
date: 2025-10-05
lang: gl
canonicalSlug: "offline-first-no-es-solo-cache"
tags: ["arquitectura", "offline-first", "indexeddb"]
category: "profesional"
---

Cando comecei Espejo, pensaba que "offline-first" era poñer un service worker e cachear as respostas da API. Estaba equivocado.

## O problema real

Cachear é trivial. O difícil é que a app **funcione completa** sen conexión: crear entradas, editalas, borralas, e que todo se sincronice cando volva a rede.

IndexedDB (con Dexie como wrapper) converteuse na **fonte de verdade**. O servidor é só un espello opcional para sincronizar entre dispositivos. Isto inverte o modelo mental habitual: a app non "pide datos ao servidor". A app ten os datos e, cando pode, compárteos.

## Sync + cifrado: a combinación difícil

Cada entrada cífrase con AES-256-GCM antes de saír do navegador. O servidor só ve blobs opacos. Isto significa que non podes facer merge no servidor: non pode ler os datos.

A solución: **last-write-wins** con soft-delete e timestamps. Non é perfecta, pero para un diario persoal é dabondo. O usuario sempre pode ver o historial de cambios local. Cada entrada leva un campo `updatedAt` que se compara durante o sync. Se hai conflito, gaña o timestamp máis recente e o outro gárdase como versión anterior en local.

## Os problemas que ningún titorial cubre

Ter usuarios reais usando a app offline obrigoume a resolver escenarios que non atopei documentados en ningún sitio:

### Cambio de contrasinal offline

Que pasa se o usuario cambia o contrasinal nun dispositivo e despois abre o outro sen conexión? A clave de cifrado derívase do contrasinal, así que o segundo dispositivo ten unha clave obsoleta.

A solución foi separar a clave de cifrado do contrasinal. A master key xérase unha vez e almacénase cifrada cunha clave derivada do contrasinal (PBKDF2). Cando cambias o contrasinal, só se re-cifra a master key, non todas as entradas. O segundo dispositivo recibe a nova master key no seguinte sync e re-deriva sen tocar os datos.

### Corrupción de IndexedDB

Si, pasa. Un peche inesperado do navegador, unha actualización do sistema, ou simplemente mala sorte. E cando IndexedDB se corrompe, perdes todo o que non estaba sincronizado.

A defensa: un sistema de checksum por entrada. Cada vez que se escribe en IndexedDB, xérase un hash do contido cifrado. Ao ler, verifícase. Se non coincide, a entrada márcarse como corrupta e inténtase recuperar do servidor no seguinte sync. Ademais, un export automático periódico a un blob descargábel como backup de emerxencia.

### Migración de esquema con datos cifrados

Dexie xestiona migracións de IndexedDB con versións, pero cando os datos están cifrados, non podes simplemente transformalos nunha migración. Non tes acceso ao contido en texto plano durante o upgrade do esquema.

A solución: un campo `schemaVersion` nos metadatos (non cifrados) de cada entrada. Cando a app detecta unha entrada con versión antiga, descífraa, transfórmaa, re-cífraa e actualízaa. É unha migración lazy: ocorre entrada por entrada cando se accede, non en bloque. Máis lento na primeira carga, pero non bloquea a migración do esquema de IndexedDB.

## O que cambiou a miña forma de deseñar

Despois de construír isto, penso diferente sobre calquera app. A pregunta xa non é "necesita funcionar offline?" senón "que estado é local e que estado é remoto?". Incluso en apps online, esa separación produce arquitecturas máis resilientes.

Offline-first real non é unha feature, é unha arquitectura. Cambia como pensas sobre o estado, a persistencia e a resolución de conflitos. É máis traballo, pero o resultado é unha app que **sempre responde**, sen spinners, sen erros de rede, sen "inténtao de novo".

---

*Se queres ver a arquitectura completa en contexto, mira o [caso de estudo de Espejo](/gl/projects/espejo/).*
