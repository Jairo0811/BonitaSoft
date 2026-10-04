# Checklist de runtime — Bonita Studio

Usar este documento durante la implementación y la exposición.

## A. Preparación

- [ ] Bonita Studio abierto con el proyecto del equipo.
- [ ] FastAPI local ejecutándose en `http://localhost:8000`.
- [ ] `GET /health` responde correctamente.
- [ ] BDM desplegado.
- [ ] Organización importada/configurada.
- [ ] Actores mapeados.

## B. BDM

- [ ] Existe `SolicitudAcceso`.
- [ ] `requestId` es String.
- [ ] Datos de solicitante configurados.
- [ ] Datos de sistema/nivel configurados.
- [ ] Estado funcional configurado.
- [ ] Decisión humana configurada.
- [ ] `externalReference` nullable.
- [ ] `createdAt` y `closedAt` configurados con tipo compatible con la versión instalada.

## C. Contrato de inicio

- [ ] `requestInput.nombreSolicitante`.
- [ ] `requestInput.correo`.
- [ ] `requestInput.departamento`.
- [ ] `requestInput.sistema`.
- [ ] `requestInput.nivelAcceso`.
- [ ] `requestInput.justificacion`.
- [ ] Validaciones obligatorias activas.
- [ ] Correo validado.
- [ ] Justificación mínima validada.

## D. Human Task

- [ ] Tarea `Revisar y decidir solicitud`.
- [ ] Actor `Aprobador`.
- [ ] Muestra datos del caso en lectura.
- [ ] Contrato `decisionInput.aprobada`.
- [ ] Contrato `decisionInput.comentarioAprobador`.
- [ ] Comentario obligatorio al rechazar.
- [ ] Operaciones actualizan BDM.

## E. Gateway

- [ ] Ruta aprobada: `solicitudAcceso.aprobada == true`.
- [ ] Ruta rechazada: `solicitudAcceso.aprobada == false`.
- [ ] Rechazo no ejecuta REST.
- [ ] Rechazo establece `RECHAZADA`.
- [ ] Rechazo establece `closedAt`.

## F. REST

- [ ] Actividad `Provisionar acceso`.
- [ ] Método POST.
- [ ] URL `http://localhost:8000/provision`.
- [ ] `Content-Type: application/json`.
- [ ] Payload usa datos del BDM.
- [ ] Respuesta parseada.
- [ ] `status == PROVISIONED` validado.
- [ ] `external_reference` almacenado.
- [ ] Caso termina `COMPLETADA` solo con éxito REST.

## G. Ruta aprobada

- [ ] Iniciar como solicitante.
- [ ] Crear solicitud válida.
- [ ] Abrir bandeja del aprobador.
- [ ] Aprobar.
- [ ] Ejecutar REST.
- [ ] Obtener `ACC-...`.
- [ ] Estado final `COMPLETADA`.
- [ ] `closedAt` informado.
- [ ] `/audit/{requestId}` devuelve el mismo resultado.

## H. Ruta rechazada

- [ ] Crear nueva solicitud.
- [ ] Rechazar con comentario.
- [ ] Estado final `RECHAZADA`.
- [ ] `closedAt` informado.
- [ ] No existe aprovisionamiento para ese `requestId`.

## I. Error y recuperación

- [ ] Crear nueva solicitud.
- [ ] Aprobar.
- [ ] Detener FastAPI o usar URL temporalmente inválida.
- [ ] Confirmar fallo del connector.
- [ ] Caso NO queda `COMPLETADA`.
- [ ] Estado visible `ERROR_INTEGRACION` o fallo técnico equivalente en Studio.
- [ ] Restaurar FastAPI.
- [ ] Reintentar.
- [ ] Estado final `COMPLETADA`.
- [ ] Referencia `ACC-...` disponible.

## J. Evidencias mínimas

- [ ] Diagrama completo en Studio.
- [ ] BDM.
- [ ] Contrato de inicio.
- [ ] Formulario de inicio.
- [ ] Human Task y contrato.
- [ ] Actores y organización.
- [ ] Gateway.
- [ ] REST connector.
- [ ] Ruta aprobada.
- [ ] Ruta rechazada.
- [ ] Error técnico.
- [ ] Reintento.
- [ ] Auditoría FastAPI.
- [ ] Historial/case details de Bonita.

## Resultado

Solo cuando todos los puntos críticos de G, H e I estén comprobados puede cambiarse el estado del repositorio a:

```text
Bonita Runtime Verified ✅
```
