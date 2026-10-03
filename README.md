# BonitaSoft — ISO-815

Proyecto académico independiente para la asignatura **ISO-815 — Integración de Aplicaciones con Tecnología Open Source** de la Universidad APEC (UNAPEC).

## Datos académicos

- **Asignatura:** ISO-815 — Integración de Aplicaciones con Tecnología Open Source
- **Profesor:** Juan Pablo Valdez Reyes
- **Período académico:** Septiembre–Diciembre 2026
- **Primer parcial:** BonitaSoft BPM

## Integrantes

- Enmanueli Alfonso Rondon Marrero — A00115575
- Francis Jairo Matias Rosario — A00115261
- Eliandres Rodriguez Cepeda — A00112070
- Jorge Alexander Minier Terrero — A00105678

> Este repositorio corresponde exclusivamente al proyecto de **ISO-815** y se mantiene separado de SOA-Forge.

## Objetivo

Modelar, implementar y demostrar un proceso de negocio real mediante BPMN y Bonita, incluyendo tareas humanas, reglas de decisión, formularios, integración con servicios y trazabilidad del proceso.

## Flujo de referencia

```text
Solicitud
   ↓
Validación
   ↓
Aprobación humana
   ↓
Decisión
 ┌───────┴────────┐
 ▼                ▼
Aprobada        Rechazada
 │
 ▼
Integración / Servicio
 │
 ▼
Cierre + Auditoría
```

## Estructura

```text
BonitaSoft/
├── README.md
├── docs/
│   ├── academic/
│   ├── research/
│   ├── architecture/
│   └── ROADMAP.md
├── process/
│   ├── bpmn/
│   ├── forms/
│   └── connectors/
├── demo/
├── assets/
└── .gitignore
```

## Alcance inicial — Fase 0

- Definición académica del proyecto.
- Organización del repositorio.
- Selección del enfoque BPM.
- Definición de arquitectura documental.
- Preparación de carpetas para BPMN, formularios, conectores y evidencias.
- Roadmap por fases.

## Estado

**Fase 0 — Inicialización del proyecto.**

Consulta [`docs/ROADMAP.md`](docs/ROADMAP.md) para el plan de desarrollo.
