# 1. Introducción a SOA

> Proyecto Primer Parcial — ISO-815 — Integración de Aplicaciones con Tecnología Open Source

## ¿Qué es SOA?

**SOA (Service-Oriented Architecture / Arquitectura Orientada a Servicios)** es un enfoque arquitectónico en el que las capacidades de negocio y técnicas se exponen como servicios con contratos e interfaces bien definidos. El objetivo es permitir que aplicaciones heterogéneas colaboren sin quedar acopladas a una implementación concreta.

Una arquitectura SOA suele apoyarse en principios como:

- **Bajo acoplamiento:** el consumidor conoce el contrato del servicio, no sus detalles internos.
- **Interoperabilidad:** sistemas construidos con tecnologías diferentes pueden intercambiar información.
- **Reutilización:** una capacidad puede ser consumida por varios procesos o aplicaciones.
- **Contratos claros:** entradas, salidas, errores y reglas de uso deben ser explícitos.
- **Composición y orquestación:** varios servicios pueden coordinarse para resolver un proceso mayor.
- **Abstracción:** la complejidad interna del proveedor queda oculta al consumidor.

## SOA e integración de aplicaciones

En una organización es común encontrar ERP, CRM, directorios de identidad, bases de datos, APIs, sistemas documentales y aplicaciones heredadas. SOA busca que esas capacidades puedan integrarse mediante interfaces estables en lugar de conexiones ad hoc entre cada par de sistemas.

```text
Aplicación / Usuario
        ↓
Proceso de negocio
        ↓
┌────────────┬────────────┬──────────────┐
│ Servicio A │ Servicio B │ Servicio C   │
│ Identidad  │ Documentos │ Notificación │
└────────────┴────────────┴──────────────┘
```

## Relación con Bonita

Bonita puede participar en una solución SOA principalmente como **capa de orquestación de procesos**. El proceso BPMN coordina tareas humanas y automatizadas y puede consumir servicios externos mediante conectores, especialmente APIs REST. La plataforma también expone APIs para que otras aplicaciones interactúen con el runtime.

Por tanto, Bonita no sustituye necesariamente los sistemas existentes: puede coordinarlos dentro de un flujo de negocio trazable.

## Ejemplo para ISO-815

Una solicitud de acceso a un sistema puede combinar:

1. Captura de la solicitud en un formulario.
2. Validación de datos.
3. Aprobación humana.
4. Decisión BPMN.
5. Llamada REST al servicio que registra o aprovisiona el acceso.
6. Registro del resultado y cierre del caso.

En este ejemplo, BPM define **cuándo** debe ocurrir cada actividad y SOA define **cómo** se consumen capacidades desacopladas.

## Conclusión

SOA aporta la estructura de integración basada en servicios; BPM aporta la gestión explícita del proceso. Bonita conecta ambos conceptos al permitir modelar el flujo, incorporar usuarios y consumir servicios desde un mismo proceso.

## Fuentes

- Bonita Documentation — Bonita components: https://documentation-bonita.netlify.app/bonita/2025.2/bonita-overview/bonita-bpm-overview
- Bonita Documentation — REST connectors: https://documentation.bonitasoft.com/bonita/2024.1/process/rest-connector
- Bonita Documentation — Platform extensibility: https://documentation-bonita.netlify.app/bonita/2025.2/software-extensibility/software-extensibility
