---
title: "The night my DNS fought itself"
description: "Everything worked until it didn't. At 2AM, no device in my house could resolve a domain. This is the story of two DNS services fighting for control."
date: 2025-11-15
lang: en
canonicalSlug: "la-noche-que-mi-dns-se-peleo-consigo-mismo"
tags: ["infra", "homelab", "debugging"]
---

Everything worked until it didn't. At 2AM, no device in my house could resolve a domain.

## The context

I run AdGuard Home on my NAS as the DNS server for the entire network. It's one of the homelab services I value the most. Network-wide ad blocking, custom rewrites to access local services by name instead of IP, and logs for every DNS query. If something tries to phone home to a telemetry domain at 4AM, I see it.

The home router points its DNS at the NAS. Every device on the network gets the NAS as its DNS server via DHCP. Simple, clean, running smoothly for months without touching anything.

## The problem

That day I installed Tailscale on the NAS. For those who don't know, Tailscale creates a mesh VPN between your devices. It lets me access the NAS from outside my home without opening ports or messing with port forwarding.

During the install, I accepted all the defaults. Including `--accept-dns`. That flag tells Tailscale to overwrite the system's DNS configuration with Tailscale's own DNS servers. On a laptop, that might make sense. On a NAS that is the DNS server for your entire house, it's a ticking time bomb.

Here's what happened: Tailscale overwrote the NAS's `/etc/resolv.conf`. AdGuard Home kept running and answering queries, but the NAS itself was no longer asking AdGuard. It was asking Tailscale's DNS. And since the router pointed everything at the NAS, every device in the house ended up resolving through a chain nobody had designed.

Some domains resolved. Others didn't. Local rewrites stopped working entirely. Home Assistant couldn't find my devices by name. The TV couldn't load anything.

## Debugging at 2AM

I noticed the problem because my phone wouldn't load a website. My first thought was "the internet is down." But no. The router had connectivity. It was DNS.

From another machine, an `nslookup google.com` took forever or just timed out. A `dig @192.168.1.100 google.com` (the NAS IP) returned intermittent responses. I opened AdGuard's logs. barely any queries coming in. Something was intercepting DNS traffic before it reached AdGuard.

I checked the NAS. `cat /etc/resolv.conf`. There it was: Tailscale had placed its own nameservers. The NAS, which should use AdGuard for DNS, was asking somewhere else. Two DNS services trying to be the boss. Neither winning.

## The fix

One line:

```bash
tailscale set --accept-dns=false
```

This tells Tailscale to stop touching the system's DNS config. Handle the VPN and nothing else. AdGuard goes back to being the sole DNS authority. I restarted the service, verified `/etc/resolv.conf` pointed where it should, and everything worked again.

Total incident time: about two hours. Actual fix time: 10 seconds.

## The lesson

In a homelab, every service thinks it's the main character. Tailscale wants to manage your DNS. AdGuard wants to manage your DNS. Docker wants to manage your networking. If you don't set clear boundaries between services, they will step on each other.

The rule that stuck with me: when installing something new, check what it wants to control beyond what you asked it to do. Read the flags. Read the defaults. And if something touches DNS, treat it with the respect it deserves. Because DNS is the foundation. If DNS fails, nothing works.

---

*If you want to see how the rest of the homelab is set up, check out the [Homelab case study](/en/projects/homelab/).*
