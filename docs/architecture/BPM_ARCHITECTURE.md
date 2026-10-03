# Arquitectura BPM — Demo ISO-815

## Proceso seleccionado

**Solicitud de acceso a sistema corporativo**.

El caso fue elegido porque permite demostrar en un flujo compacto los conceptos de BPM, BPMN, tareas humanas, decisiones e integración de aplicaciones mediante REST.

## Arquitectura lógica

```text
┌───────────────────┐
│    Solicitante    │
└─────────┬─────────┘
          │ Formulario
          ▼
┌───────────────────┐
│  Bonita Runtime   │
│                   │
│ BPMN + BDM        │
│ Organización      │
│ Contratos         │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│     Aprobador     │
│  Tarea humana     │
└─────────┬─────────┘
          │
          ▼
      Gateway
       /    \
      /      \
 Rechazo   Aprobación
    │          │
    ▼          ▼
   Fin    REST Connector
               │
               ▼
     ┌───────────────────┐
     │ FastAPI Mock API  │
     │ POST /provision   │
     │ GET  /audit/{id}  │
     └─────────┬─────────┘
               │
               ▼
          Cierre / Fin
```

## Capas

### Presentación
Formularios/páginas Bonita para captura, revisión y consulta.

### Proceso
BPMN controla estados, tareas, decisión y ruta de integración.

### Datos
`SolicitudAcceso` se plantea como objeto principal del BDM.

### Identidad
Solicitante y aprobador se resuelven mediante organización, roles y actores.

### Integración
Un REST connector POST consume `demo/mock-api` para simular el aprovisionamiento de acceso en un sistema externo.

### Auditoría
Bonita mantiene la trazabilidad del caso y la API de demo conserva un registro en memoria accesible por `GET /audit/{request_id}`.

## Flujo

```text
Solicitud
   ↓
Validación
   ↓
Revisión humana
   ↓
¿Aprobada?
 ┌────┴────────────────┐
 │                     │
No                    Sí
 │                     │
RECHAZADA         POST /provision
 │                     │
Fin              ¿Respuesta OK?
                  ├─ Sí → COMPLETADA → Fin
                  └─ No → Resolver error → Reintentar
```

## Separación de entornos

El runtime incluido en Bonita Studio se utiliza solo para desarrollo/pruebas. Una arquitectura real debe separar Development, QA y Production y dimensionar el runtime según concurrencia, carga e integraciones.

## Artefactos relacionados

- `process/bpmn/PROCESS_SPEC.md`
- `process/bpmn/solicitud-acceso-reference.bpmn`
- `process/forms/FORM_SPEC.md`
- `process/connectors/REST_PROVISIONING.md`
- `demo/mock-api/`
- `demo/TEST_CASES.md`

## Estado

La arquitectura y el servicio de integración de apoyo están definidos en el repositorio. El último paso de ejecución depende de modelar/importar el proceso en la versión concreta de **Bonita Studio** que utilizará el equipo y validar allí contratos, BDM, actores, formularios y connector.
