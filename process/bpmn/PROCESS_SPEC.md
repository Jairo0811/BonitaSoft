# Especificación del proceso — Solicitud de acceso a sistema

## Objetivo

Demostrar en Bonita un flujo que combine BPMN, tarea humana, decisión, datos e integración REST.

## Actores

| Actor | Responsabilidad |
|---|---|
| Solicitante | Crea la solicitud de acceso |
| Aprobador | Revisa la justificación y aprueba/rechaza |
| Sistema | Valida, integra y registra el resultado |

## Datos principales

Entidad `SolicitudAcceso`:

- `requestId`: String / UUID
- `nombreSolicitante`: String
- `correo`: String
- `departamento`: String
- `sistema`: String
- `nivelAcceso`: String
- `justificacion`: String
- `estado`: String
- `aprobada`: Boolean
- `comentarioAprobador`: String
- `externalReference`: String nullable
- `createdAt`: DateTime
- `closedAt`: DateTime nullable

## Flujo TO-BE

```text
[Inicio]
   ↓
Capturar solicitud
   ↓
Validar datos
   ↓
[Tarea humana] Revisar solicitud
   ↓
<Gateway: aprobada?>
   ├─ No → estado=RECHAZADA → [Fin]
   └─ Sí
        ↓
     POST /provision
        ↓
     ¿Integración OK?
        ├─ Sí → estado=COMPLETADA → [Fin]
        └─ No → Resolver error → Reintentar
```

## Reglas mínimas

1. Nombre, correo, departamento, sistema, nivel y justificación son obligatorios.
2. El correo debe tener formato válido.
3. El aprobador debe indicar una decisión.
4. Si rechaza, debe incluir comentario.
5. Solo la ruta aprobada invoca el servicio de aprovisionamiento.
6. Una respuesta HTTP no exitosa debe tratarse como error técnico y no como aprobación completada.

## AS-IS académico

Antes de la automatización se asume un proceso manual:

```text
Correo/solicitud informal
   ↓
Revisión manual
   ↓
Aprobación por mensaje
   ↓
Técnico registra acceso
   ↓
Confirmación manual
```

Problemas: baja trazabilidad, datos incompletos, decisiones dispersas, dificultad para medir tiempos y dependencia de seguimiento manual.

## TO-BE

Bonita centraliza captura, asignación, decisión, llamada REST, estado e historial del caso.

## Criterios de éxito

- Ruta aprobada demostrable end-to-end.
- Ruta rechazada demostrable.
- Error de API contemplado.
- Decisión asociada a un usuario/aprobador.
- Resultado de integración almacenado.
- Evidencia de cada caso en la demo.

## Nota sobre `solicitud-acceso-reference.bpmn`

El archivo `.bpmn` del repositorio es un **modelo BPMN 2.0 de referencia** y no se declara ejecutable. El artefacto final ejecutable debe modelarse/importarse y validarse en la versión de Bonita Studio utilizada por el equipo, porque Bonita agrega configuración propia para contratos, actores, BDM, formularios y conectores.
