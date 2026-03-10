---
title: "Por que teño un servidor na casa"
description: "Non é un titorial. É a historia de por que decidín montar un homelab, que aprendín rompéndoo todo, e por que docker compose up se converteu no meu momento zen."
date: 2025-09-18
lang: gl
canonicalSlug: "por-que-tengo-un-servidor-en-casa"
tags: ["infra", "vida", "homelab"]
category: "personal"
---

Todo comezou porque Plex caía no servidor dun amigo cada dúas semanas. Un día farteime, busquei "build home server" en YouTube, e tres horas despois tiña un NAS no carriño de Amazon. Esa foi a escusa. A razón real era outra.

## Querer entender como funcionan as cousas

Levo anos traballando con tecnoloxía, pero sempre dende o lado do software. O servidor físico, a rede, o DNS, os portos—todo iso era unha caixa negra. Alguén en sistemas configurábao e eu limitábame a facer peticións HTTP. Dábame rabia non entender a capa de abaixo.

Montar un homelab obrigoume a entender todo iso. De golpe tiven que saber que era un reverse proxy, por que o meu router non deixaba pasar tráfico ao porto 443, e como funcionaba DHCP de verdade—non a versión do exame de certificación, senón a de "por que narices este dispositivo ten a IP que non toca".

## O pracer de romper cousas sen consecuencias

No traballo, romper algo en produción significa un incidente, unha chamada e un post-mortem. No meu servidor, romper algo significa reiniciar un contedor e tomar un café mentres pensas en que foi mal.

Rompín a miña instalación de Home Assistant polo menos catro veces. Unha por actualizar sen mirar o changelog. Outra por tocar un ficheiro YAML e poñer un espazo onde non tocaba—quen deseñou un formato de configuración onde a indentación importa merece un lugar especial nalgún sitio.

E logo está o dongle Zigbee. Tres horas. Tres horas para que un stick USB de 12 euros falase cunha lámpada intelixente. Probei tres drivers, dous firmwares, e lin foros en alemán co tradutor do navegador. Cando a lámpada finalmente se acendeu dende o dashboard, sentín algo parecido ao que debeu sentir Armstrong pisando a Lúa. Desproporcionado, si. Pero real.

## Control sobre os teus propios datos

Non son un paranoico da privacidade, pero hai algo que me incomoda en depender ao 100% de servizos de terceiros para todo. A miña música, as miñas fotos, as miñas notas, as miñas automatizacións do fogar—todo na nube de alguén.

Co homelab, **Plex** serve a miña biblioteca de películas. **AdGuard Home** filtra a publicidade a nivel de DNS para todos os dispositivos da casa—incluíndo a tele, que antes era imposíbel. **Home Assistant** controla as luces, o termostato, e avísame cando o sensor de humidade do baño se dispara.

É máis traballo que pagar por Spotify e Google Home? Sen dúbida. Pero é *o meu* traballo. E cada servizo que configuro ensíname algo novo.

## A satisfacción de `docker compose up`

Hai un momento, cando levas unha hora editando un `docker-compose.yml`, revisando variables de contorno, montando volumes, que finalmente escribes `docker compose up -d` e todos os contedores arrincan en verde. Os logs non escupen erros. O servizo responde no navegador.

É unha satisfacción difícil de explicar a quen non o viviu. É como montar un moble de IKEA e que non che sobren pezas. Parece pouco, pero cando pasa, celébralo.

## Non é para todo o mundo

Serei honesto: manter un homelab require tempo, paciencia e unha tolerancia alta á frustración. Hai sábados que pasei catro horas depurando un problema de rede que ao final era un cable Ethernet medio solto.

Pero se che gusta aprender facendo, se desfrutas tendo o control da túa infraestrutura, e se a idea de ter os teus propios servizos correndo nunha caixa debaixo do teu escritorio che parece máis emocionante que intimidante—entón probabelmente xa esteas buscando NAS nalgunha tenda.

Eu non podo deixar de recomendalo. Non pola utilidade—que a ten—senón por todo o que aprendes polo camiño.

---

*Se queres ver como está montado, mira o [caso de estudo do Homelab](/gl/projects/homelab/).*
