# BonitaSoft BPM Dashboard — React

Dashboard visual ejecutable para el complemento práctico de ISO-815. Implementa la identidad del proyecto (azul profundo, azul eléctrico, rojo Bonita y blanco) sobre el caso **Solicitud de acceso a sistema corporativo**.

> Los indicadores, nombres e instancias mostrados en esta interfaz son **datos de demostración**. No representan métricas reales de Bonita Runtime.

## Incluye

- sidebar y topbar responsivos;
- búsqueda interactiva de instancias;
- tarjetas KPI;
- gráfica de rendimiento sin dependencias externas;
- distribución de estados;
- estado visual de la Mock API FastAPI;
- flujo BPM Solicitud → Validación → Aprobación → Gateway → REST / Rechazo;
- tareas y prioridades;
- tabla de instancias recientes;
- tema compartido desde `../theme/`.

## Ejecutar

```bash
cd ui/dashboard-react
npm install
npm run dev
```

Build de producción:

```bash
npm run build
```

Vista previa:

```bash
npm run preview
```

## Integración futura con Bonita

La UI es un frontend demostrativo independiente. Cuando el runtime de Bonita Studio quede validado, los datos estáticos se pueden sustituir por consultas a las APIs de Bonita y por el estado real del servicio `demo/mock-api`.

No debe presentarse este dashboard como evidencia de un runtime Bonita ejecutado mientras el gate de `docs/ROADMAP.md` continúe pendiente.
