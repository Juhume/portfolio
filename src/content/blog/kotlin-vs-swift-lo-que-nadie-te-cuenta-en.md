---
title: "Kotlin vs Swift: what nobody tells you"
description: "After working with both at BBVA for native apps, these are the real day-to-day differences. Not the tutorial kind—the 'I've been stuck on this for three hours' kind."
date: 2025-07-22
lang: en
canonicalSlug: "kotlin-vs-swift-lo-que-nadie-te-cuenta"
tags: ["código", "mobile"]
---

At BBVA I worked with Kotlin and Swift for native development. I'm not going to do the typical feature comparison table—you can find that in any Medium article. I'm going to talk about the differences you actually notice after months of working with both.

## Build times: the difference that hurts the most

Kotlin with Gradle is slow. Not "a bit slow." Genuinely slow. The kind of slow that makes you wonder if it's worth making that one-line change or if you should wait until you've accumulated three more. Gradle caches, sure, and incremental builds help, but the first build of the day on a large project gives you enough time to make a full cup of coffee.

Swift with Xcode isn't exactly fast, but it compiles noticeably faster on equivalent projects. The difference is enough to affect your workflow. When compiling takes less time, you experiment more, try more things, and get less frustrated.

## The IDE experience

Android Studio is IntelliJ with a skin. It's powerful, configurable, and has plugins for everything. It also eats RAM like there's no tomorrow, and every major update comes with its own bug lottery.

Xcode is more limited but more stable. Swift autocompletion is good—when it works. Because sometimes, for no apparent reason, it decides your file doesn't exist and stops suggesting anything. You close Xcode, delete DerivedData (the classic ritual), and it works again. Every iOS developer knows this routine.

Honestly, neither IDE is perfect. But if I had to pick the one that wastes less of my time on nonsense, I'd say Xcode by a narrow margin. Android Studio has more power, but that power comes with more ways to break.

## Null safety: same idea, different philosophy

Kotlin has `?` for nullable types and the Elvis operator `?:`. Swift has Optionals with `if let`, `guard let`, and optional chaining. Both solve the same problem—avoiding null pointer exceptions—but with different philosophies.

Kotlin is more permissive. You can live with nullables everywhere and use `!!` when you "know" it won't be null. Spoiler: sometimes it is.

Swift forces you to be more explicit. `guard let` at the top of the function, and if there's no value, you exit. It's more verbose but produces more predictable code. After working with both, I prefer Swift's approach. It costs you more to write, but it costs you less to debug.

## Community and documentation

Kotlin's community is huge, diverse, and constantly producing content. Stack Overflow, blogs, YouTube tutorials—there's an answer for almost everything.

Swift's community is smaller but incredibly dedicated. Apple's official documentation is... inconsistent. There are excellent guides, and then there are APIs documented with a cryptic one-liner that helps no one. When something isn't documented, you end up reading the framework source code—which, to be fair, is usually pretty clean.

## My opinion (that nobody asked for)

If I could pick just one language to work with every day, I'd choose **Kotlin**. Not because it's technically better—it's a very close tie—but because of the ecosystem. Kotlin Multiplatform is evolving fast, Java interop opens up a world of libraries, and JetBrains is investing heavily in the language.

But Swift strikes me as more *elegant*. There's a consistency in the language design that Kotlin, due to its JVM heritage, doesn't always achieve.

In the end, both are modern, safe, and pleasant languages to use. The real difference lies in the ecosystem surrounding them: the IDE, the build system, the community, and the frameworks. That's where you truly feel what you're working with.
