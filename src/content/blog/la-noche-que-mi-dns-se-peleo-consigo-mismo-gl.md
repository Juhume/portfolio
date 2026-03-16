---
title: "A noite que o meu DNS loitou consigo mesmo"
description: "Todo funcionaba ata que deixou de funcionar. Ás 2AM, ningún dispositivo da miña casa resolvía un dominio. Esta é a historia de dous servizos DNS loitando polo control."
date: 2025-11-25
lang: gl
canonicalSlug: "la-noche-que-mi-dns-se-peleo-consigo-mismo"
tags: ["infra", "homelab", "debugging"]
category: "profesional"
---

Todo funcionaba ata que deixou de funcionar. Ás 2AM, ningún dispositivo da miña casa podía resolver un dominio.

## O contexto

Teño AdGuard Home correndo no meu NAS como servidor DNS para toda a rede. É un dos servizos que máis valoro do homelab. Bloqueo de publicidade a nivel de rede, rewrites personalizados para acceder aos meus servizos locais por nome en vez de por IP, e logs de todas as consultas DNS. Se alguén (ou algo) intenta conectarse a un dominio de telemetría ás 4AM, véxoo.

O router de casa apunta o seu DNS ao NAS. Cada dispositivo que se conecta á rede recibe o NAS como servidor DNS vía DHCP. Sinxelo, limpo, levaba meses funcionando sen tocar nada.

## O problema

Ese día instalei Tailscale no NAS. Para quen non o coñeza, Tailscale crea unha VPN mesh entre os teus dispositivos. Permíteme acceder ao NAS desde fóra de casa sen abrir portos nin complicarme con port forwarding.

Durante a instalación, aceptei todas as opcións por defecto. Incluíndo `--accept-dns`. Ese flag dille a Tailscale que sobrescriba a configuración DNS do sistema cos servidores DNS da rede Tailscale. Nun portátil, iso pode ter sentido. Nun NAS que é o servidor DNS de toda a túa casa, é unha bomba de reloxería.

O que pasou foi isto: Tailscale sobrescribiu o `/etc/resolv.conf` do NAS. AdGuard Home seguía correndo e respondendo consultas, pero o propio NAS xa non lle preguntaba a AdGuard. Preguntáballe aos DNS de Tailscale. E como o router apuntaba todo ao NAS, todos os dispositivos da casa terminaron resolvendo a través dunha cadea que ninguén deseñara.

Algúns dominios resolvían. Outros non. Os rewrites locais deixaron de funcionar por completo. Home Assistant deixou de atopar os meus dispositivos por nome. A tele non podía cargar nada.

## Debugging ás 2AM

Deime conta do problema porque o móbil non cargaba unha web. O meu primeiro pensamento foi "caeu Internet". Pero non. O router tiña conexión. Era DNS.

Desde outro equipo, un `nslookup google.com` tardaba unha eternidade ou directamente fallaba. Un `dig @192.168.1.100 google.com` (a IP do NAS) devolvía respostas intermitentes. Abrín os logs de AdGuard. poucas consultas chegaban. Algo estaba interceptando o tráfico DNS antes de que chegase a AdGuard.

Revisei o NAS. `cat /etc/resolv.conf`. E aí estaba: Tailscale puxera os seus propios nameservers. O NAS, que debería usar AdGuard como DNS, estaba preguntando a outro sitio. Dous servizos DNS intentando ser o xefe. Ningún gañando.

## A solución

Unha liña:

```bash
tailscale set --accept-dns=false
```

Iso dille a Tailscale que deixe de tocar a configuración DNS do sistema. Que se encargue da VPN e nada máis. AdGuard volve ser o único responsable de DNS. Reiniciei o servizo, verifiquei que `/etc/resolv.conf` apuntaba onde debía, e todo volveu a funcionar.

Tempo total do incidente: unhas dúas horas. Tempo da solución real: 10 segundos.

## A lección

Nun homelab, cada servizo cre que é o protagonista. Tailscale quere xestionar o teu DNS. AdGuard quere xestionar o teu DNS. Docker quere xestionar a túa rede. Se non defines límites claros entre servizos, van pisarse uns aos outros.

A regra que me quedou gravada: cando instales algo novo, revisa que quere controlar ademais do que ti lle pediches. Le os flags. Le os defaults. E se algo toca DNS, trátao co respecto que merece. Porque DNS é a base de todo. Se DNS falla, nada funciona.

---

*Se queres ver como está montado o resto do homelab, mira o [caso de estudo do Homelab](/gl/projects/homelab/).*
