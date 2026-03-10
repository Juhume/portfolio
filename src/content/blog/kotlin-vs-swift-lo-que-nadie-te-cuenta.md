---
title: "Kotlin vs Swift: lo que nadie te cuenta"
description: "Después de trabajar con ambos en BBVA para apps nativas, estas son las diferencias reales del día a día. No las del tutorial. las del 'llevo tres horas con esto'."
date: 2025-07-22
lang: es
tags: ["código", "mobile"]
category: "profesional"
---

En BBVA trabajé con Kotlin y Swift para desarrollo nativo. No voy a hacer la típica tabla comparativa de features. eso lo encuentras en cualquier artículo de Medium. Voy a contar las diferencias que notas cuando llevas meses trabajando con ambos.

## Build times: la diferencia que más duele

Kotlin con Gradle es lento. No "un poco lento". Lento de verdad. El tipo de lento que te hace plantearte si vale la pena hacer ese cambio de una línea o si mejor esperas a acumular tres más. Gradle cachea, sí, y los builds incrementales ayudan, pero la primera compilación del día en un proyecto grande te da tiempo a prepararte un café. Entero.

Swift con Xcode no es rápido exactamente, pero compila notablemente más rápido en proyectos equivalentes. La diferencia es suficiente para que afecte a tu flujo de trabajo. Cuando compilar tarda menos, experimentas más, pruebas más cosas, y te frustras menos.

## La experiencia del IDE

Android Studio es IntelliJ con skin. Es potente, configurable, y tiene plugins para todo. También come RAM como si no hubiera mañana y cada actualización mayor viene con su propia lotería de bugs.

Xcode es más limitado pero más estable. El autocompletado de Swift es bueno. cuando funciona. Porque a veces, sin razón aparente, decide que tu archivo no existe y deja de sugerir nada. Cierras Xcode, borras DerivedData (el clásico), y vuelve a funcionar. Es un ritual que todo desarrollador iOS conoce.

Honestamente, ninguno de los dos IDEs es perfecto. Pero si tuviera que elegir el que me hace perder menos tiempo en tonterías, diría Xcode por poco. Android Studio tiene más poder, pero ese poder viene con más formas de romperse.

## Null safety: misma idea, distinta filosofía

Kotlin tiene `?` para tipos nullable y el operador Elvis `?:`. Swift tiene Optionals con `if let`, `guard let`, y optional chaining. Los dos resuelven el mismo problema. evitar null pointer exceptions. pero con filosofías distintas.

Kotlin es más permisivo. Puedes vivir con nullables en todas partes y usar `!!` cuando "sabes" que no va a ser null. Spoiler: a veces sí lo es.

Swift te obliga a ser más explícito. `guard let` al principio de la función, y si no hay valor, sales. Es más verboso pero produce código más predecible. Después de trabajar con ambos, prefiero el enfoque de Swift. Te cuesta más escribirlo pero te cuesta menos debuggearlo.

## Comunidad y documentación

La comunidad de Kotlin es enorme, diversificada, y produce contenido constantemente. Stack Overflow, blogs, tutoriales en YouTube. hay respuesta para casi todo.

La comunidad de Swift es más pequeña pero increíblemente dedicada. La documentación oficial de Apple es... inconsistente. Hay guías excelentes y luego hay APIs documentadas con una frase críptica que no ayuda a nadie. Cuando algo no está documentado, acabas leyendo el código fuente de los frameworks. que para ser justos, suele estar bastante limpio.

## Mi opinión (que nadie pidió)

Si pudiera elegir un solo lenguaje para trabajar cada día, elegiría **Kotlin**. No porque sea mejor técnicamente. es un empate muy reñido. sino por el ecosistema. Kotlin Multiplatform está evolucionando rápido, la interop con Java te abre un mundo de librerías, y JetBrains invierte fuerte en el lenguaje.

Pero Swift me parece más *elegante*. Tiene una consistencia en el diseño del lenguaje que Kotlin, por su herencia de JVM, no siempre consigue.

Al final, ambos son lenguajes modernos, seguros, y agradables de usar. La diferencia real está en el ecosistema que los rodea: el IDE, el build system, la comunidad, y los frameworks. Ahí es donde se nota de verdad en qué estás trabajando.
