---
title: "Migrar datos sin downtime en un servidor casero"
description: "Mi NAS tenía una regla: nunca apagarse. Entonces necesité mover sus datos más críticos a un disco nuevo. Esta es la historia de cómo lo hice sin romper nada."
date: 2025-12-20
lang: es
tags: ["infra", "homelab", "devops"]
category: "profesional"
---

Mi NAS tenía una regla: nunca apagarse. Y entonces necesité mover sus datos más críticos a un disco nuevo.

## El contexto

El NAS arrancó con un disco duro mecánico (volume1). Para películas, música y backups, funciona perfecto. Pero con el tiempo le fui añadiendo servicios que escriben mucho en disco. Home Assistant con su base de datos SQLite, OpenClaw con su estado, Prometheus con métricas. Todo corriendo sobre un HDD.

Y se notaba. Home Assistant tardaba cada vez más en cargar el historial. Algunas automatizaciones se disparaban con retraso. Los dashboards que tiraban de históricos iban lentos. El cuello de botella era claro: I/O de disco.

Así que compré un SSD y lo monté como volume2. El plan parecía simple. mover las bases de datos del HDD al SSD. Lo que no era tan simple era hacerlo sin apagar el NAS. Porque el NAS no es solo mi servidor de archivos. Es el DNS de casa, el gestor de domótica, el media server. Si lo apago, la casa se queda a oscuras. literalmente, porque las luces inteligentes dependen de Home Assistant.

## El plan

La estrategia fue:

1. **rsync inicial**: copiar los datos del HDD al SSD mientras el servicio sigue corriendo
2. **Parar el servicio**: solo cuando los datos están casi sincronizados
3. **rsync final**: una segunda pasada rápida para copiar solo los cambios
4. **Symlink**: crear un enlace simbólico desde la ruta original al nuevo destino en el SSD
5. **Reiniciar el servicio**: que arranque desde la nueva ubicación sin saber que nada cambió

En teoría, cada servicio estaría offline menos de 30 segundos. El resto del NAS seguiría funcionando normal.

## Las trampas

La teoría fue bonita. La práctica tuvo sus momentos.

**SQLite y los locks.** Si haces rsync de una base de datos SQLite mientras el servicio escribe, puedes copiar un archivo corrupto. La primera pasada es una copia "sucia". no te puedes fiar de ella sola. Por eso necesitas parar el servicio y hacer una segunda pasada limpia. Ese rsync final es el que importa.

**Rutas de Docker.** Algunos servicios corrían en Docker con volúmenes montados. No basta con mover el archivo. tienes que actualizar el `docker-compose.yml` o asegurarte de que el symlink esté en el path que Docker espera. Docker no sigue symlinks dentro de bind mounts si no le dices que lo haga. Me comí un error de "file not found" hasta que lo entendí.

**Servicios de systemd.** OpenClaw y otros servicios corrían como servicios de systemd del usuario. Pararlos requería `systemctl --user stop`, hacer la migración, y luego `systemctl --user start`. Sencillo, pero hay que acordarse de que no es el systemd de root.

## El resultado

Migré Home Assistant, OpenClaw y Prometheus en una tarde. Cada servicio estuvo offline entre 15 y 30 segundos. El resto del NAS siguió funcionando todo el tiempo. Plex siguió sirviendo películas, AdGuard siguió filtrando DNS, la red no se enteró de nada.

El rendimiento mejoró de forma brutal. El historial de Home Assistant que antes tardaba 8 segundos en cargar ahora va en menos de uno. Las escrituras de SQLite dejaron de ser un cuello de botella.

## La lección

Planifica las migraciones como si fueran deploys en producción. Ten un plan de rollback. para mí era simplemente borrar el symlink y volver a apuntar a la ruta original en el HDD. Testa los symlinks antes de cortar el tráfico. Y no tengas prisa. los 30 minutos extra que dedicas a comprobar todo te ahorran horas de debugging a las 3AM.

---

*Si quieres ver la arquitectura completa del homelab, mira el [caso de estudio del Homelab](/es/projects/homelab/).*
