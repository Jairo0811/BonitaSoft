# BonitaSoft — ISO-815

Proyecto académico independiente para la asignatura **ISO-815 — Integración de Aplicaciones con Tecnología Open Source** de la Universidad APEC (UNAPEC).

## 🎓 Información académica

| Información | Detalle |
|---|---|
| 🏫 Institución | **Universidad APEC (UNAPEC)** |
| 📖 Asignatura | **Integración de Aplicaciones con Tecnología Open Source (ISO-815)** |
| 👨‍🏫 Profesor | **Juan Pablo Valdez Reyes** |
| 📅 Período académico | **Septiembre - Diciembre 2026** |
| 📁 Primer parcial | **BonitaSoft BPM** |

### 👥 Equipo académico original

| 👤 Integrante | 🆔 Matrícula |
|---|---|
| 👨🏻‍💻 Enmanueli Alfonso Rondon Marrero | A00115575 |
| 👨🏻‍💻 Francis Jairo Matias Rosario | A00115261 |
| 👨🏻‍💻 Eliandres Rodriguez Cepeda | A00112070 |
| 👨🏻‍💻 Jorge Alexander Minier Terrero | A00105678 |

> **BonitaSoft corresponde exclusivamente a ISO-815.** No forma parte de ISO-810. En particular, **Eliandres Rodriguez Cepeda participa en ISO-815 y no pertenece a ISO-810**.

> Este repositorio se mantiene separado de [**SOAForge**](https://github.com/Jairo0811/SOA-Forge), aunque ambos comparten contexto académico dentro de ISO-815.

## 🧭 Continuidad académica

BonitaSoft participa en tres relaciones académicas verificables dentro de la colección UNAPEC: continuidad por estudiante, continuidad por profesor y coincidencia paralela de equipo en ISO-815.

### 👥 Continuidad por estudiante

**Eliandres Rodriguez Cepeda (A00112070)** participó previamente junto a Francis Jairo Matias Rosario en [**Kognia**](https://github.com/Jairo0811/Kognia), correspondiente a **Gestión de Sitios Web (ISO-700)** durante **Mayo - Agosto 2024**. En **Septiembre - Diciembre 2026**, ambos vuelven a coincidir en dos entregas distintas de **ISO-815**: BonitaSoft y el track open source de SOAForge.

| Orden | Asignatura | Proyecto | Período |
|---:|---|---|---|
| 1 | Gestión de Sitios Web (ISO-700) | [**Kognia**](https://github.com/Jairo0811/Kognia) | Mayo - Agosto 2024 |
| 2 | Integración de Aplicaciones con Tecnología Open Source (ISO-815) | [**SOAForge**](https://github.com/Jairo0811/SOA-Forge) | Septiembre - Diciembre 2026 |
| 3 | Integración de Aplicaciones con Tecnología Open Source (ISO-815) | **BonitaSoft** | Septiembre - Diciembre 2026 |

Las filas 2 y 3 corresponden al **mismo período académico y a proyectos paralelos**, no a una secuencia temporal entre SOAForge y BonitaSoft. **Eliandres participa únicamente en ISO-815; no se le atribuye participación en ISO-810.**

### 👨‍🏫 Continuidad por profesor

El profesor **Juan Pablo Valdez Reyes** impartió previamente **Desarrollo de Software con Tecnología Open Source 2 (ISO-715)**, asignatura asociada a [**RentCarRD**](https://github.com/Jairo0811/RentCarRD), durante **Mayo - Agosto 2026**. En el período siguiente aparece como profesor de **ISO-810** e **ISO-815** en SOAForge y de **ISO-815** en BonitaSoft.

| Orden | Asignatura | Proyecto | Período |
|---:|---|---|---|
| 1 | Desarrollo de Software con Tecnología Open Source 2 (ISO-715) | [**RentCarRD**](https://github.com/Jairo0811/RentCarRD) | Mayo - Agosto 2026 |
| 2 | Integración de Aplicaciones con Tecnología Propietaria (ISO-810) | [**SOAForge**](https://github.com/Jairo0811/SOA-Forge) | Septiembre - Diciembre 2026 |
| 3 | Integración de Aplicaciones con Tecnología Open Source (ISO-815) | [**SOAForge**](https://github.com/Jairo0811/SOA-Forge) | Septiembre - Diciembre 2026 |
| 4 | Integración de Aplicaciones con Tecnología Open Source (ISO-815) | **BonitaSoft** | Septiembre - Diciembre 2026 |

Esta relación es **docente y formativa**. No implica que los proyectos sean versiones o dependencias técnicas entre sí.

### 🔀 Relación paralela con SOAForge en ISO-815

BonitaSoft y el track **ISO-815** de SOAForge comparten durante **Septiembre - Diciembre 2026**:

- la misma asignatura: **Integración de Aplicaciones con Tecnología Open Source (ISO-815)**;
- el mismo profesor: **Juan Pablo Valdez Reyes**;
- el mismo equipo de cuatro integrantes: Enmanueli Alfonso Rondon Marrero, Francis Jairo Matias Rosario, Eliandres Rodriguez Cepeda y Jorge Alexander Minier Terrero.

La coincidencia es **académica y paralela**. BonitaSoft y SOAForge siguen siendo repositorios y proyectos independientes. El track **ISO-810 de SOAForge tiene un equipo diferente de tres integrantes y no incluye a Eliandres Rodriguez Cepeda**.

## 🎯 Objetivo

Modelar, implementar y demostrar un proceso de negocio real mediante BPMN y Bonita, incluyendo tareas humanas, reglas de decisión, formularios, integración con servicios y trazabilidad del proceso.

## 🔄 Flujo de referencia

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

## 🗂️ Estructura

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

## 🗺️ Alcance inicial — Fase 0

- Definición académica del proyecto.
- Organización del repositorio.
- Selección del enfoque BPM.
- Definición de arquitectura documental.
- Preparación de carpetas para BPMN, formularios, conectores y evidencias.
- Roadmap por fases.

## 📊 Estado

**Fase 0 — Inicialización del proyecto.**

Consulta [`docs/ROADMAP.md`](docs/ROADMAP.md) para el plan de desarrollo.
