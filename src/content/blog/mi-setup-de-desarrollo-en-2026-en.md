---
title: "My development setup in 2026"
description: "A quick, honest rundown of the tools I use for development—no affiliate links, no forced recommendations. Just what works."
date: 2026-02-20
lang: en
canonicalSlug: "mi-setup-de-desarrollo-en-2026"
tags: ["infra", "código", "herramientas"]
category: "profesional"
---

I like seeing other developers' setups. Not just for the hardware—though that too—but to discover tools or workflows I didn't know about. So here's mine, no frills.

## The brain: UGREEN NAS

Everything runs on a UGREEN NAS. It's not an enterprise server rack or a repurposed gaming PC—it's a compact, quiet box with enough power for what I need. Docker runs natively and I manage everything with `docker compose`.

Inside there's a bit of everything: Plex, AdGuard Home, Home Assistant, project databases, and the AI agents I use for development. Each service in its own container, each container with its volumes. When something breaks, `docker compose down && docker compose up -d` and move on.

## Editor: VS Code

I've tried others. I always come back to VS Code. It's fast for its size, the extensions are endless, and the integrated terminal saves me from having another window open.

Essential extensions: ESLint, Prettier, GitLens, and the Catppuccin Mocha theme because coding at 11 PM with a light theme is an act of visual aggression.

## Remote access: Tailscale

This changed how I work. Tailscale creates a mesh VPN between all my devices—laptop, phone, NAS—without opening ports, without configuring anything weird. I'm at a coffee shop and I access my NAS services as if I were at home. SSH into the server, Home Assistant dashboard, whatever.

Zero config, it just works. It's one of those tools that once you try it, you can't understand how you lived without it.

## Operating system: Linux

My daily driver is Ubuntu. After years on macOS, the switch was smoother than I expected. Everything I need runs natively, Docker flies without virtualization layers, and the freedom to configure every corner of the system without anyone putting up guardrails is something you learn to appreciate. Not for everyone, but for development it's hard to ask for more.

## Terminal

Ghostty as the emulator with tmux for persistent sessions. Multiple panes: one with Docker logs, another with the dev server, another for git. Everything visible at a glance.

The shell is zsh with Oh My Zsh and a minimal prompt. No flashy themes with emojis—just the current directory, the git branch, and whether the last command succeeded or failed.

## AI agents

I use OpenClaw as a multi-agent system. I have specialized agents by domain: one for code, another for infrastructure, another for personal tasks. It's not like chatting with ChatGPT—these are agents that execute, that access files, that run commands.

Do they replace knowing how to code? No. But they multiply what you can do, especially when you're learning. It's like having a pair programming buddy who never gets tired and knows more than you about almost everything.

## What I don't use

I don't use Vim or Neovim. Nothing against them, but the learning curve doesn't pay off for my case. I don't use Notion or Obsidian for documenting code—a well-written README and clear comments are enough. I don't use ultrawide monitors—two regular screens and done.

Sometimes the most productive tool isn't the most sophisticated one. It's the one you already know and that doesn't get in your way.

---

*If you want to know more about the NAS and the services running on it, check out the [Homelab case study](/en/projects/homelab/).*
