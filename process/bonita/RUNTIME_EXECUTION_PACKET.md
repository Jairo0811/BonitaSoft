# Bonita Studio — Paquete de ejecución final

Este documento consolida la configuración necesaria para llevar el proceso **Solicitud de acceso a sistema corporativo** desde el diseño del repositorio hasta una ejecución verificable en Bonita Studio.

> Importante: este archivo prepara la ejecución, pero **Runtime Verified** solo se puede marcar después de ejecutar los casos dentro de Bonita Studio y guardar evidencias reales.

## 1. Business Data Model

Crear el package:

```text
com.jmsoftware.bonitasoft.model
```

Crear el objeto:

```text
SolicitudAcceso
```

Atributos:

| Atributo | Tipo | Obligatorio al crear |
|---|---|---:|
| requestId | String | Sí |
| nombreSolicitante | String | Sí |
| correo | String | Sí |
| departamento | String | Sí |
| sistema | String | Sí |
| nivelAcceso | String | Sí |
| justificacion | String | Sí |
| estado | String | Sí |
| aprobada | Boolean | No |
| comentarioAprobador | String | No |
| externalReference | String | No |
| createdAt | Date/DateTime compatible con la versión instalada | Sí |
| closedAt | Date/DateTime compatible con la versión instalada | No |

Estados permitidos por la solución:

```text
PENDIENTE
EN_REVISION
APROBADA
RECHAZADA
PROVISIONANDO
COMPLETADA
ERROR_INTEGRACION
```

Después de guardar el BDM, desplegarlo en el runtime de desarrollo de Studio.

## 2. Organización

Organización de desarrollo:

```text
BonitaSoft ISO-815
```

Grupos:

```text
Empresa
├── Solicitantes
└── Aprobadores
```

Rol común:

```text
member
```

Usuarios de prueba:

| Usuario | Grupo | Rol | Uso |
|---|---|---|---|
| solicitante.demo | Solicitantes | member | iniciar solicitudes |
| aprobador.demo | Aprobadores | member | aprobar/rechazar |

Los passwords se definen localmente en Studio y no se versionan en Git.

Actores del proceso:

```text
Solicitante -> grupo Solicitantes
Aprobador   -> grupo Aprobadores
```

## 3. BPMN definitivo

Nombre del pool:

```text
Solicitud de acceso a sistema corporativo
```

Versión inicial recomendada:

```text
1.0
```

Flujo:

```text
Inicio
  ↓
Validar solicitud
  ↓
Revisar y decidir solicitud [Human Task / Aprobador]
  ↓
Gateway ¿Aprobada?
  ├── No → Registrar rechazo → Fin rechazado
  └── Sí → Preparar aprovisionamiento
              ↓
           Provisionar acceso [REST connector]
              ↓
           Fin completado
```

Para la ruta técnica de error, si el connector queda FAILED en el runtime, conservar el caso como incidente técnico y reejecutar/replay el connector una vez restablecida FastAPI. El BDM debe permanecer sin `COMPLETADA` mientras el connector no haya finalizado correctamente.

## 4. Variable de negocio

En el pool declarar una business variable:

```text
solicitudAcceso
```

Tipo:

```text
com.jmsoftware.bonitasoft.model.SolicitudAcceso
```

## 5. Contrato de inicio

Contrato:

```text
requestInput
  nombreSolicitante: TEXT
  correo: TEXT
  departamento: TEXT
  sistema: TEXT
  nivelAcceso: TEXT
  justificacion: TEXT
```

Restricciones mínimas:

- todos los campos obligatorios;
- correo con formato válido;
- justificación no vacía;
- sistema y nivel de acceso no vacíos.

Operación de inicialización conceptual:

```groovy
import com.jmsoftware.bonitasoft.model.SolicitudAcceso

def solicitud = new SolicitudAcceso()
solicitud.requestId = "SA-" + java.util.UUID.randomUUID()
    .toString()
    .replace("-", "")
    .substring(0, 8)
    .toUpperCase()
solicitud.nombreSolicitante = requestInput.nombreSolicitante
solicitud.correo = requestInput.correo
solicitud.departamento = requestInput.departamento
solicitud.sistema = requestInput.sistema
solicitud.nivelAcceso = requestInput.nivelAcceso
solicitud.justificacion = requestInput.justificacion
solicitud.estado = "PENDIENTE"
solicitud.aprobada = null
solicitud.comentarioAprobador = null
solicitud.externalReference = null
solicitud.createdAt = new Date()
solicitud.closedAt = null
return solicitud
```

Ajustar únicamente la sintaxis de fecha si la versión instalada utiliza un tipo temporal distinto.

## 6. Formulario de solicitud

Generar el formulario desde el contrato de inicio.

Campos visibles:

- Nombre solicitante
- Correo
- Departamento
- Sistema
- Nivel de acceso
- Justificación

Botón principal:

```text
Enviar solicitud
```

Resultado esperado al enviar:

```text
solicitudAcceso.estado == "PENDIENTE"
```

## 7. Human Task de aprobación

Nombre:

```text
Revisar y decidir solicitud
```

Actor:

```text
Aprobador
```

Contrato:

```text
decisionInput
  aprobada: BOOLEAN
  comentarioAprobador: TEXT
```

El formulario debe mostrar en lectura:

- requestId
- solicitante
- correo
- departamento
- sistema
- nivel
- justificación

Campos editables:

- decisión Aprobar/Rechazar
- comentario

Regla:

```text
si aprobada == false, comentarioAprobador es obligatorio
```

Operaciones al completar la tarea:

```groovy
solicitudAcceso.aprobada = decisionInput.aprobada
solicitudAcceso.comentarioAprobador = decisionInput.comentarioAprobador
solicitudAcceso.estado = decisionInput.aprobada ? "APROBADA" : "RECHAZADA"
if (!decisionInput.aprobada) {
    solicitudAcceso.closedAt = new Date()
}
```

## 8. Gateway

Gateway exclusivo:

```text
¿Aprobada?
```

Condición ruta aprobada:

```groovy
solicitudAcceso.aprobada == true
```

Condición ruta rechazada:

```groovy
solicitudAcceso.aprobada == false
```

La ruta rechazada termina sin ejecutar el REST connector.

## 9. Preparación de aprovisionamiento

Antes del connector actualizar:

```text
estado = PROVISIONANDO
```

Operación:

```groovy
solicitudAcceso.estado = "PROVISIONANDO"
```

## 10. REST Connector

Tipo:

```text
REST POST
```

URL:

```text
http://localhost:8000/provision
```

Content-Type:

```text
application/json
```

Charset:

```text
UTF-8
```

Payload Groovy recomendado:

```groovy
import groovy.json.JsonOutput

return JsonOutput.toJson([
    request_id  : solicitudAcceso.requestId,
    user_email  : solicitudAcceso.correo,
    system      : solicitudAcceso.sistema,
    access_level: solicitudAcceso.nivelAcceso
])
```

Respuesta esperada:

```json
{
  "request_id": "SA-XXXXXXXX",
  "status": "PROVISIONED",
  "external_reference": "ACC-XXXXXXXXXXXX",
  "provisioned_at": "..."
}
```

Mapeo posterior al éxito:

1. obtener el cuerpo JSON del connector;
2. parsearlo;
3. copiar `external_reference` a `solicitudAcceso.externalReference`;
4. validar `status == "PROVISIONED"`;
5. actualizar `estado = "COMPLETADA"`;
6. asignar `closedAt`.

Expresión conceptual:

```groovy
import groovy.json.JsonSlurper

def json = new JsonSlurper().parseText(responseBody as String)
if (json.status != "PROVISIONED") {
    throw new IllegalStateException("Respuesta inesperada del servicio: ${json.status}")
}
solicitudAcceso.externalReference = json.external_reference as String
solicitudAcceso.estado = "COMPLETADA"
solicitudAcceso.closedAt = new Date()
```

El nombre exacto de la variable de salida (`responseBody`, `body`, etc.) debe seleccionarse según la salida ofrecida por el REST connector de la versión instalada de Studio.

## 11. Ruta de error y reintento

### Preparación

1. Ejecutar una solicitud válida.
2. Aprobarla.
3. Antes de que se ejecute `/provision`, detener FastAPI.

Resultado esperado:

- el connector falla;
- el caso NO queda `COMPLETADA`;
- `externalReference` sigue vacía;
- el fallo queda visible en el runtime/monitorización del caso.

Estado funcional esperado para documentar el incidente:

```text
ERROR_INTEGRACION
```

Si se modela una tarea explícita de recuperación, actualizar el BDM a ese estado antes de `Resolver error de integración`.

### Reintento

1. volver a levantar FastAPI;
2. verificar `/health`;
3. reejecutar/replay el connector fallido o completar la tarea de recuperación que vuelve a invocarlo;
4. comprobar `PROVISIONED`;
5. comprobar `externalReference`;
6. comprobar `COMPLETADA`.

La API es idempotente por `request_id`, por lo que repetir el mismo aprovisionamiento no debe crear una segunda referencia para el mismo caso.

## 12. Pruebas E2E

### E2E-01 — Ruta aprobada

Entrada:

```text
Nombre: Jairo Matías
Correo: jairo@example.com
Departamento: Tecnología
Sistema: Sistema de Activos
Nivel: Estándar
Justificación: Validación E2E del proceso ISO-815
```

Esperado:

```text
PENDIENTE
→ APROBADA
→ PROVISIONANDO
→ POST /provision
→ ACC-...
→ COMPLETADA
```

### E2E-02 — Ruta rechazada

Esperado:

```text
PENDIENTE
→ RECHAZADA
→ Fin
```

No debe existir una nueva auditoría de aprovisionamiento para ese requestId.

### E2E-03 — API caída

Esperado:

```text
APROBADA
→ PROVISIONANDO
→ connector FAILED
```

No debe quedar `COMPLETADA`.

### E2E-04 — Reintento

Con FastAPI nuevamente disponible:

```text
connector FAILED
→ replay/retry
→ PROVISIONED
→ COMPLETADA
```

### E2E-05 — Trazabilidad

Confirmar en FastAPI:

```text
GET /audit
GET /audit/{request_id}
```

Confirmar también el timeline/caso en Bonita.

## 13. Evidencias obligatorias

Guardar con estos nombres:

```text
assets/evidence/01-bpmn-studio.png
assets/evidence/02-bdm-solicitud-acceso.png
assets/evidence/03-organizacion-actores.png
assets/evidence/04-formulario-inicio.png
assets/evidence/05-human-task-aprobacion.png
assets/evidence/06-gateway.png
assets/evidence/07-rest-connector.png
assets/evidence/08-caso-aprobado.png
assets/evidence/09-caso-rechazado.png
assets/evidence/10-api-caida.png
assets/evidence/11-reintento.png
assets/evidence/12-caso-finalizado-historial.png
```

Opcional pero recomendado:

```text
assets/evidence/13-audit-api.png
assets/evidence/14-bdm-record.png
```

## 14. Criterio de cierre

No marcar el proyecto como Runtime Verified hasta comprobar todos estos puntos:

- [ ] BDM desplegado en Studio.
- [ ] Organización desplegada.
- [ ] Actores mapeados.
- [ ] Formulario de inicio ejecutado.
- [ ] Human Task ejecutada por `aprobador.demo`.
- [ ] Gateway aprobado validado.
- [ ] Gateway rechazado validado.
- [ ] REST connector devuelve `PROVISIONED`.
- [ ] `externalReference` queda persistida.
- [ ] Caso aprobado termina `COMPLETADA`.
- [ ] API caída produce un fallo real del connector.
- [ ] Reintento completa el caso.
- [ ] Auditoría REST verificada.
- [ ] Evidencias guardadas.

Después de completar esta lista:

1. actualizar `docs/ROADMAP.md`;
2. cambiar README de `Runtime Pending` a `Runtime Verified`;
3. cerrar GitHub Issue #2;
4. ejecutar una última revisión del repositorio;
5. congelar BonitaSoft ISO-815.
