# REST Connector — FastAPI Provisioning

## Objetivo

Configurar la actividad `Provisionar acceso` para llamar al servicio local persistente de FastAPI.

## Precondición

La API debe responder:

```text
GET http://localhost:8000/health
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

## Configuración HTTP

```text
Método: POST
URL: http://localhost:8000/provision
Content-Type: application/json
```

Headers:

```text
Content-Type: application/json
Accept: application/json
```

## Body

Generar desde el BDM:

```json
{
  "request_id": "<solicitudAcceso.requestId>",
  "user_email": "<solicitudAcceso.correo>",
  "system": "<solicitudAcceso.sistema>",
  "access_level": "<solicitudAcceso.nivelAcceso>"
}
```

Expresión Groovy recomendada:

```groovy
import groovy.json.JsonOutput

return JsonOutput.toJson([
    request_id   : solicitudAcceso.requestId,
    user_email   : solicitudAcceso.correo,
    system       : solicitudAcceso.sistema,
    access_level : solicitudAcceso.nivelAcceso
])
```

## Respuesta esperada

```json
{
  "request_id": "SA-A1B2C3D4",
  "status": "PROVISIONED",
  "external_reference": "ACC-123456789ABC",
  "provisioned_at": "2026-10-04T15:00:00+00:00"
}
```

## Mapeo

Después de parsear el JSON:

```text
response.request_id          → validar contra solicitudAcceso.requestId
response.status              → debe ser PROVISIONED
response.external_reference  → solicitudAcceso.externalReference
response.provisioned_at      → evidencia / trazabilidad
```

Operaciones posteriores:

```text
solicitudAcceso.externalReference = response.external_reference
solicitudAcceso.estado = "COMPLETADA"
solicitudAcceso.closedAt = now
```

## Idempotencia

FastAPI utiliza `request_id` como clave funcional para evitar crear múltiples aprovisionamientos para el mismo caso. Reintentar el mismo `request_id` debe devolver el mismo resultado persistido cuando ya fue aprovisionado.

## Prueba de éxito

1. API en ejecución.
2. Solicitud aprobada.
3. Connector llama `/provision`.
4. HTTP 200.
5. `status == PROVISIONED`.
6. `external_reference` comienza por `ACC-`.
7. BDM termina `COMPLETADA`.
8. Consultar:

```text
GET http://localhost:8000/audit/<requestId>
```

Debe existir el mismo `external_reference`.

## Prueba de error

Método recomendado durante la demo técnica:

1. detener temporalmente FastAPI o cambiar la URL del connector a un puerto no disponible;
2. aprobar una nueva solicitud;
3. ejecutar `Provisionar acceso`;
4. confirmar que el connector falla;
5. el caso no debe quedar `COMPLETADA`;
6. establecer/mostrar `ERROR_INTEGRACION`;
7. restaurar FastAPI;
8. reintentar;
9. confirmar `COMPLETADA` y referencia `ACC-...`.

## Evidencias

Capturar:

- configuración de método y URL;
- headers;
- expresión del body;
- respuesta exitosa;
- referencia externa almacenada;
- caso con error técnico;
- reintento exitoso.
