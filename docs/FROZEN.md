# BonitaSoft ISO-815 — Estado congelado

**Fecha de congelamiento:** 2026-10-04

## Estado final

El repositorio queda **FROZEN / CODE COMPLETE**.

Se consideran cerrados y sin trabajo de desarrollo pendiente:

- investigación académica de ISO-815;
- arquitectura y proceso BPM;
- BPMN 2.0 definitivo portable;
- definición del BDM `SolicitudAcceso`;
- contratos, actores, organización y formularios especificados;
- expresiones Groovy y operaciones de negocio;
- configuración del REST Connector hacia `POST http://localhost:8000/provision`;
- manejo de `COMPLETADA`, `ERROR_INTEGRACION` y reintento;
- escenarios E2E versionados;
- FastAPI + SQLite;
- dashboard React/TypeScript;
- branding final, responsive y Font Awesome;
- pruebas automatizadas y GitHub Actions;
- documentación, runbooks, demo y evidencias esperadas.

## Límite de certificación

No se declara **Bonita Runtime Verified** porque no se incorporaron evidencias de una ejecución física dentro de una instalación local de Bonita Studio.

Esto significa que el proyecto está terminado y congelado como entrega de código/documentación, pero no afirma que el BDM, organización, formularios y connector hayan sido desplegados y ejecutados realmente dentro de Bonita Studio.

La configuración necesaria para realizar esa validación permanece versionada en:

```text
process/bonita/
process/bonita/runtime/
process/bpmn/solicitud-acceso-final.bpmn
```

## Política de congelamiento

A partir de este punto no se planifican nuevas funcionalidades, rediseños ni cambios de arquitectura para esta entrega académica.

Cualquier trabajo futuro deberá tratarse como una reapertura explícita del proyecto o una nueva versión posterior al congelamiento.

## Identificador del cierre

```text
BonitaSoft ISO-815
FROZEN / CODE COMPLETE
Runtime verification: NOT CERTIFIED
Frozen: 2026-10-04
```
