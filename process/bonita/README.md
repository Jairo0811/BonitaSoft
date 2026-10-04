# Paquete de runtime Bonita Studio

Este directorio contiene la configuración de referencia para implementar y validar en **Bonita Studio** el proceso académico **Solicitud de acceso a sistema corporativo**.

> Importante: estos archivos describen la configuración que debe aplicarse dentro de Bonita Studio. No se declara `Runtime Verified` hasta ejecutar el proceso en Studio y capturar evidencia de las rutas aprobada, rechazada y de error.

## Artefactos

- `BDM.md` — Business Data Model `SolicitudAcceso`.
- `CONTRACTS_AND_OPERATIONS.md` — contratos de instanciación/tarea y operaciones.
- `ACTORS_AND_ORGANIZATION.md` — organización, actores y usuarios de prueba.
- `GROOVY_EXPRESSIONS.md` — expresiones reutilizables para IDs, fechas, gateways y payload REST.
- `REST_CONNECTOR.md` — configuración del connector hacia FastAPI.
- `RUNTIME_CHECKLIST.md` — orden de construcción, pruebas y evidencias.

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

Antes de probar el connector:

```powershell
cd demo\mock-api
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

Endpoints relevantes:

```text
GET  http://localhost:8000/health
POST http://localhost:8000/provision
GET  http://localhost:8000/audit/{request_id}
```

## Criterio de cierre

El paquete queda preparado cuando la configuración está documentada y alineada con la API. El proyecto queda **Runtime Verified** únicamente después de ejecutar en Bonita Studio:

1. ruta aprobada + REST exitoso;
2. ruta rechazada sin REST;
3. error técnico del REST;
4. reintento o recuperación;
5. evidencia del caso y de la referencia externa `ACC-...`.
