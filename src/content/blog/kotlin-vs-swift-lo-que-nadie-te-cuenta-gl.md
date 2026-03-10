---
title: "Kotlin vs Swift: o que ninguén che conta"
description: "Despois de traballar con ambos en BBVA para apps nativas, estas son as diferenzas reais do día a día. Non as do titorial, senón as do 'levo tres horas con isto'."
date: 2025-07-22
lang: gl
canonicalSlug: "kotlin-vs-swift-lo-que-nadie-te-cuenta"
tags: ["código", "mobile"]
---

En BBVA traballei con Kotlin e Swift para desenvolvemento nativo. Non vou facer a típica táboa comparativa de features—iso atópalo en calquera artigo de Medium. Vou contar as diferenzas que notas cando levas meses traballando con ambos.

## Build times: a diferenza que máis doe

Kotlin con Gradle é lento. Non "un pouco lento". Lento de verdade. O tipo de lento que che fai pensar se paga a pena facer ese cambio dunha liña ou se mellor esperas a acumular tres máis. Gradle cachea, si, e os builds incrementais axudan, pero a primeira compilación do día nun proxecto grande dáche tempo a preparar un café. Enteiro.

Swift con Xcode non é rápido exactamente, pero compila notabelmente máis rápido en proxectos equivalentes. A diferenza é dabondo para que afecte ao teu fluxo de traballo. Cando compilar tarda menos, experimentas máis, probas máis cousas e frustraste menos.

## A experiencia do IDE

Android Studio é IntelliJ con skin. É potente, configurábel e ten plugins para todo. Tamén come RAM como se non houbese mañá e cada actualización maior vén coa súa propia lotaría de bugs.

Xcode é máis limitado pero máis estábel. O autocompletado de Swift é bo—cando funciona. Porque ás veces, sen razón aparente, decide que o teu ficheiro non existe e deixa de suxerir nada. Pechas Xcode, borras DerivedData (o clásico) e volve funcionar. É un ritual que todo desenvolvedor iOS coñece.

Honestamente, ningún dos dous IDEs é perfecto. Pero se tivese que elixir o que me fai perder menos tempo en parviadas, diría Xcode por pouco. Android Studio ten máis poder, pero ese poder vén con máis formas de romperse.

## Null safety: mesma idea, distinta filosofía

Kotlin ten `?` para tipos nullable e o operador Elvis `?:`. Swift ten Optionals con `if let`, `guard let` e optional chaining. Os dous resolven o mesmo problema—evitar null pointer exceptions—pero con filosofías distintas.

Kotlin é máis permisivo. Podes vivir con nullables en todas partes e usar `!!` cando "sabes" que non vai ser null. Spoiler: ás veces si que o é.

Swift obrígate a ser máis explícito. `guard let` ao principio da función, e se non hai valor, saes. É máis verboso pero produce código máis predecíbel. Despois de traballar con ambos, prefiro o enfoque de Swift. Cústache máis escribilo pero cústache menos depuralo.

## Comunidade e documentación

A comunidade de Kotlin é enorme, diversificada e produce contido constantemente. Stack Overflow, blogs, titoriais en YouTube—hai resposta para case todo.

A comunidade de Swift é máis pequena pero incriblemente dedicada. A documentación oficial de Apple é... inconsistente. Hai guías excelentes e logo hai APIs documentadas cunha frase críptica que non axuda a ninguén. Cando algo non está documentado, acabas lendo o código fonte dos frameworks—que para ser xustos, adoita estar bastante limpo.

## A miña opinión (que ninguén pediu)

Se puidese elixir un só linguaxe para traballar cada día, elixiría **Kotlin**. Non porque sexa mellor tecnicamente—é un empate moi reñido—senón polo ecosistema. Kotlin Multiplatform está evolucionando rápido, a interop con Java ábreche un mundo de librarías, e JetBrains inviste forte na linguaxe.

Pero Swift paréceme máis *elegante*. Ten unha consistencia no deseño da linguaxe que Kotlin, pola súa herdanza de JVM, non sempre consegue.

Ao final, ambos son linguaxes modernos, seguros e agradábeis de usar. A diferenza real está no ecosistema que os rodea: o IDE, o build system, a comunidade e os frameworks. Aí é onde se nota de verdade en que estás traballando.
