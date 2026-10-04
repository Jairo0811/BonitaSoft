<p align="center">
  <img src="assets/bonitasoft-logo.png" alt="BonitaSoft Logo" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/UNAPEC-ISO--815-003B70?style=for-the-badge" alt="UNAPEC ISO-815" />
</p>

<div align="center">

<img src="https://img.shields.io/badge/Estado-FROZEN%20%2F%20CODE%20COMPLETE-16A34A?style=for-the-badge" alt="Frozen / Code Complete" />

<br/><br/>

<a href="https://github.com/Jairo0811/BonitaSoft/actions/workflows/mock-api-ci.yml"><img src="https://github.com/Jairo0811/BonitaSoft/actions/workflows/mock-api-ci.yml/badge.svg" alt="Mock API CI" /></a>
<a href="https://github.com/Jairo0811/BonitaSoft/actions/workflows/dashboard-react-ci.yml"><img src="https://github.com/Jairo0811/BonitaSoft/actions/workflows/dashboard-react-ci.yml/badge.svg" alt="Dashboard React CI" /></a>
<a href="https://github.com/Jairo0811/BonitaSoft/actions/workflows/bonita-pack-ci.yml"><img src="https://github.com/Jairo0811/BonitaSoft/actions/workflows/bonita-pack-ci.yml/badge.svg" alt="Bonita Runtime Pack CI" /></a>

<br/><br/>

**BPM · BPMN 2.0 · Bonita Studio · React · FastAPI · SQLite · REST · GitHub Actions**

</div>

## 📌 Descripción

**BonitaSoft** es el proyecto académico del primer parcial de **Integración de Aplicaciones con Tecnología Open Source (ISO-815)** de la Universidad APEC (UNAPEC).

El repositorio combina investigación académica sobre SOA/BPM/Bonita, modelado BPMN, paquete de implementación para Bonita Studio, API FastAPI con persistencia SQLite, dashboard React/TypeScript responsive, integración REST, auditoría, pruebas automatizadas y CI.

> **Estado final: FROZEN / CODE COMPLETE.** No quedan tareas de desarrollo planificadas para esta entrega. La ejecución física dentro de Bonita Studio **no fue certificada con evidencias reales**, por lo que no se utiliza la etiqueta `Runtime Verified`.

---

## 🎓 Información académica

| Información | Detalle |
|---|---|
| 🏫 Institución | **Universidad APEC (UNAPEC)** |
| 📖 Asignatura | **Integración de Aplicaciones con Tecnología Open Source (ISO-815)** |
| 👨‍🏫 Profesor | **Juan Pablo Valdez Reyes** |
| 📅 Período académico | **Septiembre - Diciembre 2026** |
| 📁 Proyecto | **BonitaSoft BPM** |

### 👥 Equipo académico original

| 👤 Integrante | 🆔 Matrícula |
|---|---|
| 👨🏻‍💻 **Jorge Alexander Minier Terrero** | **A00105678** |
| 👨🏻‍💻 **Eliandres Rodriguez Cepeda** | **A00112070** |
| 👨🏻‍💻 **Francis Jairo Matias Rosario** | **A00115261** |
| 👨🏻‍💻 **Enmanueli Alfonso Rondon Marrero** | **A00115575** |

> **Eliandres Rodriguez Cepeda participa únicamente en BonitaSoft / ISO-815. No pertenece a SOAForge / ISO-810.**

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

El profesor **Juan Pablo Valdez Reyes** impartió previamente **Desarrollo de Software con Tecnología Open Source 2 (ISO-715)**, asociada a [**RentCarRD**](https://github.com/Jairo0811/RentCarRD), durante **Mayo - Agosto 2026**. En **Septiembre - Diciembre 2026** imparte **SOAForge / ISO-810** y **BonitaSoft / ISO-815**.

| Orden | Asignatura | Proyecto | Período |
|---:|---|---|---|
| 1 | Desarrollo de Software con Tecnología Open Source 2 (ISO-715) | [**RentCarRD**](https://github.com/Jairo0811/RentCarRD) | Mayo - Agosto 2026 |
| 2 | Integración de Aplicaciones con Tecnología Propietaria (ISO-810) | [**SOAForge**](https://github.com/Jairo0811/SOA-Forge) | Septiembre - Diciembre 2026 |
| 3 | Integración de Aplicaciones con Tecnología Open Source (ISO-815) | **BonitaSoft** | Septiembre - Diciembre 2026 |

Esta continuidad es **docente y formativa** y no implica dependencia técnica entre los proyectos.

### 🔀 Relación paralela con SOAForge

Durante **Septiembre - Diciembre 2026**, BonitaSoft y SOAForge comparten al profesor **Juan Pablo Valdez Reyes**, el mismo período y tres integrantes: **Jorge Alexander Minier Terrero**, **Francis Jairo Matias Rosario** y **Enmanueli Alfonso Rondon Marrero**.

Son proyectos académicos independientes de asignaturas distintas:

- **SOAForge → ISO-810 — Integración de Aplicaciones con Tecnología Propietaria**;
- **BonitaSoft → ISO-815 — Integración de Aplicaciones con Tecnología Open Source**.

**Eliandres Rodriguez Cepeda participa únicamente en BonitaSoft / ISO-815.**

---

## 🔄 Proceso BPM

```text
Solicitud
   ↓
Validar solicitud
   ↓
Revisar y decidir solicitud
   ↓
¿Aprobada?
 ┌───────┴───────────┐
No                  Sí
↓                    ↓
Registrar rechazo   Preparar aprovisionamiento
↓                    ↓
Fin rechazado       POST /provision
                     ↓
                ¿Integración OK?
                  ┌──┴──┐
                 Sí    No
                 ↓      ↓
            Completar  ERROR_INTEGRACION
                 ↓      ↓
            Fin      Resolver / Reintentar
```

BPMN definitivo portable:

```text
process/bpmn/solicitud-acceso-final.bpmn
```

---

## 📦 Paquete Bonita Studio

Punto de entrada:

```text
process/bonita/RUNTIME_EXECUTION_PACKET.md
```

Incluye BDM `SolicitudAcceso`, variable de negocio, organización, actores, contratos, formularios, operaciones Groovy, gateway Aprobada/Rechazada, REST Connector, mapeo de `external_reference`, estados `COMPLETADA` y `ERROR_INTEGRACION`, reintento/replay y escenarios E2E.

Los manifiestos machine-readable están en:

```text
process/bonita/runtime/
```

Validación automática:

```bash
python scripts/validate-bonita-pack.py
```

---

## 🧱 Stack tecnológico

### 🔄 BPM y modelado

<p>
  <img src="https://img.shields.io/badge/Bonita-BPM-7C3AED?style=flat-square" alt="Bonita BPM" />
  <img src="https://img.shields.io/badge/BPMN-2.0-2563EB?style=flat-square" alt="BPMN 2.0" />
</p>

- Bonita / Bonita Studio;
- BPMN 2.0;
- BDM, contratos, actores, formularios y operaciones Groovy;
- REST Connector y auditoría del proceso.

### 🎨 Dashboard web

<p>
  <img src="https://skillicons.dev/icons?i=react,ts,vite" alt="React, TypeScript y Vite" />
  <img src="https://img.shields.io/badge/Font%20Awesome-538DD7?style=flat-square&logo=fontawesome&logoColor=white" alt="Font Awesome" />
</p>

- React 19;
- TypeScript 5.9;
- Vite 7;
- Font Awesome;
- CSS responsive.

### ⚙️ Workflow API y datos

<p>
  <img src="https://skillicons.dev/icons?i=python,fastapi,sqlite" alt="Python, FastAPI y SQLite" />
  <img src="https://img.shields.io/badge/OpenAPI-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="OpenAPI / Swagger" />
</p>

- Python;
- FastAPI;
- Uvicorn;
- SQLite;
- endpoints de workflow, `/provision` y `/audit`;
- OpenAPI / Swagger.

### 🧪 Calidad y DevOps

<p>
  <img src="https://skillicons.dev/icons?i=docker,git,github,githubactions" alt="Docker, Git, GitHub y GitHub Actions" />
  <img src="https://img.shields.io/badge/pytest-Testing-0A9EDC?style=flat-square&logo=pytest&logoColor=white" alt="pytest" />
</p>

- pytest;
- Docker;
- Git / GitHub;
- GitHub Actions;
- `mock-api-ci.yml`;
- `dashboard-react-ci.yml`;
- `bonita-pack-ci.yml`.

---

## 📊 Dashboard funcional

Incluye KPI reales desde SQLite/FastAPI, gráfica de rendimiento por estado, Mis tareas, Procesos, Casos, Diseño BPMN, Integraciones, Auditoría, Usuarios, aprobación, rechazo y reintento.

Logo final:

```text
ui/dashboard-react/public/bonitasoft-logo.png
```

---

## 🚀 Ejecución local

```powershell
.\scripts\start-local.ps1
```

Servicios:

```text
Dashboard: http://localhost:5173
FastAPI:   http://localhost:8000
Swagger:   http://localhost:8000/docs
```

Helper de pruebas Bonita/FastAPI:

```powershell
.\scripts\bonita-runtime-helper.ps1 -Action Health
.\scripts\bonita-runtime-helper.ps1 -Action StartApi
.\scripts\bonita-runtime-helper.ps1 -Action StopApi
.\scripts\bonita-runtime-helper.ps1 -Action Audit
.\scripts\bonita-runtime-helper.ps1 -Action AuditRequest -RequestId SA-XXXXXXXX
```

---

## 📊 Estado final

| Área | Estado |
|---|:---:|
| Investigación académica | ✅ |
| BPMN definitivo | ✅ |
| BDM / contratos / actores / Groovy | ✅ |
| REST Connector especificado | ✅ |
| FastAPI + SQLite | ✅ |
| Dashboard React | ✅ |
| Responsive + branding | ✅ |
| Tests y CI | ✅ |
| Escenarios E2E definidos | ✅ |
| Repositorio | 🧊 FROZEN |
| Runtime físico Bonita Studio | ⚪ No certificado |

## 🧊 Congelamiento

El cierre formal está documentado en [`docs/FROZEN.md`](docs/FROZEN.md).

No se planifican más cambios para esta entrega. Cualquier desarrollo posterior deberá considerarse una reapertura explícita o una versión nueva.

---

<div align="center">
<strong>BonitaSoft · ISO-815 · UNAPEC · FROZEN / CODE COMPLETE · 2026-10-04</strong>
</div>
