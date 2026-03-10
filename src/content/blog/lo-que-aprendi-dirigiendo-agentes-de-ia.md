---
title: "Lo que aprendí dirigiendo agentes de IA antes de saber programar"
description: "Dirigí un sistema multi-agente para construir proyectos reales sin escribir una línea de código. Lo que eso me enseñó sobre arquitectura, producto y mis propias limitaciones."
date: 2025-12-04
lang: es
tags: ["producto", "aprendizaje", "ia"]
category: "profesional"
---

Voy a contar algo que no es cómodo de admitir: durante meses, construí proyectos de software reales. un framework completo, un dashboard de control, herramientas de automatización. sin escribir una sola línea de código yo mismo.

Usé un sistema multi-agente de IA llamado OpenClaw. Varios agentes especializados trabajando en paralelo: uno para frontend, otro para backend, otro para infraestructura. Y yo, en medio, dirigiendo. Como un director de orquesta que no sabe tocar ningún instrumento.

## Lo que funcionó sorprendentemente bien

Dirigir agentes de IA para construir software requiere algo que no esperaba: **pensamiento de producto**. No puedes decirle a un agente "haz una app bonita". Tienes que descomponer el problema en piezas, definir interfaces entre componentes, anticipar casos límite, y comunicar exactamente lo que necesitas.

Con **Orquesta**, un framework para orquestar agentes, aprendí a pensar en arquitectura. Cómo se comunican los módulos. Dónde va el estado. Qué pasa cuando un agente falla a mitad de una tarea. Son problemas de ingeniería de verdad, y resolverlos. aunque fuera a través de prompts en vez de código. me obligó a pensar como un ingeniero.

Con **Mission Control**, el dashboard para visualizar y controlar los agentes, aprendí sobre UX. Qué información es importante en tiempo real. Cómo presentar logs de forma que un humano pueda entenderlos rápido. Cómo hacer que un sistema complejo se sienta manejable.

## Pero había un hueco enorme

Aquí viene la parte incómoda. Por mucho que supiera *qué* construir y *cómo* debería funcionar, no sabía *cómo* se construía realmente. Cuando un agente generaba un componente React, yo revisaba el resultado pero no entendía por qué usaba `useEffect` en vez de `useMemo`. Cuando veía un `docker-compose.yml` con redes custom, asentía como si supiera lo que significaba `driver: bridge`.

Era como un director de cine que sabe contar historias pero no entiende cómo funciona la cámara. Puedes hacer cosas buenas así, pero tienes un techo. Y lo peor: cuando algo se rompía de verdad. un bug sutil, un problema de rendimiento, una race condition. dependía completamente de los agentes para arreglarlo. No tenía la capacidad de diagnosticar ni de corregir nada por mí mismo.

Eso genera una sensación que conozco bien: **síndrome del impostor**. Pero esta vez era diferente. No era el impostor que cree que no es suficiente bueno. era el impostor que sabe que le falta algo concreto y medible.

## Lo que me enseñó sobre sistemas

A pesar de las limitaciones, el proceso me dejó algo valioso. Pensar en sistemas enteros en vez de archivos sueltos. Entender que la arquitectura importa más que el código individual. Que el mejor código del mundo no sirve si el sistema está mal diseñado.

Aprendí que un buen prompt para un agente de IA es, en esencia, una buena especificación técnica. Claro, concreto, con contexto suficiente, y con criterios de aceptación definidos. Si sabes escribir buenos prompts, probablemente sabes escribir buenos tickets de Jira. Y viceversa.

También aprendí que **la comunicación entre agentes es el problema más difícil**. igual que entre personas en un equipo real. Cuándo sincronizar, cuándo trabajar en paralelo, cómo resolver conflictos cuando dos agentes modifican el mismo fichero.

## Por qué ahora estoy aprendiendo a programar

Todo lo anterior fue útil. Pero llegó un punto en el que dirigir sin entender me frustraba más de lo que me satisfacía. Quiero ser capaz de leer un error de TypeScript y saber qué significa. Quiero poder abrir un PR y tener una opinión informada sobre la implementación, no solo sobre el resultado.

Así que estoy aprendiendo. Desde cero, con disciplina, una hora al día mínimo. JavaScript primero, luego React, luego TypeScript. No para dejar de usar agentes de IA. son una herramienta brutal. sino para usarlos de verdad. Para ser el ingeniero que dirige, no el turista que señala.

La ironía es que dirigir agentes fue lo que me hizo entender exactamente *qué* necesitaba aprender. No empiezo de cero en cuanto a conocimiento de sistemas. Empiezo de cero en cuanto a escribir el código con mis propias manos.

Y eso, aunque da vértigo, también mola bastante.

---

*Si quieres ver uno de los proyectos que construí dirigiendo agentes, mira el [caso de estudio del Homelab](/es/projects/homelab/).*
