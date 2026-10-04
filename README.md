# BonitaSoft — ISO-815

<div align="center">

<img src="https://img.shields.io/badge/UNAPEC-ISO--815-003B70?style=for-the-badge" alt="UNAPEC ISO-815" />
<img src="https://img.shields.io/badge/Estado-FROZEN%20%2F%20CODE%20COMPLETE-16A34A?style=for-the-badge" alt="Frozen / Code Complete" />

<br/><br/>

<a href="https://github.com/Jairo0811/BonitaSoft/actions/workflows/mock-api-ci.yml"><img src="https://github.com/Jairo0811/BonitaSoft/actions/workflows/mock-api-ci.yml/badge.svg" alt="Mock API CI" /></a>
<a href="https://github.com/Jairo0811/BonitaSoft/actions/workflows/dashboard-react-ci.yml"><img src="https://github.com/Jairo0811/BonitaSoft/actions/workflows/dashboard-react-ci.yml/badge.svg" alt="Dashboard React CI" /></a>
<a href="https://github.com/Jairo0811/BonitaSoft/actions/workflows/bonita-pack-ci.yml"><img src="https://github.com/Jairo0811/BonitaSoft/actions/workflows/bonita-pack-ci.yml/badge.svg" alt="Bonita Runtime Pack CI" /></a>

**BPM · BPMN 2.0 · Bonita Studio · React · FastAPI · SQLite · REST · GitHub Actions**

</div>

## Descripción

**BonitaSoft** es el proyecto académico del primer parcial de **Integración de Aplicaciones con Tecnología Open Source (ISO-815)** de la Universidad APEC (UNAPEC).

El repositorio combina investigación académica sobre SOA/BPM/Bonita, modelado BPMN, paquete de implementación para Bonita Studio, API FastAPI con persistencia SQLite, dashboard React/TypeScript responsive, integración REST, auditoría, pruebas automatizadas y CI.

> **Estado final: FROZEN / CODE COMPLETE.** No quedan tareas de desarrollo planificadas para esta entrega. La ejecución física dentro de Bonita Studio **no fue certificada con evidencias reales**, por lo que no se utiliza la etiqueta `Runtime Verified`.

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

BPMN definitivo portable:

```text
process/bpmn/solicitud-acceso-final.bpmn
```

## Paquete Bonita Studio

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

## Stack

- **Frontend:** React 19, TypeScript 5.9, Vite 7, Font Awesome, CSS responsive.
- **Backend:** Python, FastAPI, Uvicorn, SQLite, pytest.
- **BPM / integración:** Bonita / Bonita Studio, BPMN 2.0, BDM, contratos, REST `/provision`, auditoría `/audit`.
- **DevOps:** Git, GitHub, GitHub Actions, Docker.

## Dashboard funcional

Incluye Dashboard con KPI reales desde SQLite/FastAPI, gráfica de rendimiento por estado, Mis tareas, Procesos, Casos, Diseño BPMN, Integraciones, Auditoría, Usuarios, aprobación, rechazo y reintento.

Logo final:

```text
ui/dashboard-react/public/bonitasoft-logo.png
```

## Ejecución local

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

## Estado final

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

## Congelamiento

El cierre formal está documentado en [`docs/FROZEN.md`](docs/FROZEN.md).

No se planifican más cambios para esta entrega. Cualquier desarrollo posterior deberá considerarse una reapertura explícita o una versión nueva.

---

<div align="center">
<strong>BonitaSoft · ISO-815 · UNAPEC · FROZEN / CODE COMPLETE · 2026-10-04</strong>
</div>
