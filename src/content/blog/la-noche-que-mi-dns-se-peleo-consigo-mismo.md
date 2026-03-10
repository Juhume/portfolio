---
title: "La noche que mi DNS se peleó consigo mismo"
description: "Todo funcionaba hasta que dejó de funcionar. A las 2AM, ningún dispositivo de mi casa resolvía un dominio. Esta es la historia de dos servicios DNS peleándose por el control."
date: 2025-11-15
lang: es
tags: ["infra", "homelab", "debugging"]
category: "profesional"
---

Todo funcionaba hasta que dejó de funcionar. A las 2AM, ningún dispositivo de mi casa podía resolver un dominio.

## El contexto

Tengo AdGuard Home corriendo en mi NAS como servidor DNS para toda la red. Es uno de los servicios que más valoro del homelab. Bloqueo de publicidad a nivel de red, rewrites personalizados para acceder a mis servicios locales por nombre en vez de por IP, y logs de todas las consultas DNS. Si alguien (o algo) intenta conectarse a un dominio de telemetría a las 4AM, lo veo.

El router de casa apunta su DNS al NAS. Cada dispositivo que se conecta a la red recibe el NAS como servidor DNS vía DHCP. Simple, limpio, llevaba meses funcionando sin tocar nada.

## El problema

Ese día instalé Tailscale en el NAS. Para quien no lo conozca, Tailscale crea una VPN mesh entre tus dispositivos. Me permite acceder al NAS desde fuera de casa sin abrir puertos ni complicarme con port forwarding.

Durante la instalación, acepté todas las opciones por defecto. Incluyendo `--accept-dns`. Ese flag le dice a Tailscale que sobrescriba la configuración DNS del sistema con los servidores DNS de la red Tailscale. En un portátil, eso puede tener sentido. En un NAS que es el servidor DNS de toda tu casa, es una bomba de relojería.

Lo que pasó fue esto: Tailscale sobrescribió el `/etc/resolv.conf` del NAS. AdGuard Home seguía corriendo y respondiendo consultas, pero el propio NAS ya no le preguntaba a AdGuard. Le preguntaba a los DNS de Tailscale. Y como el router apuntaba todo al NAS, todos los dispositivos de la casa terminaron resolviendo a través de una cadena que nadie había diseñado.

Algunos dominios resolvían. Otros no. Los rewrites locales dejaron de funcionar por completo. Home Assistant dejó de encontrar mis dispositivos por nombre. La tele no podía cargar nada.

## Debugging a las 2AM

Me di cuenta del problema porque el móvil no cargaba una web. Mi primer pensamiento fue "se ha caído Internet". Pero no. El router tenía conexión. Era DNS.

Desde otro equipo, un `nslookup google.com` tardaba una eternidad o directamente fallaba. Un `dig @192.168.1.100 google.com` (la IP del NAS) devolvía respuestas intermitentes. Abrí los logs de AdGuard. pocas consultas llegaban. Algo estaba interceptando el tráfico DNS antes de que llegara a AdGuard.

Revisé el NAS. `cat /etc/resolv.conf`. Y ahí estaba: Tailscale había puesto sus propios nameservers. El NAS, que debería usar AdGuard como DNS, estaba preguntando a otro sitio. Dos servicios DNS intentando ser el jefe. Ninguno ganando.

## La solución

Una línea:

```bash
tailscale set --accept-dns=false
```

Eso le dice a Tailscale que deje de tocar la configuración DNS del sistema. Que se encargue de la VPN y nada más. AdGuard vuelve a ser el único responsable de DNS. Reinicié el servicio, verifiqué que `/etc/resolv.conf` apuntaba donde debía, y todo volvió a funcionar.

Tiempo total del incidente: unas dos horas. Tiempo de la solución real: 10 segundos.

## La lección

En un homelab, cada servicio cree que es el protagonista. Tailscale quiere gestionar tu DNS. AdGuard quiere gestionar tu DNS. Docker quiere gestionar tu red. Si no defines límites claros entre servicios, van a pisarse unos a otros.

La regla que me quedó grabada: cuando instales algo nuevo, revisa qué quiere controlar además de lo que tú le pediste. Lee los flags. Lee los defaults. Y si algo toca DNS, trátalo con el respeto que merece. Porque DNS es la base de todo. Si DNS falla, nada funciona.

---

*Si quieres ver cómo está montado el resto del homelab, mira el [caso de estudio del Homelab](/es/projects/homelab/).*
