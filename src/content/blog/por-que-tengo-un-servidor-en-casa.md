---
title: "Por qué tengo un servidor en casa"
description: "No es un tutorial. Es la historia de por qué decidí montar un homelab, qué aprendí rompiéndolo todo, y por qué docker compose up se convirtió en mi momento zen."
date: 2025-09-18
lang: es
tags: ["infra", "vida", "homelab"]
category: "personal"
---

Todo empezó porque Plex se caía en el servidor de un amigo cada dos semanas. Un día me harté, busqué "build home server" en YouTube, y tres horas después tenía un NAS en el carrito de Amazon. Esa fue la excusa. La razón real era otra.

## Querer entender cómo funcionan las cosas

Llevo años trabajando con tecnología, pero siempre desde el lado del software. El servidor físico, la red, el DNS, los puertos. todo eso era una caja negra. Alguien en sistemas lo configuraba y yo me limitaba a hacer peticiones HTTP. Me daba rabia no entender la capa de debajo.

Montar un homelab me obligó a entender todo eso. De golpe tuve que saber qué era un reverse proxy, por qué mi router no dejaba pasar tráfico al puerto 443, y cómo funcionaba DHCP de verdad. no la versión del examen de certificación, sino la de "por qué narices este dispositivo tiene la IP que no toca".

## El placer de romper cosas sin consecuencias

En el trabajo, romper algo en producción significa un incidente, una llamada, y un post-mortem. En mi servidor, romper algo significa reiniciar un contenedor y tomarte un café mientras piensas en qué ha ido mal.

He roto mi instalación de Home Assistant al menos cuatro veces. Una vez por actualizar sin mirar el changelog. Otra por tocar un archivo YAML y poner un espacio donde no tocaba. quién diseñó un formato de configuración donde la indentación importa merece un lugar especial en algún sitio.

Y luego está el dongle Zigbee. Tres horas. Tres horas para que un stick USB de 12 euros hablara con una bombilla inteligente. Probé tres drivers, dos firmwares, y leí foros en alemán con el traductor del navegador. Cuando la bombilla finalmente se encendió desde el dashboard, sentí algo parecido a lo que debió sentir Armstrong pisando la Luna. Desproporcionado, sí. Pero real.

## Control sobre tus propios datos

No soy un paranoico de la privacidad, pero hay algo que me incomoda en depender al 100% de servicios de terceros para todo. Mi música, mis fotos, mis notas, mis automatizaciones del hogar. todo en la nube de alguien.

Con el homelab, **Plex** sirve mi biblioteca de películas. **AdGuard Home** filtra la publicidad a nivel de DNS para todos los dispositivos de casa. incluyendo la tele, que antes era imposible. **Home Assistant** controla las luces, el termostato, y me avisa cuando el sensor de humedad del baño se dispara.

¿Es más trabajo que pagar por Spotify y Google Home? Sin duda. Pero es *mi* trabajo. Y cada servicio que configuro me enseña algo nuevo.

## La satisfacción de `docker compose up`

Hay un momento, cuando llevas una hora editando un `docker-compose.yml`, revisando variables de entorno, montando volúmenes, que finalmente escribes `docker compose up -d` y todos los contenedores arrancan en verde. Los logs no escupen errores. El servicio responde en el navegador.

Es una satisfacción difícil de explicar a quien no lo ha vivido. Es como montar un mueble de IKEA y que no te sobren piezas. Parece poco, pero cuando pasa, lo celebras.

## No es para todo el mundo

Seré honesto: mantener un homelab requiere tiempo, paciencia, y una tolerancia alta a la frustración. Hay sábados que he pasado cuatro horas debuggeando un problema de red que al final era un cable Ethernet medio suelto.

Pero si te gusta aprender haciendo, si disfrutas teniendo el control de tu infraestructura, y si la idea de tener tus propios servicios corriendo en un cacharro debajo de tu escritorio te parece más emocionante que intimidante. entonces probablemente ya estés buscando NAS en alguna tienda.

Yo no puedo dejar de recomendarlo. No por la utilidad. que la tiene. sino por todo lo que aprendes por el camino.

---

*Si quieres ver cómo está montado, mira el [caso de estudio del Homelab](/es/projects/homelab/).*
