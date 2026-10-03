# Casos de prueba

| ID | Escenario | Precondición | Resultado esperado |
|---|---|---|---|
| TC-01 | Crear solicitud válida | Runtime activo | Instancia creada y tarea asignada |
| TC-02 | Datos obligatorios faltantes | Formulario abierto | No permite enviar |
| TC-03 | Aprobar solicitud | Tarea de revisión activa | Gateway toma ruta aprobada |
| TC-04 | Rechazar solicitud | Tarea de revisión activa | Caso termina RECHAZADA; no llama API |
| TC-05 | Aprobar sin comentario | Aprobación | Permitido si la regla solo exige comentario al rechazar |
| TC-06 | Rechazar sin comentario | Rechazo | Validación impide completar |
| TC-07 | REST 201 | API activa | Guarda referencia externa y termina COMPLETADA |
| TC-08 | API no disponible | API detenida | Integración falla y activa manejo/reintento |
| TC-09 | Repetir request_id | API activa | Servicio devuelve misma referencia; operación idempotente |
| TC-10 | Auditoría externa | Solicitud aprovisionada | `GET /audit/{id}` devuelve registro |

## Evidencias

Para la entrega capturar:

- formulario inicial;
- tarea del aprobador;
- instancia aprobada;
- instancia rechazada;
- respuesta REST;
- registro `/audit/{id}`;
- pantalla de error/reintento;
- diagrama final en Bonita Studio.

## Criterio de aceptación

La demo se considera funcional cuando TC-01, TC-03, TC-04, TC-07, TC-08 y TC-10 han sido ejecutados satisfactoriamente en el entorno real de Bonita utilizado por el equipo.
