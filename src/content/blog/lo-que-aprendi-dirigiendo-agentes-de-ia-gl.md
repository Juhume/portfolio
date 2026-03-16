---
title: "O que aprendín dirixindo axentes de IA antes de saber programar"
description: "Dirixín un sistema multi-axente para construír proxectos reais sen escribir unha liña de código. O que iso me ensinou sobre arquitectura, produto e as miñas propias limitacións."
date: 2025-12-10
lang: gl
canonicalSlug: "lo-que-aprendi-dirigiendo-agentes-de-ia"
tags: ["produto", "aprendizaxe", "ia"]
category: "profesional"
---

Vou contar algo que non é cómodo de admitir: durante meses, construín proxectos de software reais—un framework completo, un dashboard de control, ferramentas de automatización—sen escribir unha soa liña de código eu mesmo.

Usei un sistema multi-axente de IA chamado OpenClaw. Varios axentes especializados traballando en paralelo: un para frontend, outro para backend, outro para infraestrutura. E eu, no medio, dirixindo. Coma un director de orquestra que non sabe tocar ningún instrumento.

## O que funcionou sorprendentemente ben

Dirixir axentes de IA para construír software require algo que non esperaba: **pensamento de produto**. Non podes dicirlle a un axente "fai unha app bonita". Tes que descompoñer o problema en pezas, definir interfaces entre compoñentes, anticipar casos límite e comunicar exactamente o que necesitas.

Con **Orquesta**, un framework para orquestrar axentes, aprendín a pensar en arquitectura. Como se comunican os módulos. Onde vai o estado. Que pasa cando un axente falla a metade dunha tarefa. Son problemas de enxeñaría de verdade, e resolvelos—aínda que fose a través de prompts en vez de código—obrigoume a pensar coma un enxeñeiro.

Con **Mission Control**, o dashboard para visualizar e controlar os axentes, aprendín sobre UX. Que información é importante en tempo real. Como presentar logs de forma que un humano poida entendelos rápido. Como facer que un sistema complexo se sinta manexábel.

## Pero había un oco enorme

Aquí vén a parte incómoda. Por moito que soubese *que* construír e *como* debería funcionar, non sabía *como* se construía realmente. Cando un axente xeraba un compoñente React, eu revisaba o resultado pero non entendía por que usaba `useEffect` en vez de `useMemo`. Cando vía un `docker-compose.yml` con redes custom, asentía como se soubese o que significaba `driver: bridge`.

Era coma un director de cine que sabe contar historias pero non entende como funciona a cámara. Podes facer cousas boas así, pero tes un teito. E o peor: cando algo se rompía de verdade—un bug sutil, un problema de rendemento, unha race condition—dependía completamente dos axentes para arranxalo. Non tiña a capacidade de diagnosticar nin de corrixir nada por min mesmo.

Iso xera unha sensación que coñezo ben: **síndrome do impostor**. Pero esta vez era diferente. Non era o impostor que cre que non é dabondo bo—era o impostor que sabe que lle falta algo concreto e medíbel.

## O que me ensinou sobre sistemas

A pesar das limitacións, o proceso deixoume algo valioso. Pensar en sistemas enteiros en vez de ficheiros soltos. Entender que a arquitectura importa máis que o código individual. Que o mellor código do mundo non serve se o sistema está mal deseñado.

Aprendín que un bo prompt para un axente de IA é, na esencia, unha boa especificación técnica. Clara, concreta, con contexto dabondo e con criterios de aceptación definidos. Se sabes escribir bos prompts, probabelmente sabes escribir bos tickets de Jira. E viceversa.

Tamén aprendín que **a comunicación entre axentes é o problema máis difícil**—igual que entre persoas nun equipo real. Cando sincronizar, cando traballar en paralelo, como resolver conflitos cando dous axentes modifican o mesmo ficheiro.

## Por que agora estou aprendendo a programar

Todo o anterior foi útil. Pero chegou un punto no que dirixir sen entender me frustraba máis do que me satisfacía. Quero ser capaz de ler un erro de TypeScript e saber que significa. Quero poder abrir un PR e ter unha opinión informada sobre a implementación, non só sobre o resultado.

Así que estou aprendendo. Dende cero, con disciplina, unha hora ao día como mínimo. JavaScript primeiro, logo React, logo TypeScript. Non para deixar de usar axentes de IA—son unha ferramenta brutal—senón para usalos de verdade. Para ser o enxeñeiro que dirixe, non o turista que sinala.

A ironía é que dirixir axentes foi o que me fixo entender exactamente *que* necesitaba aprender. Non comezo de cero en canto a coñecemento de sistemas. Comezo de cero en canto a escribir o código coas miñas propias mans.

E iso, aínda que dá vertixe, tamén mola bastante.

---

*Se queres ver un dos proxectos que construín dirixindo axentes, mira o [caso de estudo do Homelab](/gl/projects/homelab/).*
