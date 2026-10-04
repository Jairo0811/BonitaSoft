# Business Data Model — SolicitudAcceso

Entidad persistente principal del proceso.

## Entidad

`SolicitudAcceso`

| Atributo | Tipo recomendado | Nullable | Uso |
|---|---|---:|---|
| requestId | String | No | Identificador funcional `SA-...` |
| nombreSolicitante | String | No | Nombre mostrado en tareas y auditoría |
| correo | String | No | Usuario a aprovisionar |
| departamento | String | No | Área solicitante |
| sistema | String | No | Sistema destino |
| nivelAcceso | String | No | Lectura / Estándar / Operación / Supervisor / Administración |
| justificacion | String/Text | No | Motivo de la solicitud |
| estado | String | No | Estado funcional del caso |
| aprobada | Boolean | Sí | Decisión humana; `null` hasta decidir |
| comentarioAprobador | String/Text | Sí | Comentario de la decisión |
| externalReference | String | Sí | Referencia `ACC-...` retornada por FastAPI |
| createdAt | DateTime | No | Fecha de creación |
| closedAt | DateTime | Sí | Fecha de cierre |

## Estados funcionales

Usar exactamente estos valores para mantener coherencia con el resto del proyecto:

```text
PENDIENTE
EN_REVISION
APROBADA
RECHAZADA
PROVISIONANDO
COMPLETADA
ERROR_INTEGRACION
```

## Variable de negocio en el pool

Crear una Business Variable:

```text
Nombre: solicitudAcceso
Tipo: SolicitudAcceso
Persistencia: Business Data
```

## Inicialización

Al iniciar el caso:

```text
requestId           = SA-<identificador>
nombreSolicitante   = requestInput.nombreSolicitante
correo               = requestInput.correo
departamento         = requestInput.departamento
sistema              = requestInput.sistema
nivelAcceso          = requestInput.nivelAcceso
justificacion        = requestInput.justificacion
estado               = PENDIENTE
aprobada             = null
comentarioAprobador  = null
externalReference    = null
createdAt            = now
closedAt             = null
```

## Índices / unicidad

Si la versión de Bonita utilizada permite restricciones o índices de BDM configurables, `requestId` debe tratarse como identificador funcional único. No reutilizar un `requestId` entre casos.

## Mapeo hacia FastAPI

| BDM | JSON REST |
|---|---|
| `requestId` | `request_id` |
| `correo` | `user_email` |
| `sistema` | `system` |
| `nivelAcceso` | `access_level` |
| `externalReference` | `external_reference` |
