# Paquete de runtime Bonita Studio

Estado del paquete: **CODE COMPLETE ✅**

Este directorio concentra la configuración necesaria para implementar en **Bonita Studio** el proceso académico **Solicitud de acceso a sistema corporativo**.

> `Runtime Verified` sigue requiriendo ejecutar el proceso físicamente en la instalación local de Bonita Studio y guardar evidencias reales de las rutas aprobada, rechazada y error/reintento.

## Punto de entrada

Usar primero:

```text
RUNTIME_EXECUTION_PACKET.md
```

Ese runbook define el orden completo: BDM, organización, actores, BPMN, contratos, formularios, gateway, operaciones BDM, connector REST, error/reintento, E2E y evidencias.

## Artefactos documentales

- `RUNTIME_EXECUTION_PACKET.md` — runbook final de una sola pasada.
- `BDM.md` — Business Data Model `SolicitudAcceso`.
- `CONTRACTS_AND_OPERATIONS.md` — contratos y operaciones.
- `ACTORS_AND_ORGANIZATION.md` — organización, actores y usuarios.
- `GROOVY_EXPRESSIONS.md` — expresiones reutilizables.
- `REST_CONNECTOR.md` — configuración del connector.
- `RUNTIME_CHECKLIST.md` — construcción, pruebas y evidencias.

## Artefactos machine-readable

En `runtime/`:

- `implementation-manifest.json` — contrato global de implementación.
- `start-contract.json` — contrato de instanciación.
- `approval-contract.json` — contrato de Human Task.
- `organization.json` — grupos, usuarios y actores.
- `rest-connector.json` — contrato REST y mapeos.
- `e2e-scenarios.json` — E2E-01 a E2E-05.

## Scripts Groovy

- `runtime/initializeSolicitudAcceso.groovy`
- `runtime/applyDecision.groovy`
- `runtime/buildProvisionPayload.groovy`
- `runtime/applyProvisionResponse.groovy`
- `runtime/markIntegrationError.groovy`

## BPMN definitivo

```text
process/bpmn/solicitud-acceso-final.bpmn
```

Incluye:

```text
Inicio
  ↓
Validar solicitud
  ↓
Revisar y decidir solicitud
  ↓
¿Aprobada?
  ├─ No → Registrar rechazo → Fin
  └─ Sí → Preparar aprovisionamiento
              ↓
           Provisionar acceso [REST]
              ↓
        Boundary Error ──→ Resolver error ──→ Reintentar
              ↓
           Completar solicitud
              ↓
             Fin
```

## Integración local

```text
POST http://localhost:8000/provision
GET  http://localhost:8000/health
GET  http://localhost:8000/audit
GET  http://localhost:8000/audit/{request_id}
```

Helper desde la raíz:

```powershell
.\scripts\bonita-runtime-helper.ps1 -Action Health
.\scripts\bonita-runtime-helper.ps1 -Action StartApi
.\scripts\bonita-runtime-helper.ps1 -Action StopApi
.\scripts\bonita-runtime-helper.ps1 -Action Audit
.\scripts\bonita-runtime-helper.ps1 -Action AuditRequest -RequestId SA-XXXXXXXX
```

## Validación automática

```bash
python scripts/validate-bonita-pack.py
```

GitHub Actions:

```text
Bonita Runtime Pack CI
```

El validador comprueba la consistencia entre BPMN, BDM, contratos, actores, connector, scripts y escenarios E2E.

## Criterio final

El repositorio ya está **CODE COMPLETE**. Para pasar a **Runtime Verified** todavía se requiere evidencia de Bonita Studio para:

1. BDM desplegado;
2. organización y actores desplegados;
3. formulario inicial;
4. Human Task;
5. ruta aprobada;
6. ruta rechazada;
7. connector REST exitoso;
8. error real con FastAPI detenida;
9. replay/retry exitoso;
10. auditoría y trazabilidad.

Seguimiento: GitHub Issue #2.
