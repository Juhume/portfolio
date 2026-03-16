---
title: "Migrating data with zero downtime on a home server"
description: "My NAS had one rule: never go down. Then I needed to move its most critical data to a new drive. This is how I did it without breaking anything."
date: 2026-01-05
lang: en
canonicalSlug: "migrar-datos-sin-downtime-en-un-servidor-casero"
tags: ["infra", "homelab", "devops"]
category: "profesional"
---

My NAS had one rule: never go down. Then I needed to move its most critical data to a new drive.

## The context

The NAS started with a mechanical hard drive (volume1). For movies, music, and backups, it works fine. But over time I kept adding services that write heavily to disk. Home Assistant with its SQLite database, OpenClaw with its state, Prometheus with metrics. All running on an HDD.

And it showed. Home Assistant took longer and longer to load history. Some automations fired with delays. Dashboards pulling historical data were slow. The bottleneck was clear: disk I/O.

So I bought an SSD and mounted it as volume2. The plan seemed simple. move the databases from HDD to SSD. What wasn't so simple was doing it without shutting down the NAS. Because the NAS isn't just my file server. It's the home DNS, the home automation manager, the media server. If I shut it down, the house goes dark. literally, because the smart lights depend on Home Assistant.

## The plan

The strategy was:

1. **Initial rsync**: copy data from HDD to SSD while the service keeps running
2. **Stop the service**: only when data is nearly synced
3. **Final rsync**: a quick second pass to copy only the changes
4. **Symlink**: create a symbolic link from the original path to the new location on the SSD
5. **Restart the service**: boots from the new location without knowing anything changed

In theory, each service would be offline for less than 30 seconds. The rest of the NAS would keep running normally.

## The gotchas

The theory was nice. Practice had its moments.

**SQLite and locks.** If you rsync a SQLite database while the service is writing, you might copy a corrupt file. The first pass is a "dirty" copy. you can't rely on it alone. That's why you need to stop the service and do a clean second pass. That final rsync is the one that matters.

**Docker volume paths.** Some services ran in Docker with mounted volumes. Moving the file isn't enough. you need to update the `docker-compose.yml` or make sure the symlink sits at the path Docker expects. Docker doesn't follow symlinks inside bind mounts unless you tell it to. I hit a "file not found" error before I understood that.

**Systemd user services.** OpenClaw and other services ran as user-level systemd services. Stopping them required `systemctl --user stop`, doing the migration, then `systemctl --user start`. Simple, but you need to remember it's not root's systemd.

## The result

I migrated Home Assistant, OpenClaw, and Prometheus in one afternoon. Each service was offline for 15 to 30 seconds. The rest of the NAS kept running the entire time. Plex kept serving movies, AdGuard kept filtering DNS, the network didn't notice a thing.

The performance improvement was massive. Home Assistant's history view that used to take 8 seconds now loads in under one. SQLite writes stopped being a bottleneck.

## The lesson

Plan migrations like production deployments. Have a rollback plan. for me that was simply deleting the symlink and pointing back to the original path on the HDD. Test the symlinks before cutting over. And don't rush. the extra 30 minutes you spend checking everything saves you hours of debugging at 3AM.

---

*If you want to see the full homelab architecture, check out the [Homelab case study](/en/projects/homelab/).*
