# Contratos y operaciones

## 1. Contrato de instanciación

Crear una estructura compleja llamada `requestInput`:

```text
requestInput
  nombreSolicitante: TEXT
  correo: TEXT
  departamento: TEXT
  sistema: TEXT
  nivelAcceso: TEXT
  justificacion: TEXT
```

### Validaciones

- `nombreSolicitante`: obligatorio, 3–120 caracteres.
- `correo`: obligatorio, formato email.
- `departamento`: obligatorio.
- `sistema`: obligatorio.
- `nivelAcceso`: obligatorio.
- `justificacion`: obligatorio, mínimo 20 caracteres.

## 2. Operación de inicio

Crear/actualizar `solicitudAcceso` con los valores del contrato y:

```text
requestId = generarRequestId()
estado = "PENDIENTE"
createdAt = now
aprobada = null
externalReference = null
closedAt = null
```

## 3. Tarea humana — Revisar y decidir solicitud

Actor: `Aprobador`.

Contrato:

```text
decisionInput
  aprobada: BOOLEAN
  comentarioAprobador: TEXT
```

### Validación funcional

Si `decisionInput.aprobada == false`, `comentarioAprobador` debe contener texto.

### Operaciones al completar la tarea

```text
solicitudAcceso.aprobada = decisionInput.aprobada
solicitudAcceso.comentarioAprobador = decisionInput.comentarioAprobador
solicitudAcceso.estado = decisionInput.aprobada ? "APROBADA" : "RECHAZADA"
```

Si se rechaza:

```text
solicitudAcceso.closedAt = now
```

## 4. Gateway exclusivo

Ruta aprobada:

```groovy
solicitudAcceso.aprobada == true
```

Ruta rechazada:

```groovy
solicitudAcceso.aprobada == false
```

No usar una ruta por defecto para ocultar decisiones nulas durante la construcción; una decisión nula debe detectarse como configuración incompleta.

## 5. Antes del connector REST

Antes de ejecutar `Provisionar acceso`:

```text
solicitudAcceso.estado = "PROVISIONANDO"
```

## 6. Después del connector exitoso

Mapear la respuesta y ejecutar:

```text
solicitudAcceso.externalReference = external_reference
solicitudAcceso.estado = "COMPLETADA"
solicitudAcceso.closedAt = now
```

## 7. En error técnico

El caso no puede quedar como `COMPLETADA`.

Estado esperado:

```text
solicitudAcceso.estado = "ERROR_INTEGRACION"
```

El flujo debe permanecer recuperable mediante una tarea humana `Resolver error de integración` o mediante la estrategia de reintento configurada en Bonita Studio.

## 8. Tarea opcional — Resolver error de integración

Actor: `Aprobador` o un actor técnico independiente si se desea separar responsabilidades.

Contrato sugerido:

```text
retryInput
  reintentar: BOOLEAN
  comentario: TEXT
```

Ruta:

```text
reintentar == true  → volver a Provisionar acceso
reintentar == false → cerrar con ERROR_INTEGRACION
```
