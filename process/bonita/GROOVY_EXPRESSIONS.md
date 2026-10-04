# Expresiones Groovy de referencia

Estas expresiones están pensadas para reducir errores al configurar Bonita Studio. Los nombres exactos de variables deben coincidir con el BDM y contratos del proyecto.

## Generar requestId

```groovy
"SA-" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase()
```

Ejemplo:

```text
SA-A1B2C3D4
```

## Fecha/hora actual

Usar el tipo que corresponda a la versión instalada de Bonita.

Para APIs basadas en `java.time`:

```groovy
java.time.OffsetDateTime.now()
```

Si el atributo BDM espera `java.util.Date`:

```groovy
new java.util.Date()
```

No mezclar ambos tipos dentro del mismo atributo.

## Gateway — aprobada

```groovy
solicitudAcceso.aprobada == true
```

## Gateway — rechazada

```groovy
solicitudAcceso.aprobada == false
```

## Validar comentario de rechazo

```groovy
solicitudAcceso.aprobada == true ||
(
    solicitudAcceso.comentarioAprobador != null &&
    !solicitudAcceso.comentarioAprobador.trim().isEmpty()
)
```

## Payload JSON para /provision

Si el connector permite body como String, usar `groovy.json.JsonOutput`:

```groovy
import groovy.json.JsonOutput

return JsonOutput.toJson([
    request_id   : solicitudAcceso.requestId,
    user_email   : solicitudAcceso.correo,
    system       : solicitudAcceso.sistema,
    access_level : solicitudAcceso.nivelAcceso
])
```

Resultado esperado:

```json
{
  "request_id": "SA-A1B2C3D4",
  "user_email": "usuario@empresa.com",
  "system": "ERP Finanzas",
  "access_level": "Lectura"
}
```

## Validar respuesta de aprovisionamiento

Después de convertir la respuesta JSON a un objeto/mapa:

```groovy
response.status == "PROVISIONED" &&
response.external_reference != null &&
!response.external_reference.toString().trim().isEmpty()
```

## Obtener external_reference

```groovy
response.external_reference?.toString()
```

## Mensaje de trazabilidad

```groovy
"Solicitud ${solicitudAcceso.requestId} aprovisionada con referencia ${solicitudAcceso.externalReference}"
```

## Regla de seguridad funcional

Nunca establecer:

```text
estado = COMPLETADA
```

antes de comprobar que el connector terminó correctamente y devolvió `status = PROVISIONED` con `external_reference`.
