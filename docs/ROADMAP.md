# Roadmap — BonitaSoft ISO-815

## Estado general

La investigación, arquitectura, modelo de referencia, contratos, integración auxiliar, pruebas, dashboard operativo, persistencia SQLite, paquete de runtime y material de exposición están **consolidados en el repositorio**.

Queda un único gate que no puede validarse solo desde Git/GitHub: ejecutar el proceso dentro de la versión concreta de **Bonita Studio** utilizada por el equipo y capturar las evidencias de runtime.

---

## Fase 0 — Inicialización ✅

- [x] Repositorio independiente.
- [x] Datos académicos.
- [x] Integrantes.
- [x] Estructura documental.
- [x] Enfoque BPM/SOA.

## Fase 1 — Investigación + proceso ✅

- [x] Desarrollar los 11 puntos solicitados por la Práctica 3.
- [x] Investigar SOA y BPM.
- [x] Documentar historia, características, módulos y componentes.
- [x] Analizar competidores.
- [x] Dimensionamiento de referencia para 500 usuarios.
- [x] Elementos SOA con Bonita.
- [x] Modelo de costos/TCO para 500 usuarios.
- [x] Aspectos adicionales: seguridad, extensibilidad, DevOps y auditoría.
- [x] Seleccionar proceso: Solicitud de acceso a sistema.
- [x] AS-IS y TO-BE.
- [x] Actores, datos, reglas y criterios de éxito.

## Fase 2 — Modelado BPMN ✅ / Runtime pending

- [x] Definir eventos de inicio y fin.
- [x] Definir tarea humana.
- [x] Definir tarea automática/integración.
- [x] Gateway aprobado/rechazado.
- [x] Ruta de error y reintento.
- [x] Crear especificación formal.
- [x] Crear BPMN 2.0 de referencia.
- [ ] Validar el diagrama final dentro de Bonita Studio.

> El `.bpmn` del repositorio es un artefacto estándar de referencia, no se presenta como el archivo ejecutable final de Bonita.

## Fase 3 — Implementación Bonita — paquete completo 🟡

- [x] Definir organización y actores.
- [x] Definir Business Data Model.
- [x] Definir contratos.
- [x] Definir formularios y validaciones.
- [x] Definir tarea humana.
- [x] Definir reglas del gateway.
- [x] Crear runbook paso a paso.
- [x] Crear paquete detallado `process/bonita/`.
- [x] Documentar expresiones Groovy de apoyo.
- [x] Documentar estados funcionales del caso.
- [x] Crear checklist de runtime.
- [x] Crear convención de evidencias.
- [ ] Aplicar/validar configuración en Bonita Studio.

Documentos:

- `docs/implementation/BONITA_STUDIO_IMPLEMENTATION.md`
- `process/bonita/README.md`
- `process/bonita/RUNTIME_CHECKLIST.md`

## Fase 4 — Integración ✅ / Bonita connector pending

- [x] Seleccionar API local open source: FastAPI.
- [x] Implementar `POST /provision`.
- [x] Implementar `GET /audit/{request_id}`.
- [x] Health endpoint.
- [x] Idempotencia por `request_id`.
- [x] Persistencia SQLite.
- [x] Dockerfile.
- [x] Documentar payload y respuesta.
- [x] Documentar manejo de errores.
- [x] Documentar configuración exacta del connector en `process/bonita/REST_CONNECTOR.md`.
- [ ] Configurar y ejecutar el REST Connector dentro de Bonita Studio.

## Fase 5 — Pruebas y auditoría ✅ / E2E Bonita pending

- [x] Diseñar casos de prueba.
- [x] Crear pruebas automatizadas para la Mock API.
- [x] Agregar CI de la Mock API.
- [x] Definir ruta aprobada.
- [x] Definir ruta rechazada.
- [x] Definir prueba de API caída.
- [x] Definir recuperación/reintento.
- [x] Definir evidencia de auditoría.
- [x] Dashboard React alimentado por datos reales SQLite/FastAPI.
- [ ] Ejecutar casos end-to-end desde Bonita.
- [ ] Capturar evidencias reales del runtime.

## Fase 6 — Demo y entrega académica ✅ / ejecución pending

- [x] Guion de demo.
- [x] Datos de demostración.
- [x] Outline de presentación.
- [x] Fuentes para diapositivas.
- [x] Documentación técnica consolidada.
- [x] Estructura para evidencias.
- [x] Convención de nombres en `assets/evidence/README.md`.
- [ ] Capturas finales de Bonita Studio.
- [ ] Demo final en el entorno del equipo.

---

## Criterio de cierre académico

### Investigación

**Lista.** Los 11 puntos de la Práctica 3 están documentados en `docs/research/`.

### Complemento práctico

**Preparado para ejecución.** El repositorio contiene diseño, contratos, API, persistencia, dashboard, pruebas, CI, runbook y paquete de runtime.

### Runtime Verified

Solo marcar como **COMPLETO 100% / Runtime Verified** cuando el equipo ejecute en Bonita Studio:

1. ruta aprobada;
2. ruta rechazada;
3. REST connector exitoso;
4. error de integración;
5. recuperación/reintento;
6. trazabilidad del caso.

No se debe sustituir esta verificación con una afirmación documental.
