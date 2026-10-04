# Roadmap — BonitaSoft ISO-815

## Estado general

**Estado del repositorio: CODE COMPLETE ✅**

La investigación, arquitectura, BPMN definitivo, BDM, contratos, organización, actores, formularios especificados, expresiones Groovy, REST connector, recuperación de errores, FastAPI, SQLite, dashboard React, pruebas, CI, demo y material académico están consolidados en `main`.

El único gate restante no es de código: **ejecutar el proceso en la versión concreta de Bonita Studio instalada por el equipo y capturar evidencia real del runtime**.

---

## Fase 0 — Inicialización ✅

- [x] Repositorio independiente.
- [x] Datos académicos e integrantes.
- [x] Estructura documental.
- [x] Enfoque BPM/SOA.

## Fase 1 — Investigación académica ✅

- [x] Los 11 puntos de la Práctica 3 están desarrollados en `docs/research/`.
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
- [ ] Importar/recrear y validar visualmente en Bonita Studio.

> El BPMN del repositorio es estándar BPMN 2.0. La configuración ejecutable específica de Bonita depende de la versión de Studio usada localmente.

## Fase 3 — Implementación Bonita preparada ✅ / Runtime local pendiente

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
- [ ] Aplicar/desplegar esta configuración en Bonita Studio local.

## Fase 4 — Integración REST ✅ / Ejecución desde Bonita pendiente

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
- [ ] Ejecutar el REST Connector desde Bonita Studio.

## Fase 5 — Error, reintento, pruebas y auditoría ✅ / E2E Bonita pendiente

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
- [ ] Ejecutar E2E-01 a E2E-05 dentro de Bonita Studio.
- [ ] Capturar evidencias reales del runtime.

## Fase 6 — Demo y entrega ✅ / evidencia Bonita pendiente

- [x] Guion de demo.
- [x] Datos de demostración.
- [x] Presentación y fuentes.
- [x] README final.
- [x] Launcher local Windows.
- [x] Helper de runtime Bonita/FastAPI.
- [x] Branding final.
- [x] Frontend responsive + Font Awesome.
- [ ] Capturas finales de Bonita Studio.
- [ ] Demo final del runtime Bonita.

---

## Matriz de cierre

| Área | Estado |
|---|:---:|
| Investigación | ✅ 100% |
| React / TypeScript / Vite | ✅ 100% |
| FastAPI / SQLite | ✅ 100% |
| BPMN y paquete Bonita | ✅ 100% repo-side |
| CI del paquete Bonita | ✅ |
| Pruebas API / frontend | ✅ |
| Runtime Bonita Studio | 🟡 Requiere ejecución local |
| Evidencias Bonita | 🟡 Pendientes |

## Criterio para `Runtime Verified`

Solo cambiar el proyecto a **COMPLETO 100% / Runtime Verified** cuando existan evidencias reales de Bonita Studio para:

1. BDM desplegado;
2. organización y actores desplegados;
3. formulario de inicio;
4. Human Task ejecutada por el aprobador;
5. ruta aprobada;
6. ruta rechazada;
7. REST `/provision` exitoso;
8. `externalReference` persistida;
9. API caída con fallo real del connector;
10. reintento/replay exitoso;
11. auditoría y trazabilidad del caso.

Hasta ese momento, el estado correcto es **CODE COMPLETE / Runtime Verification Pending**. No se sustituye una ejecución real de Bonita con una afirmación documental.
