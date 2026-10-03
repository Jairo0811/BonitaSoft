# Runbook de implementación en Bonita Studio

Este documento convierte los artefactos del repositorio en una lista de configuración dentro de Bonita Studio.

## 1. Crear/abrir proyecto

Crear un proyecto Bonita compatible con la versión instalada y mantenerlo bajo control de versiones según las capacidades de esa versión.

## 2. Business Data Model

Crear entidad `SolicitudAcceso` con:

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
| createdAt | Date/DateTime según versión |
| closedAt | Date/DateTime según versión |

Desplegar BDM en el runtime de desarrollo.

## 3. Organización

Crear grupos/roles de demo:

```text
/Empresa
  /Solicitantes
  /Aprobadores
```

Usuarios de demo:

- `solicitante.demo`
- `aprobador.demo`

Mapear actores `Solicitante` y `Aprobador`.

## 4. Diagrama

Usar `process/bpmn/PROCESS_SPEC.md` y el `.bpmn` de referencia para reproducir:

```text
Inicio
 → Validar solicitud
 → Revisar y decidir (Human Task)
 → Gateway aprobada?
    ├─ No → Rechazada → Fin
    └─ Sí → Provisionar acceso (REST) → Completada → Fin
```

Agregar una estrategia de fallo/reintento para el connector.

## 5. Contrato de inicio

Crear estructura `requestInput` con los campos documentados en `process/forms/FORM_SPEC.md`.

En las operaciones de inicio:

- generar `requestId`;
- crear objeto `SolicitudAcceso`;
- establecer `estado = "PENDIENTE"`;
- establecer fecha de creación.

## 6. Formulario inicial

Generar formulario desde el contrato y agregar validaciones:

- requeridos;
- formato email;
- justificación mínima.

## 7. Tarea humana

En `Revisar y decidir solicitud`:

- actor: `Aprobador`;
- contrato: `aprobada`, `comentarioAprobador`;
- formulario con datos de solicitud en lectura;
- operación que actualiza el BDM.

## 8. Gateway

Rutas:

```text
aprobada == true  → Provisionar acceso
aprobada == false → Rechazada
```

En rechazo actualizar:

```text
estado = "RECHAZADA"
closedAt = now
```

## 9. REST Connector

Antes de ejecutar, iniciar `demo/mock-api`.

Configurar POST:

```text
http://localhost:8000/provision
```

Header:

```text
Content-Type: application/json
```

Payload conceptual:

```json
{
  "request_id": "<requestId>",
  "user_email": "<correo>",
  "system": "<sistema>",
  "access_level": "<nivelAcceso>"
}
```

Mapear respuesta:

- `external_reference` → `externalReference`;
- `status == PROVISIONED` → `estado = COMPLETADA`;
- `closedAt = now`.

## 10. Error handling

Probar con la API detenida. El caso no debe terminar como completado. Mantener el fallo visible o dirigir a la tarea `Resolver error de integración`, según el diseño elegido en Studio.

## 11. Validación

Ejecutar en este orden:

1. `TC-01` solicitud válida.
2. `TC-03` aprobación.
3. `TC-07` integración exitosa.
4. `TC-04` rechazo.
5. `TC-08` API caída.
6. `TC-10` auditoría.

Ver `demo/TEST_CASES.md`.

## 12. Evidencias

Guardar capturas en `assets/evidence/`:

- diagrama en Studio;
- BDM;
- organización;
- formulario;
- tarea humana;
- ruta aprobada;
- ruta rechazada;
- REST connector;
- respuesta de la API;
- error controlado;
- historial del caso.

## Criterio de cierre técnico

Solo marcar como **Runtime Verified** cuando el proceso haya sido ejecutado en Bonita Studio y se hayan validado las rutas aprobada, rechazada y de error. El repositorio por sí solo no demuestra esa ejecución.
