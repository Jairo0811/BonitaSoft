<div align="center">


<p align="center">
<img src="https://img.shields.io/badge/UNAPEC-ISO--815-003B70?style=for-the-badge" alt="UNAPEC ISO-815" />
</p>


<img src="https://img.shields.io/badge/Primer%20Parcial-BonitaSoft%20BPM-7C3AED?style=for-the-badge" alt="Primer parcial: BonitaSoft BPM" />
<img src="https://img.shields.io/badge/Estado-Demo%20funcional-14B8A6?style=for-the-badge" alt="Demo funcional" />

<br/><br/>

<a href="https://github.com/Jairo0811/BonitaSoft/actions/workflows/mock-api-ci.yml">
  <img src="https://github.com/Jairo0811/BonitaSoft/actions/workflows/mock-api-ci.yml/badge.svg" alt="Mock API CI" />
</a>
<a href="https://github.com/Jairo0811/BonitaSoft/actions/workflows/dashboard-react-ci.yml">
  <img src="https://github.com/Jairo0811/BonitaSoft/actions/workflows/dashboard-react-ci.yml/badge.svg" alt="Dashboard React CI" />
</a>

<br/><br/>

**BPM · BPMN · REST Integration · Workflow Dashboard**

</div>

## 📌 Descripción

**BonitaSoft** es el proyecto académico independiente del primer parcial de **Integración de Aplicaciones con Tecnología Open Source (ISO-815)** en la Universidad APEC (UNAPEC).

El trabajo combina la investigación requerida sobre **Bonita / BonitaSoft BPM** con una demostración técnica reproducible: un proceso de solicitud de acceso, una API FastAPI que modela el workflow y un dashboard React conectado al flujo local.

> **BonitaSoft corresponde exclusivamente a ISO-815.** [**SOAForge**](https://github.com/Jairo0811/SOA-Forge) corresponde exclusivamente a **ISO-810**.

---

## 🎓 Información académica

| Información | Detalle |
|---|---|
| 🏫 Institución | **Universidad APEC (UNAPEC)** |
| 📖 Asignatura | **Integración de Aplicaciones con Tecnología Open Source (ISO-815)** |
| 👨‍🏫 Profesor | **Juan Pablo Valdez Reyes** |
| 📅 Período académico | **Septiembre - Diciembre 2026** |
| 📁 Primer parcial | **BonitaSoft BPM** |
| 🧪 Entrega complementaria | **Investigación + demo BPM/API + dashboard funcional** |

### 👥 Equipo académico original

| 👤 Integrante | 🆔 Matrícula |
|---|---|
| 👨🏻‍💻 Jorge Alexander Minier Terrero | A00105678 |
| 👨🏻‍💻 Eliandres Rodriguez Cepeda | A00112070 |
| 👨🏻‍💻 Francis Jairo Matias Rosario | A00115261 |
| 👨🏻‍💻 Enmanueli Alfonso Rondon Marrero | A00115575 |

> **Eliandres Rodriguez Cepeda participa en BonitaSoft / ISO-815 y no pertenece a SOAForge / ISO-810.**

---

## 🧭 Continuidad académica

### 👥 Continuidad por estudiante

**Eliandres Rodriguez Cepeda (A00112070)** participó previamente junto a Francis Jairo Matias Rosario en [**Kognia**](https://github.com/Jairo0811/Kognia), correspondiente a **Gestión de Sitios Web (ISO-700)** durante **Mayo - Agosto 2024**. Ambos vuelven a coincidir en **BonitaSoft / ISO-815** durante **Septiembre - Diciembre 2026**.

| Orden | Asignatura | Proyecto | Período |
|---:|---|---|---|
| 1 | Gestión de Sitios Web (ISO-700) | [**Kognia**](https://github.com/Jairo0811/Kognia) | Mayo - Agosto 2024 |
| 2 | Integración de Aplicaciones con Tecnología Open Source (ISO-815) | **BonitaSoft** | Septiembre - Diciembre 2026 |

La relación es **académica y cronológica**. Kognia y BonitaSoft son proyectos independientes.

### 👨‍🏫 Continuidad por profesor

El profesor **Juan Pablo Valdez Reyes** impartió previamente **Desarrollo de Software con Tecnología Open Source 2 (ISO-715)**, asociada a [**RentCarRD**](https://github.com/Jairo0811/RentCarRD), durante **Mayo - Agosto 2026**. En el período siguiente imparte **SOAForge / ISO-810** y **BonitaSoft / ISO-815**.

| Orden | Asignatura | Proyecto | Período |
|---:|---|---|---|
| 1 | Desarrollo de Software con Tecnología Open Source 2 (ISO-715) | [**RentCarRD**](https://github.com/Jairo0811/RentCarRD) | Mayo - Agosto 2026 |
| 2 | Integración de Aplicaciones con Tecnología Propietaria (ISO-810) | [**SOAForge**](https://github.com/Jairo0811/SOA-Forge) | Septiembre - Diciembre 2026 |
| 3 | Integración de Aplicaciones con Tecnología Open Source (ISO-815) | **BonitaSoft** | Septiembre - Diciembre 2026 |

### 🔀 Relación paralela con SOAForge

Durante **Septiembre - Diciembre 2026**, BonitaSoft y SOAForge comparten profesor, período académico y tres integrantes: **Enmanueli Alfonso Rondon Marrero**, **Francis Jairo Matias Rosario** y **Jorge Alexander Minier Terrero**.

Sin embargo, son proyectos de asignaturas distintas:

- **SOAForge → ISO-810 — Integración de Aplicaciones con Tecnología Propietaria**;
- **BonitaSoft → ISO-815 — Integración de Aplicaciones con Tecnología Open Source**.

**Eliandres Rodriguez Cepeda participa únicamente en BonitaSoft / ISO-815.**

---

## 🎯 Alcance del primer parcial

La **Práctica 3** solicita una investigación sobre BonitaSoft que cubre 11 puntos:

1. introducción a SOA;
2. introducción a BPM;
3. historia y evolución;
4. características principales;
5. módulos de la aplicación;
6. componentes principales;
7. competidores;
8. infraestructura para aproximadamente 500 usuarios;
9. elementos usuales de una solución SOA con la herramienta;
10. costos aproximados para 500 usuarios;
11. otros aspectos relevantes definidos por el grupo.

Los puntos de investigación se mantienen en [`docs/research/`](docs/research/).

---

## 🔄 Proceso demostrativo

La demo modela una **solicitud de acceso a sistema corporativo**:

```text
Solicitud
   ↓
Validación
   ↓
Aprobación / Rechazo
   ↓
¿Aprobada?
 ┌────┴─────────────────┐
 ▼                      ▼
No                     Sí
 │                      │
Rechazo            REST /provision
 │                      │
 Fin              Cierre + Auditoría
```

La implementación local permite crear solicitudes, aprobarlas o rechazarlas, consultar su estado y mostrar estadísticas desde el dashboard React conectado a la API.

---

## 🧱 Stack tecnológico

### 🔄 BPM y modelado

<p>
  <img src="https://img.shields.io/badge/Bonita-BPM-7C3AED?style=flat-square" alt="Bonita BPM" />
  <img src="https://img.shields.io/badge/BPMN-2.0-2563EB?style=flat-square" alt="BPMN 2.0" />
</p>

- Bonita / Bonita Studio como plataforma BPM del ejercicio;
- BPMN 2.0;
- BDM, contratos, formularios, actores y conectores documentados para implementación.

> La ejecución final dentro de **Bonita Studio** todavía debe validarse localmente; por eso el proyecto no se marca como *Bonita Runtime Verified*.

### 🎨 Dashboard web

<p>
  <img src="https://skillicons.dev/icons?i=react,ts,vite" alt="React, TypeScript y Vite" />
</p>

- React 19;
- TypeScript 5.9;
- Vite 7;
- cliente API conectado al workflow local;
- creación de solicitudes mediante modal;
- controles de aprobación y rechazo;
- estadísticas y estado del proceso;
- estilos de dashboard funcionales.

### ⚙️ Workflow API

<p>
  <img src="https://skillicons.dev/icons?i=python,fastapi" alt="Python y FastAPI" />
  <img src="https://img.shields.io/badge/OpenAPI-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="OpenAPI / Swagger" />
</p>

- Python;
- FastAPI;
- Uvicorn;
- endpoints de creación, aprobación, rechazo, provisionamiento y estadísticas;
- documentación OpenAPI / Swagger;
- pruebas automatizadas del flujo principal.

### 🧪 Calidad y DevOps

<p>
  <img src="https://skillicons.dev/icons?i=docker,git,github,githubactions" alt="Docker, Git, GitHub y GitHub Actions" />
  <img src="https://img.shields.io/badge/pytest-Testing-0A9EDC?style=flat-square&logo=pytest&logoColor=white" alt="pytest" />
</p>

- pytest para la API;
- Docker / Dockerfile para el servicio auxiliar;
- Git / GitHub;
- `mock-api-ci.yml` para API y tests;
- `dashboard-react-ci.yml` para dashboard React;
- launcher PowerShell para desarrollo local.

---

## 🏗️ Arquitectura de la demo

```text
React Dashboard
      ↓ HTTP / JSON
FastAPI Workflow API
      ↓
Solicitud / Aprobación / Rechazo / Stats
      ↓
REST /provision

Bonita Studio / BPMN
      └── implementación académica del proceso y connector
```

El dashboard y la API forman una demostración local funcional. El modelado y configuración específica de Bonita se mantiene como capa académica separada hasta completar la validación dentro de Bonita Studio.

---

## 🗂️ Estructura

```text
BonitaSoft/
├── .github/workflows/
│   ├── dashboard-react-ci.yml
│   └── mock-api-ci.yml
├── demo/
│   ├── mock-api/
│   ├── DEMO_SCRIPT.md
│   └── TEST_CASES.md
├── docs/
│   ├── academic/
│   ├── architecture/
│   ├── implementation/
│   ├── research/
│   └── ROADMAP.md
├── process/
│   ├── bpmn/
│   ├── forms/
│   └── connectors/
├── scripts/
│   └── start-local.ps1
├── ui/
│   └── dashboard-react/
├── presentation/
└── README.md
```

---

## 🚀 Ejecución local

### Inicio rápido en Windows

```powershell
.\scripts\start-local.ps1
```

El launcher prepara la ejecución local de la API y el dashboard.

### API manual

```bash
cd demo/mock-api
python -m venv .venv
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Swagger:

```text
http://localhost:8000/docs
```

Pruebas:

```bash
pip install -r requirements-dev.txt
pytest -q
```

### Dashboard manual

```bash
cd ui/dashboard-react
npm install
npm run dev
```

---

## 📊 Estado actual

| Área | Estado |
|---|:---:|
| Información académica y continuidad | ✅ |
| Investigación — 11 puntos | ✅ |
| Diseño BPMN y arquitectura | ✅ Preparado |
| Workflow API FastAPI | ✅ Funcional |
| Pruebas API | ✅ |
| Dashboard React conectado | ✅ Funcional |
| Crear / aprobar / rechazar solicitudes | ✅ |
| Estadísticas del workflow | ✅ |
| CI de Mock API | ✅ |
| CI de Dashboard React | ✅ |
| Launcher local Windows | ✅ |
| Guion / presentación | ✅ Preparados |
| Configuración final en Bonita Studio | 🟡 Requiere validación local |
| Evidencia end-to-end del runtime Bonita | 🟡 Pendiente |

### Gate pendiente

No se marca como **Bonita Runtime Verified** hasta ejecutar y validar el proceso dentro de Bonita Studio con BDM, contratos, actores, formularios y connector configurados según [`docs/implementation/BONITA_STUDIO_IMPLEMENTATION.md`](docs/implementation/BONITA_STUDIO_IMPLEMENTATION.md).

Consulta [`docs/ROADMAP.md`](docs/ROADMAP.md) para el detalle del cierre académico.

---

<p align="center">
  <strong>BonitaSoft · BPM + Integración + Workflow Demo</strong><br/>
  Universidad APEC (UNAPEC) · ISO-815 · Septiembre - Diciembre 2026
</p>
