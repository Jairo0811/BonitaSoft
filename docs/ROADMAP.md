# Roadmap — BonitaSoft ISO-815

## Estado general

**Estado final: FROZEN / CODE COMPLETE 🧊✅**

El repositorio queda cerrado para esta entrega académica. La investigación, arquitectura, BPMN definitivo, BDM, contratos, organización, actores, formularios especificados, expresiones Groovy, REST connector, recuperación de errores, FastAPI, SQLite, dashboard React, pruebas, CI, demo y material académico están consolidados en `main`.

No quedan tareas de desarrollo planificadas dentro del alcance congelado.

> La ejecución física dentro de Bonita Studio no fue certificada con evidencias reales. Por ese motivo el proyecto **no** se etiqueta como `Runtime Verified`. Esa validación queda fuera del alcance del congelamiento actual y solo requeriría una reapertura explícita del proyecto.

---

## Fase 0 — Inicialización ✅

- [x] Repositorio independiente.
- [x] Datos académicos e integrantes.
- [x] Estructura documental.
- [x] Enfoque BPM/SOA.

## Fase 1 — Investigación académica ✅

- [x] Los 11 puntos de la Práctica 3 desarrollados en `docs/research/`.
- [x] SOA y BPM.
- [x] Historia, características, módulos y componentes.
- [x] Competidores.
- [x] Dimensionamiento para 500 usuarios.
- [x] Elementos SOA.
- [x] Costos/TCO.
- [x] Seguridad, extensibilidad, DevOps y auditoría.
- [x] AS-IS / TO-BE, actores, reglas y criterios de éxito.

## Fase 2 — BPMN definitivo ✅

- [x] Inicio y finales.
- [x] Validación.
- [x] Human Task de aprobación.
- [x] Gateway Aprobada/Rechazada.
- [x] Service Task REST.
- [x] Boundary Error sobre la integración.
- [x] Tarea de recuperación y reintento.
- [x] BPMN 2.0 definitivo: `process/bpmn/solicitud-acceso-final.bpmn`.
- [x] BPMN portable validado por CI.

**Runtime local:** no certificado dentro del alcance congelado.

## Fase 3 — Paquete Bonita Studio ✅

- [x] BDM `SolicitudAcceso` definido.
- [x] Business variable `solicitudAcceso` definida.
- [x] Organización `/Empresa/Solicitantes` y `/Empresa/Aprobadores` definida.
- [x] Usuarios de demo y actores definidos.
- [x] Contrato de inicio definido.
- [x] Contrato de aprobación definido.
- [x] Formularios y validaciones especificados.
- [x] Operaciones BDM y expresiones Groovy preparadas.
- [x] Estados funcionales definidos.
- [x] Manifiestos machine-readable en `process/bonita/runtime/`.
- [x] Runbook final `process/bonita/RUNTIME_EXECUTION_PACKET.md`.
- [x] Validador `scripts/validate-bonita-pack.py`.
- [x] CI `Bonita Runtime Pack CI` en verde.

**Despliegue en Studio:** no certificado; no se representa como ejecutado.

## Fase 4 — Integración REST ✅

- [x] FastAPI local.
- [x] `POST /provision`.
- [x] `GET /audit` y `GET /audit/{request_id}`.
- [x] `/health`.
- [x] Idempotencia por `request_id`.
- [x] Persistencia SQLite.
- [x] Payload JSON definitivo.
- [x] Mapeo `external_reference` → `solicitudAcceso.externalReference`.
- [x] Estado final `COMPLETADA` especificado.
- [x] Configuración del connector versionada en `process/bonita/runtime/rest-connector.json`.

**Ejecución desde Bonita Studio:** no certificada.

## Fase 5 — Error, reintento, pruebas y auditoría ✅

- [x] Ruta aprobada definida.
- [x] Ruta rechazada definida.
- [x] API caída definida.
- [x] Boundary Error definido en BPMN.
- [x] Estado `ERROR_INTEGRACION` definido.
- [x] Recuperación/reintento definido.
- [x] Escenarios `E2E-01` a `E2E-05` versionados.
- [x] Mock API con tests automatizados y CI.
- [x] Dashboard con datos reales SQLite/FastAPI.
- [x] Convención de evidencias definida.

**E2E dentro de Bonita Studio y capturas reales:** no certificados.

## Fase 6 — Demo y entrega ✅

- [x] Guion de demo.
- [x] Datos de demostración.
- [x] Presentación y fuentes.
- [x] README final.
- [x] Launcher local Windows.
- [x] Helper de runtime Bonita/FastAPI.
- [x] Branding final.
- [x] Frontend responsive + Font Awesome.
- [x] Paquete Bonita reproducible y documentado.

## Fase 7 — Cierre y congelamiento ✅

- [x] Estado final documentado.
- [x] README marcado `FROZEN / CODE COMPLETE`.
- [x] Documento `docs/FROZEN.md` creado.
- [x] Alcance del runtime no certificado dejado explícito.
- [x] Desarrollo futuro condicionado a reapertura o nueva versión.
- [x] Proyecto congelado el **2026-10-04**.

---

## Matriz de cierre

| Área | Estado |
|---|:---:|
| Investigación | ✅ 100% |
| React / TypeScript / Vite | ✅ 100% |
| FastAPI / SQLite | ✅ 100% |
| BPMN y paquete Bonita | ✅ 100% repo-side |
| CI API / Frontend / paquete Bonita | ✅ |
| Pruebas automatizadas | ✅ |
| Documentación y demo | ✅ |
| Repositorio | 🧊 FROZEN |
| Runtime físico Bonita Studio | ⚪ No certificado |
| Evidencias físicas Bonita | ⚪ No certificadas |

## Decisión final

BonitaSoft ISO-815 se cierra como:

```text
FROZEN / CODE COMPLETE
Runtime verification: NOT CERTIFIED
Frozen: 2026-10-04
```

No se sustituye una ejecución real de Bonita Studio con una afirmación documental. Si en el futuro se desea obtener la etiqueta `Runtime Verified`, deberá reabrirse explícitamente el proyecto, ejecutar el runbook de `process/bonita/` y adjuntar las evidencias reales.
