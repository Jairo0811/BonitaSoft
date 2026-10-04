# Paquete de runtime Bonita Studio

Este directorio contiene la configuración de referencia para implementar y validar en **Bonita Studio** el proceso académico **Solicitud de acceso a sistema corporativo**.

> Importante: estos archivos describen la configuración que debe aplicarse dentro de Bonita Studio. No se declara `Runtime Verified` hasta ejecutar el proceso en Studio y capturar evidencia de las rutas aprobada, rechazada y de error/reintento.

## Punto de entrada recomendado

Usar primero:

```text
RUNTIME_EXECUTION_PACKET.md
```

Ese documento concentra el orden completo de ejecución: BDM, organización, actores, BPMN, contratos, formularios, gateway, connector REST, error/reintento, pruebas E2E y evidencias.

## Artefactos

- `RUNTIME_EXECUTION_PACKET.md` — runbook final de una sola pasada.
- `BDM.md` — Business Data Model `SolicitudAcceso`.
- `CONTRACTS_AND_OPERATIONS.md` — contratos de instanciación/tarea y operaciones.
- `ACTORS_AND_ORGANIZATION.md` — organización, actores y usuarios de prueba.
- `GROOVY_EXPRESSIONS.md` — expresiones reutilizables para IDs, fechas, gateways y payload REST.
- `REST_CONNECTOR.md` — configuración del connector hacia FastAPI.
- `RUNTIME_CHECKLIST.md` — orden de construcción, pruebas y evidencias.
- `runtime/initializeSolicitudAcceso.groovy` — inicialización de la business variable.
- `runtime/applyDecision.groovy` — aplicación de aprobación/rechazo.
- `runtime/buildProvisionPayload.groovy` — payload JSON para `/provision`.
- `runtime/applyProvisionResponse.groovy` — lectura de `external_reference` y cierre.
- `runtime/markIntegrationError.groovy` — estado `ERROR_INTEGRACION`.

## Proceso objetivo

```text
Inicio
  ↓
Validar solicitud
  ↓
Revisar y decidir solicitud [Human Task]
  ↓
¿Aprobada?
  ├─ No → Rechazar solicitud → Fin
  └─ Sí → Provisionar acceso [REST]
               ↓
          ¿Integración OK?
          ├─ Sí → Completar solicitud → Fin
          └─ No → Resolver error / reintentar
```

## Integración local

El helper recomendado desde la raíz del repositorio es:

```powershell
.\scripts\bonita-runtime-helper.ps1 -Action Health
.\scripts\bonita-runtime-helper.ps1 -Action StartApi
.\scripts\bonita-runtime-helper.ps1 -Action StopApi
.\scripts\bonita-runtime-helper.ps1 -Action Audit
.\scripts\bonita-runtime-helper.ps1 -Action AuditRequest -RequestId SA-XXXXXXXX
```

También se puede iniciar manualmente:

```powershell
cd demo\mock-api
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

Endpoints relevantes:

```text
GET  http://localhost:8000/health
POST http://localhost:8000/provision
GET  http://localhost:8000/audit
GET  http://localhost:8000/audit/{request_id}
```

## Criterio de cierre

El paquete queda preparado cuando la configuración está documentada y alineada con la API. El proyecto queda **Runtime Verified** únicamente después de ejecutar en Bonita Studio:

1. ruta aprobada + REST exitoso;
2. ruta rechazada sin REST;
3. error técnico real del REST;
4. reintento/replay o recuperación;
5. evidencia del caso y de la referencia externa `ACC-...`;
6. trazabilidad en Bonita y en `/audit`.
