# BonitaSoft BPM Dashboard — React

Dashboard visual ejecutable para el complemento práctico de ISO-815. Implementa la identidad del proyecto —azul profundo, azul eléctrico, rojo Bonita y blanco— sobre el caso **Solicitud de acceso a sistema corporativo**.

> Este dashboard se conecta a la **Mock API FastAPI local** incluida en `demo/mock-api`. Sigue siendo un complemento académico: no sustituye la verificación pendiente del runtime de Bonita Studio.

## Funcionalidad actual

- sidebar y topbar responsivos;
- búsqueda compartida entre casos, auditoría y usuarios;
- indicadores calculados desde la API;
- health check de FastAPI y SQLite;
- creación de solicitudes persistentes;
- cola de aprobación humana;
- aprobar solicitud → `POST /requests/{id}/approve` → aprovisionamiento REST;
- rechazar solicitud → `POST /requests/{id}/reject`;
- reintentar solicitudes en error;
- referencia externa `ACC-...` generada al aprovisionar;
- auditoría individual mediante `GET /audit/{request_id}`;
- colección de auditoría mediante `GET /audit`;
- detalle persistente de cada caso mediante `GET /requests/{id}`;
- historial completo mediante `GET /requests/{id}/events`;
- usuarios persistentes mediante `GET /users`;
- tema compartido desde `../theme/`.

## Persistencia SQLite

La Mock API usa SQLite como fuente local de verdad. La base se crea automáticamente en:

```text
demo/mock-api/data/bonitasoft.db
```

No se requiere instalar ningún paquete adicional: el backend utiliza `sqlite3` de la biblioteca estándar de Python.

La base mantiene entre reinicios:

- usuarios;
- solicitudes;
- estado actual de cada solicitud;
- referencias externas;
- auditorías de aprovisionamiento;
- historial de eventos de cada caso.

El archivo `.db` está excluido de Git mediante `.gitignore`, por lo que cada instalación mantiene sus propios datos locales.

### Reiniciar los datos de demostración

Con FastAPI detenido, desde la raíz del repositorio:

```powershell
Remove-Item .\demo\mock-api\data\bonitasoft.db -ErrorAction SilentlyContinue
```

Al volver a iniciar la API se creará una base nueva con los datos semilla coherentes.

## Secciones funcionales

### Dashboard

Resumen operativo con KPI, distribución de estados, estado de FastAPI, flujo activo, tareas pendientes e instancias recientes. Los KPI de integraciones se calculan a partir de la misma base SQLite que alimenta auditoría y casos.

### Mis tareas

Bandeja de trabajo para solicitudes en `PENDING_APPROVAL` y `ERROR`. Permite aprobar, rechazar y reintentar desde la interfaz.

### Procesos

Vista del proceso **Solicitud de acceso a sistema corporativo**, con métricas, actores, reglas de decisión y flujo visual.

### Casos

Listado completo de instancias con filtros por estado, búsqueda, referencias externas y acciones contextuales. Al pulsar el ID de una solicitud se abre su detalle lateral y la línea de tiempo persistente del caso.

Eventos registrados actualmente:

```text
REQUEST_CREATED
APPROVED
RETRY_STARTED
PROVISIONED
PROVISION_FAILED
REJECTED
```

### Diseño BPMN

Vista ampliada del flujo y catálogo de elementos BPMN utilizados: inicio, validación, tarea humana, gateway, service task y eventos de fin.

### Integraciones

Estado del servicio FastAPI, métricas REST y catálogo de endpoints. Los endpoints pueden copiarse directamente desde la interfaz.

### Auditoría

Timeline persistente de aprovisionamientos. Muestra request id, usuario, sistema, nivel de acceso, referencia externa y fecha.

### Usuarios

Directorio persistente de usuarios. Muestra sistemas solicitados, cantidad histórica de solicitudes, accesos completados y última actividad.

## Endpoints principales

```text
GET  /health
GET  /requests
GET  /requests/{id}
GET  /requests/{id}/events
POST /requests
POST /requests/{id}/approve
POST /requests/{id}/reject
POST /requests/{id}/retry
POST /provision
GET  /audit
GET  /audit/{request_id}
GET  /users
GET  /stats
```

## Ejecutar manualmente

### Terminal 1 — API

Desde la raíz del repositorio:

```powershell
cd .\demo\mock-api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API: `http://localhost:8000`

Swagger: `http://localhost:8000/docs`

### Terminal 2 — React

```powershell
cd .\ui\dashboard-react
npm install
npm run dev
```

Dashboard: `http://localhost:5173`

## Ejecutar en Windows con un solo comando

Desde la raíz de `BonitaSoft`:

```powershell
.\scripts\start-local.ps1 -Install
```

La opción `-Install` prepara el entorno Python y las dependencias npm. En ejecuciones posteriores basta con:

```powershell
.\scripts\start-local.ps1
```

El script abre una ventana de PowerShell para FastAPI, otra para Vite y luego abre el navegador.

## Flujo funcional local

```text
Nueva solicitud
      ↓
REQUEST_CREATED
      ↓
PENDING_APPROVAL
      ↓
Aprobar ─────────────────── Rechazar
   ↓                            ↓
APPROVED                    REJECTED
   ↓                            ↓
IN_PROGRESS                 Fin
   ↓
REST /provision
   ↓
PROVISIONED
   ↓
COMPLETED + ACC-...
   ↓
Auditoría + historial SQLite
```

## Comprobar persistencia

Una prueba manual sencilla:

1. crea una solicitud;
2. apruébala;
3. abre **Casos** y pulsa su ID para revisar el historial;
4. comprueba la referencia en **Auditoría**;
5. cierra FastAPI y React;
6. ejecuta nuevamente `./scripts/start-local.ps1`;
7. verifica que la solicitud, usuario, auditoría e historial siguen disponibles.

## Build de producción

```powershell
npm run build
```

## Variables de entorno opcionales

Frontend:

```text
VITE_API_BASE_URL=http://localhost:8000
```

Backend, para cambiar la ubicación de la base:

```text
BONITASOFT_DB_PATH=C:\ruta\personalizada\bonitasoft.db
```

## Limitación académica

La UI, FastAPI y SQLite ya forman un flujo local funcional, persistente y verificable. Sin embargo, **Bonita Studio continúa siendo el gate de runtime real** del proyecto. No debe presentarse esta aplicación como evidencia de un runtime Bonita ejecutado mientras `docs/ROADMAP.md` mantenga pendiente esa validación.
