---
title: "Offline-first is not just caching"
description: "What I learned building an app that actually works offline: IndexedDB, sync, conflicts, and E2E encryption."
date: 2025-10-05
lang: en
canonicalSlug: "offline-first-no-es-solo-cache"
tags: ["arquitectura", "offline-first", "indexeddb"]
category: "profesional"
---

When I started building Espejo, I thought "offline-first" meant slapping on a service worker and caching API responses. I was wrong.

## The real problem

Caching is trivial. The hard part is making an app **fully functional** without a connection: creating entries, editing them, deleting them, and having everything sync up when the network comes back.

IndexedDB (with Dexie as a wrapper) became the **source of truth**. The server is just an optional mirror for syncing across devices. This flips the usual mental model: the app doesn't "ask the server for data." The app has the data and, when possible, shares it.

## Sync + encryption: the tricky combo

Every entry is encrypted with AES-256-GCM before leaving the browser. The server only sees opaque blobs. This means you can't merge on the server: it can't read the data.

The solution: **last-write-wins** with soft-delete and timestamps. It's not perfect, but for a personal journal, it's enough. The user can always check their local change history. Every entry carries an `updatedAt` field that gets compared during sync. If there's a conflict, the most recent timestamp wins and the other is kept as a previous version locally.

## The problems no tutorial covers

Having real users rely on the app offline forced me to solve scenarios I couldn't find documented anywhere:

### Password change while offline

What happens if the user changes their password on one device and then opens the other one offline? The encryption key derives from the password, so the second device has a stale key.

The solution was to separate the encryption key from the password. The master key is generated once and stored encrypted with a password-derived key (PBKDF2). When you change your password, only the master key wrapper gets re-encrypted, not every entry. The second device receives the new master key on the next sync and re-derives without touching the data.

### IndexedDB corruption

Yes, it happens. An unexpected browser close, a system update, or just bad luck. And when IndexedDB gets corrupted, you lose everything that wasn't synced.

The defense: a per-entry checksum system. Every time a write to IndexedDB occurs, a hash of the encrypted content is generated. On read, it's verified. If it doesn't match, the entry is flagged as corrupt and recovery from the server is attempted on the next sync. On top of that, a periodic automatic export to a downloadable blob serves as an emergency backup.

### Schema migration with encrypted data

Dexie handles IndexedDB migrations with versions, but when the data is encrypted, you can't just transform it in a migration callback. You don't have access to plaintext content during the schema upgrade.

The solution: a `schemaVersion` field in the (unencrypted) metadata of each entry. When the app detects an entry with an old version, it decrypts, transforms, re-encrypts, and updates. It's a lazy migration: it happens entry by entry as they're accessed, not in bulk. Slower on first load, but it doesn't block the IndexedDB schema migration.

## How it changed the way I design

After building this, I think differently about any app. The question is no longer "does it need to work offline?" but "what state is local and what state is remote?" Even in online apps, that separation produces more resilient architectures.

Real offline-first isn't a feature, it's an architecture. It changes how you think about state, persistence, and conflict resolution. It's more work, but the result is an app that **always responds**: no spinners, no network errors, no "try again later."

---

*If you want to see the full architecture in context, check out the [Espejo case study](/en/projects/espejo/).*
