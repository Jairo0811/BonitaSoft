# BonitaSoft — ISO-815

<div align="center">

<img src="https://img.shields.io/badge/UNAPEC-ISO--815-003B70?style=for-the-badge" alt="UNAPEC ISO-815" />
<img src="https://img.shields.io/badge/Estado-CODE%20COMPLETE-16A34A?style=for-the-badge" alt="Code Complete" />

<br/><br/>

<a href="https://github.com/Jairo0811/BonitaSoft/actions/workflows/mock-api-ci.yml"><img src="https://github.com/Jairo0811/BonitaSoft/actions/workflows/mock-api-ci.yml/badge.svg" alt="Mock API CI" /></a>
<a href="https://github.com/Jairo0811/BonitaSoft/actions/workflows/dashboard-react-ci.yml"><img src="https://github.com/Jairo0811/BonitaSoft/actions/workflows/dashboard-react-ci.yml/badge.svg" alt="Dashboard React CI" /></a>
<a href="https://github.com/Jairo0811/BonitaSoft/actions/workflows/bonita-pack-ci.yml"><img src="https://github.com/Jairo0811/BonitaSoft/actions/workflows/bonita-pack-ci.yml/badge.svg" alt="Bonita Runtime Pack CI" /></a>

**BPM · BPMN 2.0 · Bonita Studio · React · FastAPI · SQLite · REST · GitHub Actions**

</div>

## Descripción

**BonitaSoft** es el proyecto académico del primer parcial de **Integración de Aplicaciones con Tecnología Open Source (ISO-815)** de la Universidad APEC (UNAPEC).

El repositorio combina:

- investigación académica sobre SOA, BPM y Bonita;
- modelado BPMN del proceso **Solicitud de acceso a sistema corporativo**;
- paquete completo de implementación para Bonita Studio;
- API FastAPI con persistencia SQLite;
- dashboard React/TypeScript responsive;
- aprovisionamiento REST y auditoría;
- pruebas automatizadas y CI.

> Estado actual: **CODE COMPLETE / Runtime Verification Pending**. El código y los artefactos están completos. Solo falta ejecutar el proceso dentro de la instalación local de Bonita Studio y guardar las evidencias reales del runtime.

## Información académica

| Información | Detalle |
|---|---|
| Institución | Universidad APEC (UNAPEC) |
| Asignatura | Integración de Aplicaciones con Tecnología Open Source (ISO-815) |
| Profesor | Juan Pablo Valdez Reyes |
| Período | Septiembre - Diciembre 2026 |
| Proyecto | BonitaSoft BPM |

### Equipo

| Integrante | Matrícula |
|---|---|
| Jorge Alexander Minier Terrero | A00105678 |
| Eliandres Rodriguez Cepeda | A00112070 |
| Francis Jairo Matias Rosario | A00115261 |
| Enmanueli Alfonso Rondon Marrero | A00115575 |

## Proceso BPM

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

El BPMN definitivo está en:

```text
process/bpmn/solicitud-acceso-final.bpmn
```

## Paquete Bonita Studio

El paquete de implementación se encuentra en `process/bonita/`.

Punto de entrada:

```text
process/bonita/RUNTIME_EXECUTION_PACKET.md
```

Incluye:

- BDM `SolicitudAcceso`;
- business variable `solicitudAcceso`;
- organización y actores;
- contrato de inicio;
- contrato de aprobación;
- formularios y validaciones;
- operaciones Groovy;
- gateway Aprobada/Rechazada;
- REST Connector `POST http://localhost:8000/provision`;
- mapeo `external_reference`;
- estado `COMPLETADA`;
- manejo de `ERROR_INTEGRACION`;
- reintento/replay;
- escenarios E2E y convención de evidencias.

Los manifiestos machine-readable viven en:

```text
process/bonita/runtime/
```

El paquete se valida automáticamente con:

```bash
python scripts/validate-bonita-pack.py
```

## Stack

### Frontend

- React 19
- TypeScript 5.9
- Vite 7
- Font Awesome
- CSS responsive
- branding BonitaSoft

### Backend

- Python
- FastAPI
- Uvicorn
- SQLite
- pytest

### BPM / integración

- Bonita / Bonita Studio
- BPMN 2.0
- BDM y contratos
- REST `/provision`
- auditoría `/audit`

### DevOps

- Git / GitHub
- GitHub Actions
- Docker
- CI para API, dashboard y paquete Bonita

## Dashboard funcional

La aplicación web incluye:

- Dashboard con KPI reales desde SQLite/FastAPI;
- gráfica de rendimiento real por estado;
- Mis tareas;
- Procesos;
- Casos e historial persistente;
- Diseño BPMN;
- Integraciones;
- Auditoría;
- Usuarios;
- aprobación, rechazo y reintento;
- navegación responsive para desktop, tablet y móvil.

El logo final se carga desde:

```text
ui/dashboard-react/public/bonitasoft-logo.png
```

## Ejecución local

### Windows — todo el entorno

```powershell
.\scripts\start-local.ps1
```

Servicios:

```text
Dashboard: http://localhost:5173
FastAPI:   http://localhost:8000
Swagger:   http://localhost:8000/docs
```

### FastAPI manual

```powershell
cd demo\mock-api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Dashboard manual

```powershell
cd ui\dashboard-react
npm install
npm run dev
```

## Helper para pruebas Bonita

Desde la raíz:

```powershell
.\scripts\bonita-runtime-helper.ps1 -Action Health
.\scripts\bonita-runtime-helper.ps1 -Action StartApi
.\scripts\bonita-runtime-helper.ps1 -Action StopApi
.\scripts\bonita-runtime-helper.ps1 -Action Audit
.\scripts\bonita-runtime-helper.ps1 -Action AuditRequest -RequestId SA-XXXXXXXX
```

Esto permite provocar y recuperar la ruta de error del connector durante las pruebas en Bonita Studio.

## Estado

| Área | Estado |
|---|:---:|
| Investigación académica | ✅ |
| BPMN definitivo | ✅ |
| BDM / contratos / actores / Groovy | ✅ |
| REST Connector especificado | ✅ |
| FastAPI + SQLite | ✅ |
| Dashboard React | ✅ |
| Responsive + branding | ✅ |
| Tests API | ✅ |
| CI Dashboard | ✅ |
| CI Bonita Runtime Pack | ✅ |
| Escenarios E2E definidos | ✅ |
| Ejecución física en Bonita Studio | 🟡 |
| Evidencias runtime Bonita | 🟡 |

## Gate final — Runtime Verified

El repositorio **no se declara Runtime Verified** hasta ejecutar dentro de Bonita Studio y guardar evidencia de:

1. BDM desplegado;
2. organización y actores;
3. formulario inicial;
4. Human Task de aprobación;
5. gateway aprobado/rechazado;
6. REST Connector exitoso;
7. `externalReference` persistida;
8. API caída con error real;
9. reintento/replay exitoso;
10. auditoría y trazabilidad.

Las evidencias se guardan en `assets/evidence/` y el seguimiento permanece en GitHub Issue #2.

Para el detalle exacto del cierre, consulta [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

<div align="center">
<strong>BonitaSoft · ISO-815 · UNAPEC · Septiembre - Diciembre 2026</strong>
</div>
