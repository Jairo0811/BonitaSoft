# BPMN — Solicitud de acceso

Este directorio contiene los artefactos BPMN 2.0 del proceso de BonitaSoft.

## Archivos

- `PROCESS_SPEC.md` — especificación funcional del proceso.
- `solicitud-acceso-reference.bpmn` — primer modelo portable de referencia.
- `solicitud-acceso-final.bpmn` — **modelo BPMN 2.0 definitivo del repositorio**.

## Modelo definitivo

`solicitud-acceso-final.bpmn` incluye:

- evento de inicio;
- validación;
- Human Task de aprobación;
- gateway Aprobada/Rechazada;
- preparación del aprovisionamiento;
- Service Task REST;
- Boundary Error asociado al REST;
- tarea humana de recuperación;
- reintento hacia el connector;
- cierre aprobado;
- cierre rechazado.

El archivo se valida automáticamente mediante `scripts/validate-bonita-pack.py` y `Bonita Runtime Pack CI`.

## Nota de ejecutabilidad

El BPMN es un artefacto estándar y portable. No se declara como una exportación nativa `.bos` de Bonita ni como evidencia de runtime. Los contratos, BDM, actores, formularios y connector se aplican en Bonita Studio siguiendo `process/bonita/RUNTIME_EXECUTION_PACKET.md`.

El estado `Runtime Verified` solo se obtiene después de ejecutar las rutas reales en Studio y guardar evidencias.
