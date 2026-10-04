# Runbook de implementación en Bonita Studio

Estado del repositorio: **CODE COMPLETE ✅**

Este documento resume cómo aplicar dentro de Bonita Studio los artefactos finales de BonitaSoft. El detalle de una sola pasada está en `process/bonita/RUNTIME_EXECUTION_PACKET.md`.

## Artefactos definitivos

- BPMN final: `process/bpmn/solicitud-acceso-final.bpmn`.
- BDM: `process/bonita/BDM.md`.
- Contratos/operaciones: `process/bonita/CONTRACTS_AND_OPERATIONS.md`.
- Organización/actores: `process/bonita/ACTORS_AND_ORGANIZATION.md`.
- Groovy: `process/bonita/runtime/*.groovy`.
- Connector: `process/bonita/runtime/rest-connector.json`.
- Manifiesto global: `process/bonita/runtime/implementation-manifest.json`.
- E2E: `process/bonita/runtime/e2e-scenarios.json`.
- Evidencias: `assets/evidence/README.md`.

## 1. Business Data Model

Package:

```text
com.jmsoftware.bonitasoft.model
```

Business Object:

```text
SolicitudAcceso
```

Atributos:

| Atributo | Tipo sugerido |
|---|---|
| requestId | String |
| nombreSolicitante | String |
| correo | String |
| departamento | String |
| sistema | String |
| nivelAcceso | String |
| justificacion | String |
| estado | String |
| aprobada | Boolean |
| comentarioAprobador | String |
| externalReference | String |
| createdAt | Date/DateTime compatible con la versión instalada |
| closedAt | Date/DateTime compatible con la versión instalada |

Business variable del proceso:

```text
solicitudAcceso : com.jmsoftware.bonitasoft.model.SolicitudAcceso
```

Estados:

```text
PENDIENTE
EN_REVISION
APROBADA
RECHAZADA
PROVISIONANDO
COMPLETADA
ERROR_INTEGRACION
```

## 2. Organización y actores

```text
/Empresa
  /Solicitantes
  /Aprobadores
```

Usuarios:

```text
solicitante.demo
aprobador.demo
```

Actores:

```text
Solicitante -> /Empresa/Solicitantes
Aprobador   -> /Empresa/Aprobadores
```

Las contraseñas se crean localmente y no se versionan.

## 3. BPMN definitivo

Usar `process/bpmn/solicitud-acceso-final.bpmn` como modelo definitivo portable:

```text
Inicio
 → Validar solicitud
 → Revisar y decidir solicitud
 → ¿Aprobada?
    ├─ No → Registrar rechazo → Fin
    └─ Sí → Preparar aprovisionamiento
               ↓
            Provisionar acceso via REST
               ↓
          Boundary Error ─→ Resolver error ─→ Reintentar
               ↓
            Completar solicitud
               ↓
              Fin
```

El Boundary Error queda asociado a `Provisionar acceso via REST`.

## 4. Contrato de inicio

```text
requestInput
  nombreSolicitante: TEXT
  correo: TEXT
  departamento: TEXT
  sistema: TEXT
  nivelAcceso: TEXT
  justificacion: TEXT
```

Manifiesto: `process/bonita/runtime/start-contract.json`.

Inicialización: `process/bonita/runtime/initializeSolicitudAcceso.groovy`.

## 5. Formulario inicial

Generar desde el contrato y validar:

- campos obligatorios;
- formato email;
- sistema no vacío;
- nivel no vacío;
- justificación no vacía.

## 6. Human Task

Tarea:

```text
Revisar y decidir solicitud
```

Actor:

```text
Aprobador
```

Contrato:

```text
decisionInput
  aprobada: BOOLEAN
  comentarioAprobador: TEXT
```

Regla: el comentario es obligatorio cuando `aprobada == false`.

Manifiesto: `process/bonita/runtime/approval-contract.json`.
Operación: `process/bonita/runtime/applyDecision.groovy`.

## 7. Gateway

```groovy
solicitudAcceso.aprobada == true
```

para la ruta aprobada. La otra salida funciona como rechazo/default.

## 8. REST Connector

URL:

```text
POST http://localhost:8000/provision
```

Headers:

```text
Content-Type: application/json
Accept: application/json
```

Payload generado por:

```text
process/bonita/runtime/buildProvisionPayload.groovy
```

Respuesta esperada:

```json
{
  "request_id": "SA-XXXXXXXX",
  "status": "PROVISIONED",
  "external_reference": "ACC-XXXXXXXXXXXX",
  "provisioned_at": "..."
}
```

Mapeo posterior al éxito:

```text
external_reference -> solicitudAcceso.externalReference
estado             -> COMPLETADA
closedAt           -> now
```

Script: `process/bonita/runtime/applyProvisionResponse.groovy`.

No establecer `COMPLETADA` antes de comprobar `status == PROVISIONED`.

## 9. Error y reintento

Con FastAPI detenida, el connector debe fallar y el caso no puede quedar completado.

Estado funcional documentado:

```text
ERROR_INTEGRACION
```

Script de apoyo: `process/bonita/runtime/markIntegrationError.groovy`.

Tras restablecer FastAPI, ejecutar replay/retry del connector o completar la tarea de recuperación que retorna a la Service Task.

La API es idempotente por `request_id`.

## 10. Pruebas E2E

Ejecutar `E2E-01` a `E2E-05` según:

```text
process/bonita/runtime/e2e-scenarios.json
```

Cobertura:

1. aprobada + REST exitoso;
2. rechazada sin REST;
3. API caída;
4. reintento;
5. auditoría/trazabilidad.

## 11. Herramientas locales

```powershell
.\scripts\bonita-runtime-helper.ps1 -Action Health
.\scripts\bonita-runtime-helper.ps1 -Action StartApi
.\scripts\bonita-runtime-helper.ps1 -Action StopApi
.\scripts\bonita-runtime-helper.ps1 -Action Audit
.\scripts\bonita-runtime-helper.ps1 -Action AuditRequest -RequestId SA-XXXXXXXX
```

## 12. Validación del paquete

```bash
python scripts/validate-bonita-pack.py
```

El mismo validador se ejecuta en `Bonita Runtime Pack CI`.

## 13. Evidencias

Guardar las capturas reales siguiendo `assets/evidence/README.md`.

Como mínimo:

- BPMN en Studio;
- BDM;
- organización/actores;
- formulario inicial;
- Human Task;
- gateway;
- REST Connector;
- caso aprobado;
- caso rechazado;
- API caída;
- reintento;
- caso finalizado e historial.

## Criterio de cierre técnico

El repositorio está **CODE COMPLETE**. Solo marcar **Runtime Verified** después de ejecutar todas las rutas dentro de Bonita Studio y guardar evidencia real. La preparación documental, los manifiestos y el CI no sustituyen esa ejecución.
