# BonitaSoft BPM Dashboard — React

Dashboard visual ejecutable para el complemento práctico de ISO-815. Implementa la identidad del proyecto (azul profundo, azul eléctrico, rojo Bonita y blanco) sobre el caso **Solicitud de acceso a sistema corporativo**.

> Este dashboard se conecta a la **Mock API FastAPI local** incluida en `demo/mock-api`. Sigue siendo un complemento académico: no sustituye la verificación pendiente del runtime de Bonita Studio.

## Funcionalidad actual

- sidebar y topbar responsivos;
- búsqueda compartida entre casos, auditoría y usuarios;
- indicadores calculados desde la API;
- health check de FastAPI;
- creación real de solicitudes locales;
- cola de aprobación humana;
- aprobar solicitud → `POST /requests/{id}/approve` → aprovisionamiento REST;
- rechazar solicitud → `POST /requests/{id}/reject`;
- reintentar solicitudes en error;
- referencia externa generada al aprovisionar;
- auditoría individual mediante `/audit/{request_id}`;
- colección de auditoría mediante `GET /audit`;
- tabla de instancias actualizada desde la API;
- tema compartido desde `../theme/`.

## Secciones funcionales

### Dashboard

Resumen operativo con KPI, distribución de estados, estado de FastAPI, flujo activo, tareas pendientes e instancias recientes.

### Mis tareas

Bandeja de trabajo para solicitudes en `PENDING_APPROVAL` y `ERROR`. Permite aprobar, rechazar y reintentar desde la interfaz.

### Procesos

Vista del proceso **Solicitud de acceso a sistema corporativo**, con métricas, actores, reglas de decisión y flujo visual.

### Casos

Listado completo de instancias con filtros por estado, búsqueda, referencias externas y acciones contextuales.

### Diseño BPMN

Vista ampliada del flujo y catálogo de elementos BPMN utilizados: inicio, validación, tarea humana, gateway, service task y eventos de fin.

### Integraciones

Estado del servicio FastAPI, métricas REST y catálogo de endpoints. Los endpoints pueden copiarse directamente desde la interfaz.

### Auditoría

Timeline de aprovisionamientos reales de la sesión actual. Consume `GET /audit` y muestra request id, usuario, sistema, nivel de acceso, referencia externa y fecha.

### Usuarios

Directorio derivado de las solicitudes registradas. Agrupa usuarios únicos, sistemas solicitados, cantidad de solicitudes y accesos completados.

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
PENDING_APPROVAL
      ↓
Aprobar ──────────────── Rechazar
   ↓                         ↓
IN_PROGRESS              REJECTED
   ↓
REST /provision
   ↓
COMPLETED
   ↓
Referencia ACC-...
   ↓
GET /audit
```

## Persistencia de la demo

La Mock API utiliza almacenamiento **en memoria**. Cada reinicio de FastAPI restaura las solicitudes semilla y elimina las solicitudes/auditorías generadas durante la sesión anterior. Esto es deliberado para la demo académica y no representa almacenamiento de producción.

## Build de producción

```powershell
npm run build
```

## Variable de entorno opcional

Por defecto el frontend usa:

```text
http://localhost:8000
```

Puedes apuntarlo a otra API definiendo:

```text
VITE_API_BASE_URL=http://otro-host:8000
```

## Limitación académica

La UI y FastAPI ya forman un flujo local funcional y verificable. Sin embargo, **Bonita Studio continúa siendo el gate de runtime real** del proyecto. No debe presentarse esta aplicación como evidencia de un runtime Bonita ejecutado mientras `docs/ROADMAP.md` mantenga pendiente esa validación.
