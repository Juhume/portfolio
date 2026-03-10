---
title: "Why I have a server at home"
description: "Not a tutorial. It's the story of why I set up a homelab, what I learned by breaking everything, and why docker compose up became my zen moment."
date: 2025-09-18
lang: en
canonicalSlug: "por-que-tengo-un-servidor-en-casa"
tags: ["infra", "vida", "homelab"]
category: "personal"
---

It all started because Plex kept crashing on a friend's server every two weeks. One day I got fed up, searched "build home server" on YouTube, and three hours later I had a NAS in my Amazon cart. That was the excuse. The real reason was something else.

## Wanting to understand how things work

I've been working in tech for years, but always from the software side. The physical server, the network, DNS, ports—all of that was a black box. Someone in ops would configure it and I'd just make HTTP requests. It bothered me that I didn't understand the layer beneath.

Setting up a homelab forced me to understand all of it. Suddenly I needed to know what a reverse proxy was, why my router wouldn't pass traffic to port 443, and how DHCP actually worked—not the certification exam version, but the "why on earth does this device have the wrong IP" version.

## The joy of breaking things without consequences

At work, breaking something in production means an incident, a call, and a post-mortem. On my server, breaking something means restarting a container and having a coffee while you figure out what went wrong.

I've broken my Home Assistant installation at least four times. Once by updating without checking the changelog. Another time by touching a YAML file and putting a space where it didn't belong—whoever designed a configuration format where indentation matters deserves a special place somewhere.

And then there's the Zigbee dongle. Three hours. Three hours to get a €12 USB stick to talk to a smart bulb. I tried three drivers, two firmwares, and read forums in German through the browser translator. When the bulb finally turned on from the dashboard, I felt something close to what Armstrong must have felt stepping on the Moon. Disproportionate? Yes. But real.

## Control over your own data

I'm not a privacy paranoid, but there's something that bothers me about depending 100% on third-party services for everything. My music, my photos, my notes, my home automations—all in someone else's cloud.

With the homelab, **Plex** serves my movie library. **AdGuard Home** filters ads at the DNS level for every device in the house—including the TV, which was impossible before. **Home Assistant** controls the lights, the thermostat, and alerts me when the bathroom humidity sensor spikes.

Is it more work than paying for Spotify and Google Home? Absolutely. But it's *my* work. And every service I set up teaches me something new.

## The satisfaction of `docker compose up`

There's a moment—when you've spent an hour editing a `docker-compose.yml`, reviewing environment variables, mounting volumes—when you finally type `docker compose up -d` and all the containers come up green. The logs aren't spewing errors. The service responds in the browser.

It's a satisfaction that's hard to explain to someone who hasn't lived it. It's like assembling IKEA furniture and not having leftover pieces. It doesn't sound like much, but when it happens, you celebrate.

## It's not for everyone

I'll be honest: maintaining a homelab takes time, patience, and a high tolerance for frustration. There have been Saturdays where I've spent four hours debugging a network issue that turned out to be a loose Ethernet cable.

But if you enjoy learning by doing, if you like having control over your infrastructure, and if the idea of running your own services on a box under your desk sounds more exciting than intimidating—then you're probably already browsing NAS deals somewhere.

I can't stop recommending it. Not for the utility—though it has plenty—but for everything you learn along the way.

---

*If you want to see how it's set up, check out the [Homelab case study](/en/projects/homelab/).*
