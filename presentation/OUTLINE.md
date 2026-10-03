# Presentación — BonitaSoft BPM

## Duración sugerida

15–20 minutos + demo.

## Diapositiva 1 — Portada

- BonitaSoft BPM
- ISO-815 — Integración de Aplicaciones con Tecnología Open Source
- Profesor: Juan Pablo Valdez Reyes
- Septiembre–Diciembre 2026
- Integrantes del equipo

## Diapositiva 2 — ¿Qué es SOA?

- Servicios con contratos.
- Bajo acoplamiento.
- Interoperabilidad.
- Reutilización y orquestación.

## Diapositiva 3 — ¿Qué es BPM?

- Gestión del ciclo de vida de procesos.
- Modelar → Ejecutar → Medir → Mejorar.
- Papel de BPMN.

## Diapositiva 4 — Historia de Bonita

- Proyecto original desde inicios de los 2000.
- Bonitasoft fundada en 2009.
- Bonita Open Solution 5 en 2010.
- Bonita 7 / Living Applications en 2015.
- Evolución hacia Maven, Git, CI/CD y Docker.

## Diapositiva 5 — Características

- BPMN.
- Tareas humanas/automáticas.
- BDM.
- Formularios/aplicaciones.
- Connectors y APIs.
- Extensibilidad.

## Diapositiva 6 — Módulos

Studio, Runtime, User Application, Administrator, Super Administrator, Application Directory y BCD.

## Diapositiva 7 — Componentes técnicos

Diagrama por capas: UI → APIs/Contratos → BPMN/BDM/Organización → Engine → Tomcat/Java/RDBMS.

## Diapositiva 8 — Competidores

ProcessMaker, Camunda, Flowable, jBPM/KIE y suites comerciales. Comparar orientación sin afirmar equivalencia exacta.

## Diapositiva 9 — Empresa con 500 usuarios

- Requisitos oficiales mínimos/recomendados.
- Importancia de concurrencia.
- Arquitectura de referencia.
- HA como escenario opcional.

## Diapositiva 10 — Elementos SOA con Bonita

Procesos, forms, pages, BDM, connectors, REST API, extensiones, identidad y monitoreo.

## Diapositiva 11 — Costos

- Community: sin costo de licencia Bonita.
- Subscription: cotización empresarial.
- TCO = licencia + infraestructura + implementación + operación + soporte.
- No inventar un precio de licencia para 500 usuarios.

## Diapositiva 12 — Aspectos adicionales

Seguridad, Git/Maven, Docker, CI/CD, auditoría, separación Dev/QA/Prod y gobernanza.

## Diapositiva 13 — Demo propuesta

```text
Solicitud → Validación → Aprobación humana → Gateway
                                  ├─ Rechazo
                                  └─ Aprobación → REST → Cierre
```

## Diapositiva 14 — Arquitectura de demo

Bonita Runtime → REST Connector → FastAPI Mock Service → respuesta/auditoría.

## Diapositiva 15 — Conclusiones

- Bonita combina BPM con integración.
- Puede orquestar personas y sistemas.
- El dimensionamiento depende de la carga real.
- La edición debe seleccionarse por requisitos empresariales.

## Demo en vivo

Seguir `demo/DEMO_SCRIPT.md`.
