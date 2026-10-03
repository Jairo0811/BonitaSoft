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

> Este repositorio se mantiene separado de [**SOAForge**](https://github.com/Jairo0811/SOA-Forge). **SOAForge corresponde exclusivamente a ISO-810**, mientras BonitaSoft corresponde exclusivamente a **ISO-815**.

## 🧭 Continuidad académica

BonitaSoft presenta continuidad por estudiante, continuidad por profesor y una relación académica paralela con SOAForge durante el mismo período, pero en **asignaturas diferentes**.

### 👥 Continuidad por estudiante

**Eliandres Rodriguez Cepeda (A00112070)** participó previamente junto a Francis Jairo Matias Rosario en [**Kognia**](https://github.com/Jairo0811/Kognia), correspondiente a **Gestión de Sitios Web (ISO-700)** durante **Mayo - Agosto 2024**. En **Septiembre - Diciembre 2026**, ambos vuelven a coincidir en **BonitaSoft**, correspondiente a **Integración de Aplicaciones con Tecnología Open Source (ISO-815)**.

| Orden | Asignatura | Proyecto | Período |
|---:|---|---|---|
| 1 | Gestión de Sitios Web (ISO-700) | [**Kognia**](https://github.com/Jairo0811/Kognia) | Mayo - Agosto 2024 |
| 2 | Integración de Aplicaciones con Tecnología Open Source (ISO-815) | **BonitaSoft** | Septiembre - Diciembre 2026 |

> **Eliandres participa en BonitaSoft (ISO-815) y no forma parte de SOAForge. SOAForge corresponde a ISO-810.**

### 👨‍🏫 Continuidad por profesor

El profesor **Juan Pablo Valdez Reyes** impartió previamente **Desarrollo de Software con Tecnología Open Source 2 (ISO-715)**, asignatura asociada a [**RentCarRD**](https://github.com/Jairo0811/RentCarRD), durante **Mayo - Agosto 2026**. En el período siguiente aparece como profesor de **SOAForge (ISO-810)** y **BonitaSoft (ISO-815)**.

| Orden | Asignatura | Proyecto | Período |
|---:|---|---|---|
| 1 | Desarrollo de Software con Tecnología Open Source 2 (ISO-715) | [**RentCarRD**](https://github.com/Jairo0811/RentCarRD) | Mayo - Agosto 2026 |
| 2 | Integración de Aplicaciones con Tecnología Propietaria (ISO-810) | [**SOAForge**](https://github.com/Jairo0811/SOA-Forge) | Septiembre - Diciembre 2026 |
| 3 | Integración de Aplicaciones con Tecnología Open Source (ISO-815) | **BonitaSoft** | Septiembre - Diciembre 2026 |

Esta relación es **docente y formativa**. No implica que los proyectos sean versiones o dependencias técnicas entre sí.

### 🔀 Relación paralela con SOAForge

Durante **Septiembre - Diciembre 2026**, BonitaSoft y SOAForge comparten:

- el mismo profesor: **Juan Pablo Valdez Reyes**;
- el mismo período académico;
- tres integrantes en común: **Enmanueli Alfonso Rondon Marrero**, **Francis Jairo Matias Rosario** y **Jorge Alexander Minier Terrero**.

Sin embargo, pertenecen a **asignaturas diferentes**:

- **SOAForge → ISO-810 — Integración de Aplicaciones con Tecnología Propietaria**;
- **BonitaSoft → ISO-815 — Integración de Aplicaciones con Tecnología Open Source**.

**Eliandres Rodriguez Cepeda participa únicamente en BonitaSoft / ISO-815 y no pertenece al equipo de SOAForge / ISO-810.**

## 🎯 Alcance del primer parcial

La **Práctica 3** solicita una investigación sobre BonitaSoft que cubre 11 puntos: SOA, BPM, historia, características, módulos, componentes, competidores, infraestructura para 500 usuarios, elementos SOA, costos para 500 usuarios y aspectos adicionales.

Los 11 puntos están documentados en [`docs/research/`](docs/research/).

Como complemento práctico, el repositorio prepara una demostración BPM para mostrar que Bonita puede actuar como orquestador de personas y servicios, sin convertir la demo en sustituto de la investigación solicitada.

## 🔄 Proceso demostrativo

**Solicitud de acceso a sistema corporativo**:

```text
Solicitud
   ↓
Validación
   ↓
Aprobación humana
   ↓
¿Aprobada?
 ┌────┴──────────────────┐
 ▼                       ▼
No                      Sí
 │                       │
Rechazo             REST /provision
 │                       │
 Fin               Cierre + Auditoría
```

La integración utiliza una API FastAPI local incluida en `demo/mock-api/`.

## 🧪 Complemento técnico

El repositorio incluye:

- modelo BPMN 2.0 de referencia;
- especificación de proceso;
- BDM y contratos propuestos;
- especificación de formularios;
- configuración conceptual del REST Connector;
- Mock API FastAPI;
- Dockerfile;
- pruebas automatizadas;
- GitHub Actions para la Mock API;
- casos de prueba end-to-end;
- runbook de implementación en Bonita Studio;
- guion de demo;
- outline y fuentes de presentación.

## 🧱 Stack tecnológico

> **Estado del stack:** la Mock API y sus pruebas están implementadas y automatizadas. La configuración final del proceso dentro de Bonita Studio todavía requiere ejecución local, por lo que no se presenta como Runtime Verified.

### 🔄 BPM y modelado

<p>
  <img src="https://img.shields.io/badge/Bonita-BPM-7C3AED?style=flat-square" alt="Bonita BPM" />
  <img src="https://img.shields.io/badge/BPMN-2.0-2563EB?style=flat-square" alt="BPMN 2.0" />
</p>

- Bonita / Bonita Studio como plataforma BPM del ejercicio;
- BPMN 2.0 para el proceso de referencia;
- BDM, contratos, formularios, actores y conectores documentados para implementación local.

### ⚙️ Integración y Mock API

<p>
  <img src="https://skillicons.dev/icons?i=python,fastapi" alt="Python y FastAPI" />
  <img src="https://img.shields.io/badge/OpenAPI-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="OpenAPI / Swagger" />
</p>

- Python;
- FastAPI;
- Uvicorn;
- endpoint REST `/provision` para la demostración de integración;
- documentación automática OpenAPI / Swagger.

### 🧪 Calidad y DevOps

<p>
  <img src="https://skillicons.dev/icons?i=docker,git,github,githubactions" alt="Docker, Git, GitHub y GitHub Actions" />
  <img src="https://img.shields.io/badge/pytest-Testing-0A9EDC?style=flat-square&logo=pytest&logoColor=white" alt="pytest" />
</p>

- pytest para la Mock API;
- Docker / Dockerfile para el servicio auxiliar;
- Git / GitHub;
- GitHub Actions mediante `mock-api-ci.yml`.

---

## 🗂️ Estructura

```text
BonitaSoft/
├── .github/workflows/
│   └── mock-api-ci.yml
├── README.md
├── docs/
│   ├── academic/
│   ├── architecture/
│   ├── implementation/
│   ├── research/          # 11 puntos de la práctica
│   └── ROADMAP.md
├── process/
│   ├── bpmn/
│   ├── forms/
│   └── connectors/
├── demo/
│   ├── mock-api/
│   ├── DEMO_SCRIPT.md
│   └── TEST_CASES.md
├── presentation/
│   ├── OUTLINE.md
│   └── SOURCES.md
├── assets/
└── .gitignore
```

## 🚀 Mock API

```bash
cd demo/mock-api
python -m venv .venv
# activar el entorno
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Swagger: `http://localhost:8000/docs`

Pruebas:

```bash
pip install -r requirements-dev.txt
pytest -q
```

## 📊 Estado

| Área | Estado |
|---|---|
| Fase 0 — Inicialización | ✅ Completa |
| Investigación — 11 puntos | ✅ Completa |
| Diseño BPMN y arquitectura | ✅ Preparado |
| FastAPI / integración auxiliar | ✅ Implementada |
| Pruebas de Mock API + CI | ✅ Implementadas |
| Guion / presentación | ✅ Preparados |
| Configuración final en Bonita Studio | 🟡 Requiere ejecución local |
| Evidencias end-to-end de Bonita | 🟡 Pendientes del runtime |

### Importante

No se marca el proyecto como **Runtime Verified** hasta ejecutar el proceso dentro de Bonita Studio. El archivo BPMN del repositorio es un modelo estándar de referencia; la configuración propia de Bonita —BDM, contratos, actores, formularios y connector— debe aplicarse y validarse en Studio siguiendo [`docs/implementation/BONITA_STUDIO_IMPLEMENTATION.md`](docs/implementation/BONITA_STUDIO_IMPLEMENTATION.md).

Consulta [`docs/ROADMAP.md`](docs/ROADMAP.md) para el detalle de fases y gates de cierre.