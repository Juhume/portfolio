---
title: "What I learned directing AI agents before knowing how to code"
description: "I directed a multi-agent system to build real projects without writing a single line of code. What that taught me about architecture, product, and my own limitations."
date: 2025-12-04
lang: en
canonicalSlug: "lo-que-aprendi-dirigiendo-agentes-de-ia"
tags: ["producto", "aprendizaje", "ia"]
category: "profesional"
---

I'm going to share something that isn't comfortable to admit: for months, I built real software projects—a complete framework, a control dashboard, automation tools—without writing a single line of code myself.

I used a multi-agent AI system called OpenClaw. Several specialized agents working in parallel: one for frontend, another for backend, another for infrastructure. And me, in the middle, directing. Like an orchestra conductor who doesn't know how to play any instrument.

## What worked surprisingly well

Directing AI agents to build software requires something I didn't expect: **product thinking**. You can't tell an agent "make a nice app." You have to break the problem into pieces, define interfaces between components, anticipate edge cases, and communicate exactly what you need.

With **Orquesta**, a framework for orchestrating agents, I learned to think about architecture. How modules communicate. Where state lives. What happens when an agent fails mid-task. These are real engineering problems, and solving them—even through prompts instead of code—forced me to think like an engineer.

With **Mission Control**, the dashboard for visualizing and controlling agents, I learned about UX. What information matters in real time. How to present logs so a human can parse them quickly. How to make a complex system feel manageable.

## But there was a massive gap

Here's the uncomfortable part. No matter how well I knew *what* to build and *how* it should work, I didn't know *how* it was actually built. When an agent generated a React component, I'd review the result but couldn't understand why it used `useEffect` instead of `useMemo`. When I saw a `docker-compose.yml` with custom networks, I'd nod along as if I knew what `driver: bridge` meant.

It was like a film director who knows how to tell stories but doesn't understand how the camera works. You can make good things that way, but you have a ceiling. And the worst part: when something truly broke—a subtle bug, a performance issue, a race condition—I depended entirely on the agents to fix it. I didn't have the ability to diagnose or correct anything on my own.

That creates a feeling I know well: **impostor syndrome**. But this time it was different. It wasn't the impostor who thinks they're not good enough—it was the impostor who knows they're missing something concrete and measurable.

## What it taught me about systems

Despite the limitations, the process left me with something valuable. Thinking about entire systems instead of individual files. Understanding that architecture matters more than any single piece of code. That the best code in the world is useless if the system is poorly designed.

I learned that a good prompt for an AI agent is, at its core, a good technical specification. Clear, concrete, with enough context, and with defined acceptance criteria. If you can write good prompts, you can probably write good Jira tickets. And vice versa.

I also learned that **communication between agents is the hardest problem**—just like between people on a real team. When to synchronize, when to work in parallel, how to resolve conflicts when two agents modify the same file.

## Why I'm learning to code now

All of the above was useful. But there came a point where directing without understanding frustrated me more than it satisfied me. I want to be able to read a TypeScript error and know what it means. I want to open a PR and have an informed opinion about the implementation, not just about the result.

So I'm learning. From scratch, with discipline, at least one hour a day. JavaScript first, then React, then TypeScript. Not to stop using AI agents—they're a phenomenal tool—but to use them for real. To be the engineer who directs, not the tourist who points.

The irony is that directing agents was what made me understand exactly *what* I needed to learn. I'm not starting from zero when it comes to systems knowledge. I'm starting from zero when it comes to writing code with my own hands.

And that, even though it's daunting, is also pretty exciting.

---

*If you want to see one of the projects I built by directing agents, check out the [Homelab case study](/en/projects/homelab/).*
